"use client";

import { useState, useRef } from "react";
import { saveNote, updateNote } from "@/lib/actions/db";

type Block = {
  id: string;
  type: string;
  content: string;
  order_index?: number;
};

export default function NoteEditor({
  noteId,
  initialTitle,
  initialBlocks,
  folderId,
}: {
  noteId: string;
  initialTitle: string;
  initialBlocks: Block[];
  folderId: string | null;
}) {
  const [title, setTitle] = useState(initialTitle);

  const [blocks, setBlocks] = useState<Block[]>(
    
    initialBlocks.length > 0
      ? initialBlocks
      : [{ id: crypto.randomUUID(), type: "text", content: "" }]
  );

  const blockRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  function updateBlock(id: string, content: string) {
    setBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, content } : b))
    );
  }

  function addBlock(index: number) {
    const newBlock = {
      id: crypto.randomUUID(),
      type: "text",
      content: "",
    };

    setBlocks(prev => {
      const copy = [...prev];
      copy.splice(index + 1, 0, newBlock);
      return copy;
    });

    requestAnimationFrame(() => {
      blockRefs.current[newBlock.id]?.focus();
    });
  }

  function deleteBlock(index: number, id: string) {
    if (blocks.length === 1) return;

    const nextFocus =
      index > 0 ? blocks[index - 1] : blocks[index + 1];

    setBlocks(prev => prev.filter(b => b.id !== id));

    requestAnimationFrame(() => {
      blockRefs.current[nextFocus.id]?.focus();
    });
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    index: number,
    block: Block
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      addBlock(index);
    }

    if (e.key === "Backspace" && block.content === "") {
      e.preventDefault();
      deleteBlock(index, block.id);
    }
  }

  async function handleSave() {
    await updateNote(noteId, title, blocks);
  }

  return (
    <div className="p-12 min-h-screen">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent text-5xl font-bold outline-none"
        />

        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2.5 rounded-xl"
        >
          Save
        </button>
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-1">
        {blocks.map((block, index) => (
          <textarea
            key={block.id}
            ref={el => {blockRefs.current[block.id] = el}}
            value={block.content}
            rows={1}
            placeholder={index === 0 ? "Start writing…" : ""}
            className="bg-[#181719] w-full resize-none text-lg leading-relaxed outline-none rounded"
            onChange={e => updateBlock(block.id, e.target.value)}
            onKeyDown={e => handleKeyDown(e, index, block)}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
        ))}
      </div>
    </div>
  );
}

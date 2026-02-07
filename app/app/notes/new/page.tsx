"use client";
import React, { useState, useRef } from "react";
import { saveNote } from "@/lib/actions/db";
import { useSearchParams } from "next/navigation";
type Block = {
  id: string,
  type: string;
  content: string
}
export default function NewNote() {
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folderId')
  console.log(folderId)

  const [title, settitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([{id: crypto.randomUUID(), type: "text",content : ""}])
  const refBlock = useRef<{[key: string]: HTMLTextAreaElement | null}>({})
  function updateBlock(id: string, content: string){
    setBlocks(blocks.map((b)=>{
      return (b.id === id? {...b, content: content}: b)
    }))
  }
  function addNewBlock(index: number){
    const newBlock = {id: crypto.randomUUID(), type: "text", content: ""}
    const updatedBlocks = [...blocks]
    updatedBlocks.splice(index + 1, 0, newBlock)
    setBlocks(updatedBlocks)
    setTimeout(() => {
      refBlock.current[newBlock.id]?.focus();
    }, 0);
  }
  function deleteBlock(index: number, id: string ){
    if(blocks.length <= 1) return;
    setBlocks(blocks.filter((b)=>(b.id != id)))
    let newFocus = blocks[index - 1]
    if(index == 0){
      newFocus = blocks[index + 1]
    }
    setTimeout(() => {
      refBlock.current[newFocus.id]?.focus()
    }, 0);
  }
  function handleKeyDown(e:React.KeyboardEvent, index: number, block: Block){
    if(e.key == "Enter"){
      e.preventDefault()
      addNewBlock(index);
    }else if(e.key === "Backspace" && block.content == ""){
      e.preventDefault()
      deleteBlock(index, block.id)
    }
  }
  return(
    <div className="p-12 min-h-screen">
      <div className="flex items-center justify-between gap-4 pb-6 mb-1">
        <input 
          type="text" 
          placeholder="Untitled" 
          className="w-full bg-transparent text-5xl font-bold outline-none transition-colors "
          value={title}
          onChange={e => settitle(e.target.value)}
        />
        <button 
          className="bg-black text-white px-6 py-2.5 rounded-2xl font-medium hover:bg-gray-800 transition-all active:scale-95"
          onClick={e=>{
            e.preventDefault()
            saveNote(folderId, title, blocks)
          }}>
          Save
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        {blocks.map((block, index)=>(
          <textarea 
          key={block.id} 
          rows={1}
          ref = {el => {refBlock.current[block.id] = el}}
          placeholder={index === 0? "Start here": ""}
          value ={block.content}
          onChange={e=> updateBlock(block.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index, block)}
          className="bg-[#181719] w-full resize-none text-lg leading-relaxed py-0.5 block outline-none rounded "
          onInput={e=>{
            const target = e.target as HTMLTextAreaElement
            target.style.height = "auto"
            target.style.height = `${target.scrollHeight}px`
          }}
          />
        ))}
      </div>
      
    </div>
  )
}
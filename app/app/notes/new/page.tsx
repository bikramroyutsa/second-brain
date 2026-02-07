"use client";
import React, { useState, useRef } from "react";

type Block = {
  id: string,
  type: string;
  content: string
}
export default function NewNote() {
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
      <input type="text" placeholder="untitled" 
        className="w-full outline-none text-5xl font-bold mb-8"
        value = {title}
        onChange={e=>settitle(e.target.value)}
        />
      <div className="flex flex-col gap-0.5">
  {     blocks.map((block, index)=>(
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
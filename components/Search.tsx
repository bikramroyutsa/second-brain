"use client"
import { searchNote, semanticSearch } from "@/lib/actions/db"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "./useDebounce"
import Link from "next/link"
import { UUID } from "crypto"

export default function Search({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<{id: UUID, title: string, matched_content: string}[]>([])
  const [semanticSearchOn, toggleSemanticSearch] = useState<boolean>(false)
  const debouncedQuery = useDebounce(query, 500)
  async function fetchResults(){
    if(semanticSearchOn){
      const data = await semanticSearch(debouncedQuery)
      setResults(data)
    }else{
      const data = await searchNote(debouncedQuery)
      // console.log(data)
      setResults(data);
    }
    
  }
  useEffect(() => {
    if (open) inputRef.current?.focus()
    else return 
  }, [open])

  useEffect(()=>{
    if(debouncedQuery == "") setResults([])
    if (debouncedQuery) fetchResults()
  }, [debouncedQuery])

  return (
    <div
      className="fixed inset-0 z-50 flex-col items-center justify-items-center bg-black/40 backdrop-blur-sm pt-32"
      onClick={onClose}
    >
      {/* <button onClick={onclose}>close </button> */}
      <div
        className="w-full max-w-xl rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          ref={inputRef}
          placeholder="Search notes..."
          className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onInput={e=>{
            const target = e.target as HTMLTextAreaElement
            target.style.height = "auto"
            target.style.height = `${target.scrollHeight}px`
          }}
        />
        <div className="flex items-center justify-between px-2 py-3 mt-2">
          <label className="text-sm font-medium text-gray-400">
            {semanticSearchOn ? "🤖 Semantic Search On" : "🔍 Standard Search"}
          </label>
          <button
            onClick={() => toggleSemanticSearch(!semanticSearchOn)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              semanticSearchOn ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                semanticSearchOn ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        
      </div>
      <div className="flex flex-col w-full max-w-xl mt-4 rounded-2xl shadow-xl border">
        {(results.length === 0 && debouncedQuery == "")&& (
          <div className="p-4 text-sm text-center">
            Start typing to search…
          </div>
        )}
        {(results.length === 0 && debouncedQuery  != "") && 
        (
          <div className="p-4 text-sm text-center">
            No results found
          </div>
        )}
        {semanticSearchOn && results && results.map((r, i) => (
          <Link
            href={`/app/notes/${r.note_id}`}
            key={r.id}
            className={`block px-4 py-3 transition 
              hover:bg-gray-100 hover:text-black
              // ${i !== results.length - 1 ? "border-b" : ""}
            `}
          >
            <div className="font-medium ">{r.title}</div>
            {r.content && (
              <div className="text-sm text-gray-500 line-clamp-2">
                {r.content}
              </div>
            )}
          </Link>
        ))}
        {!semanticSearchOn &&results && results.map((r, i) => (
          <Link
            href={`/app/notes/${r.id}`}
            key={r.id}
            className={`block px-4 py-3 transition 
              hover:bg-gray-100 hover:text-black
              // ${i !== results.length - 1 ? "border-b" : ""}
            `}
          >
            <div className="font-medium ">{r.title}</div>

            {r.matched_content && (
              <div className="text-sm text-gray-500 line-clamp-2">
                {r.matched_content}
              </div>
            )}
          </Link>
        ))}
      </div>

      
    </div>
  )
}

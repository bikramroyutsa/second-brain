"use client"
import { searchNote } from "@/lib/actions/db"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "./useDebounce"

export default function Search({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState([])
  const debouncedQuery = useDebounce(query, 500)
  async function fetchResults(){
    const data = await searchNote(debouncedQuery)
    console.log(data)
    setResults(data);
  }
  useEffect(() => {
    if (open) inputRef.current?.focus()
    else return 
  }, [open, debouncedQuery])

  useEffect(()=>{
    if (!debouncedQuery) return
    fetchResults()
  }, [debouncedQuery])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-32"
      onClick={onClose}
    >
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
        <div className="mt-4 text-sm text-gray-500">
          Start typing to search…
        </div>
      </div>
    </div>
  )
}

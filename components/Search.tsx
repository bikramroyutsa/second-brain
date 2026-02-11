"use client"
import { useEffect, useRef } from "react"

export default function Search({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

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

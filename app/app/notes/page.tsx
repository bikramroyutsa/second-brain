// check for notes or folders at root
// then check for notes and folders at each level inside folder
"use client"
import { loadFolders, loadNotes } from "@/lib/actions/db"
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Notes(){
    const [currFolder, setCurrFolder] = useState<UUID | null>(null);
    const [currNotes, setCurrNotes] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        async function fetchNotes() {
            setLoading(true);
            const notes = await loadNotes(currFolder);
            setCurrNotes(notes);
            setLoading(false);
        }

        fetchNotes();
    }, [currFolder]);
    return(
        <div>
            {loading && <p>loading...</p>}
            <Link href={currFolder ? `app/notes/new?folderId=${currFolder}`: "/app/notes/new"}>
                <button>New note</button>
            </Link>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {currNotes && currNotes.map(note => (
                    <Link href={`/app/notes/${note.id}`} key={note.id}>
                        <div className="w-full bg-[#645050] text-white p-6 rounded-xl aspect-square flex flex-col justify-between hover:bg-[#7a6262] transition-colors cursor-pointer">
                            <h3 className="text-xl font-semibold truncate">
                                {note.title || "Untitled"}
                            </h3>
                            <span className="text-xs opacity-50">Note</span>
                        </div>
                    </Link>
                ))}
            </div>
            
        </div>
    )
}
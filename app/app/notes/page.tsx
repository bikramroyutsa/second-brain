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
            {currNotes && currNotes.map(note => (
                <div key={note.id}>
                {note.title}
                </div>
            ))}
        </div>
    )
}
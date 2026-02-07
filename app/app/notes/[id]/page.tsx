// app/notes/[id]/page.tsx

import NoteEditor from "@/components/NoteEditor";
import { loadNoteBlocks, loadNoteById } from "@/lib/actions/db";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const noteInfo = await loadNoteById(id);
    const noteBlocks = await loadNoteBlocks(id);
    return (
        <div className="p-8">
        <NoteEditor
            noteId={id}
            initialTitle={noteInfo.title}
            initialBlocks={noteBlocks}
            folderId={noteInfo.folder_id}
        />
        </div>
    );
}

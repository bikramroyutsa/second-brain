// check for notes or folders at root
// then check for notes and folders at each level inside folder
"use client";
import { createNewFolder, loadFolders, loadNotes } from "@/lib/actions/db";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Folder, FileText, ChevronLeft } from "lucide-react";
import NewFolderModal from "@/components/NewFolder";

export default function Notes() {
  const [currFolder, setCurrFolder] = useState< {name: string, id: UUID, parent_id: UUID | null, user_id: UUID | null}| null>(null);
  const [folders, setFolders] = useState<any[] | null>(null)
  const [currNotes, setCurrNotes] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function refreshData() {
    setLoading(true);
    const [foldersData, notesData] = await Promise.all([
      loadFolders(currFolder?.id ?? null),
      loadNotes(currFolder?.id ?? null)
    ]);
    setFolders(foldersData);
    setCurrNotes(notesData);
    setLoading(false);
  }
  useEffect(() => {
    refreshData()
  }, [currFolder]);
  const handleCreateFolder = async (name: string) => {
    await createNewFolder(name, currFolder?.id ?? null)
    await refreshData()
  };
  return (
    <div>
      <NewFolderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateFolder} 
      />
      {/* <Search/> */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {currFolder ? <div>{currFolder.name}</div>: <div>Root</div>}
        </div>
        
        <div className="flex gap-2">
          <button className="bg-[#645050] text-white px-4 py-2 rounded-lg hover:bg-[#4a3c3c] transition-colors"
            onClick={() => setIsModalOpen(true)}>
            + New folder
          </button>
          <Link href={currFolder ? `/app/notes/new?folderId=${currFolder.id}` : "/app/notes/new"}>
            <button className="bg-[#645050] text-white px-4 py-2 rounded-lg hover:bg-[#4a3c3c] transition-colors">
              + New note
            </button>
          </Link>
        </div>
        
      </div>

      {/* {loading && <p className="text-gray-500 italic">loading...</p>} */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-12">
        {folders?.map((f) => (
          <div 
            key={f.id}
            onClick={() => setCurrFolder(f)}
            className="group relative cursor-pointer"
          >
            <div className="w-12 h-2 bg-[#d1bcbc] rounded-t-md ml-1 group-hover:bg-[#b89e9e] transition-colors" />

            <div className="w-full bg-[#d1bcbc] group-hover:bg-[#b89e9e] p-4 rounded-xl rounded-tl-none aspect-4/3 flex flex-col justify-center items-center gap-2 transition-all shadow-sm group-hover:shadow-md">
              <Folder className="text-[#645050]" fill="currentColor" opacity={0.2} />
              <span className="font-medium text-[#4a3c3c] truncate w-full text-center">
                {f.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {currNotes?.map((note) => (
          <Link href={`/app/notes/${note.id}`} key={note.id}>
            <div className="w-full bg-[#645050] text-white p-6 rounded-xl aspect-square flex flex-col justify-between hover:scale-[1.02] hover:bg-[#7a6262] transition-all cursor-pointer shadow-lg">
              <div className="flex justify-between items-start">
                <FileText size={18} className="opacity-40" />
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-tight mb-1 line-clamp-2">
                  {note.title || "Untitled"}
                </h3>
                <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Note</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

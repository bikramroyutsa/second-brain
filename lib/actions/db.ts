'use server'

import { UUID } from "crypto";
import { createClient } from "../supabase/server";
type Block = {
  id: string,
  type: string;
  content: string
}
export async function loadFolders(parentId: UUID | null){
    const supabase = await createClient();
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    console.log(user)
    if(userError || !user){
        throw new Error("User not logged in");
    }
    let query = supabase.from("folders").select("*").eq("user_id", user.id);

    if (parentId === null) {
        query = query.is("parent_id", null);
    } else {
        query = query.eq("parent_id", parentId);
    }
    const { data, error } = await query;
    if(error) throw error;
    console.log(data)
    return data;
}
export async function loadNotes(folderId: UUID | null){
    const supabase = await createClient();
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    if(userError || !user){
        throw new Error("User not logged in");
    }
    let query = supabase.from("notes").select("*").eq("user_id", user.id);

    if (folderId === null) {
        query = query.is("folder_id", null);
    } else {
        query = query.eq("folder_id", folderId);
    }
    const { data, error } = await query;
    if(error) throw error;
    return data;
}
export async function loadNoteBlocks(noteId: UUID){
    const supabase = await createClient();
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    if(userError || !user){
        throw new Error("User not logged in");
    }
    let query = supabase
                .from("note_blocks")
                .select("*")
                .eq("note_id", noteId);

    const { data, error } = await query;
    if(error) throw error;
    return data;
}
export async function saveNote(parentFolderID: UUID | null, title: string, blocks: Block[]){
    const supabase = await createClient()
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    if(userError || !user){
        throw new Error("User not logged in");
    }
    const {data:noteData, error: noteError} = await supabase
                                        .from("notes")
                                        .insert({user_id: user.id, folder_id: parentFolderID, title: title})
                                        .select()
                                        .single()
    if(noteError){
        // console.log(noteError)
        throw new Error(noteError.message)
    }else{
        console.log(noteData)
    }

    const blocksToInsert = blocks.map((b, index) => ({
        note_id: noteData.id,
        type: "text",
        user_id: user.id,
        content: b.content,
        order_index: index,
        }));

    const { data: insertedBlocks, error: blocksError } = await supabase
                                                        .from("note_blocks")
                                                        .insert(blocksToInsert)
                                                        .select()

    if (blocksError) {
        console.error(blocksError);
    } else {
        console.log("Inserted blocks:", insertedBlocks)
    }
}

export async function loadNoteById(noteId: UUID | null){
    const supabase = await createClient()
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    if(userError || !user){
        throw new Error("User not logged in");
    }
    const {data, error} = await supabase
                                .from("notes")
                                .select("*")
                                .eq("id", noteId)
                                .single()
    if(error){
        console.log(error)
        throw new Error(error.message)
    }
    return data;
}
export async function updateNote(noteId: string, title: string, blocks: Block[]){
    const supabase = await createClient()
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    if(userError || !user){
        throw new Error("User not logged in");
    }
    const {data:noteData, error: noteError} = await supabase
                                            .from("notes")
                                            .update({title})
                                            .eq("id", noteId)
                                            .select()
                                            .single()
    if(noteError){
        throw noteError
    }
    const { error: deleteError } = await supabase
        .from("note_blocks")
        .delete()
        .eq("note_id", noteId)

    if (deleteError) throw deleteError

    const blocksToInsert = blocks.map((b, index) => ({
        note_id: noteId,
        type: b.type || "text",
        user_id: user.id, 
        content: b.content,
        order_index: index,
    }));
    const { data: insertedBlocks, error: blocksError } = await supabase
        .from("note_blocks")
        .insert(blocksToInsert)
        .select()

    if (blocksError) throw blocksError
    
    return { noteData, insertedBlocks }
}
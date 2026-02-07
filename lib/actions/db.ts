'use server'

import { UUID } from "crypto";
import { createClient } from "../supabase/server";
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
    console.log(data)
    return data;
}
export async function loadNoteBlocks(noteId: UUID | null){
    const supabase = await createClient();
    const {data: {user}, error:userError} = await supabase.auth.getUser();
    if(userError || !user){
        throw new Error("User not logged in");
    }
    let query = supabase.from("note_blocks").select("*").eq("user_id", user.id);

    if (noteId === null) {
        query = query.is("note_id", null);
    } else {
        query = query.eq("note_id", noteId);
    }
    const { data, error } = await query;
    if(error) throw error;
    console.log(data)
    return data;
}
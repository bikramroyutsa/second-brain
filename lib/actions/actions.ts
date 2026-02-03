"use server"
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server"

export async function logout(){
    const supabase = await createClient();
    console.log("loggin out")
    const {error} = await supabase.auth.signOut();
    if(error){
        throw new Error(error.message);
    }
    redirect("/");
}
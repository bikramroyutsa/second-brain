'use server'
import ollama from 'ollama'

import { UUID } from "crypto";
import { createClient } from "../supabase/server";

import { getEmbedding } from "./embedding"
interface Block{
    id: UUID,
    note_id: UUID,
    type: string,
    content: string,
}
export async function getResponse(input: string){
    const supabase = await createClient()
    const inputEmbedding = await getEmbedding(input)
    const { data: matched_blocks } = await supabase.rpc('match_blocks', {
        query_embedding: inputEmbedding, 
        match_threshold: 0.78, 
        match_count: 10,
    })
    console.log(matched_blocks)
    let contentString = matched_blocks.map((b: Block)=>b.content).join("\n") ?? ""
    const prompt = `
        You are an assistant that answers ONLY using the provided knowledge base.
        If the answer is not contained in the knowledge base, reply exactly:
        "I cannot answer based on the knowledge base."

        Question:
        ${input}

        Knowledge base:
        ${contentString}
        `.trim();
    const response = await ollama.chat({
        model: 'llama3.2:3b',
        messages: [
            { role: "system", content: "Follow instructions strictly." },
           { role: "user", content: prompt },
            ],
        })
    // console.log(response)
    return response.message.content
}
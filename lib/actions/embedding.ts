'use server'
// import dotenv from "dotenv"
// dotenv.config({ path: ".env.local" })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!)

export async function getEmbedding(noteContent: string) {
  // console.log(noteContent)
  const { data, error } = await supabase.functions.invoke('embed', {
    body: { input: noteContent }
  })
  
  if (error) {
    console.error('Error getting embedding:', error)
    return null
  }
  // console.log('Embedding received:', data.embedding)
  // console.log(data)
  return data.embedding
}
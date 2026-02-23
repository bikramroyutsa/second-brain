'use server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_EMBED_SERVER_URL!, process.env.NEXT_PUBLIC_EMBED_SERVER_KEY!)

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
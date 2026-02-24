import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { createClient } from '@supabase/supabase-js'
import { getEmbedding } from "../actions/embedding.ts"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
)

async function embedNonEmbed() {
    const { data: note_blocks, error: fetchError } =
        await supabase
        .from('note_blocks')
        .select('id, content')
        .eq('type', 'text')
        .is('embedding', null)

    if (fetchError) throw fetchError
    if (!note_blocks?.length) {
        console.log("No blocks to embed.")
        return
    }
    let blocksToUpdate = await Promise.all(
        note_blocks!.map(async (b) => {
            const embedding = await getEmbedding(b.content);
            if(!embedding) return null
            return {
                id: b.id,
                embedding
        };
    }));
    const final = blocksToUpdate.filter(Boolean)
    await Promise.all(
        final.map(async(block)=>{
            const {error} = await supabase
                .from('note_blocks')
                .update({embedding: block?.embedding})
                .eq('id', block?.id)
            if(error) throw error
        })
    )
    console.log("end")
}

embedNonEmbed()
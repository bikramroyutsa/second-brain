// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      
      <main>
        {user ? (
          <div>
            <p>Welcome, {user.email}!</p>
            <Link href="/app/dashboard">GO TO APP</Link>
          </div>
        ) : (
          <p>You are not logged in.</p>
        )}
      </main>
    </div>
  )
}
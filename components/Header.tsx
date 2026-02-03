import { logout } from "@/lib/actions/actions";
import { createClient } from "@/lib/supabase/server";
export async function Header(){
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return(
        <div className="flex items-center justify-between p-3">
            <div>Second brain</div>
            {user && <button onClick={logout}>Logout</button>}
            
        </div>
    )
}
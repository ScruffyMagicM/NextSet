import Link from "next/link";
import { createClient } from "@/auth/supabase/client";
import { redirect } from "next/navigation";
import { getProfile } from "@/auth/supabase/getProfile";

async function signOut() {
    //TODO: Create a prompt for this instead of automatic sign out

    'use server'
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export default async function SideNav() {
    const user = await getProfile();

    return (
        <div className="h-full bg-gray-800 text-white p-6">
            <div className="flex">
                <div className="flex-initial justify-left w-5/6">
                    <h2 className="text-2xl font-bold mb-6"><Link href="/">NextSet</Link></h2>
                </div>
                <div className="flex-none justify-right w-1/6">
                    <h2 className="text-2xl font-bold mb-6"><Link href="/user"><img src={user?.profile.pfp_url || "/default_pfp.png"} alt="NS"></img></Link></h2>
                </div>
            </div>
            <nav className="space-y-4">
                <Link href="/festivals" className="block px-4 py-2 rounded hover:bg-gray-700">Festivals</Link>
                <Link href="/pastfestivals" className="block px-4 py-2 rounded hover:bg-gray-700">Past Festivals</Link>
                <Link href="/announcements" className="block px-4 py-2 rounded hover:bg-gray-700">Announcements</Link>
                <hr/>

                <form className="px-4 py-2 rounded" action={signOut}>
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                </form>
            </nav>
        </div>
    );
}
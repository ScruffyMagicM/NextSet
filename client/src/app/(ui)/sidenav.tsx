import Link from "next/link";
import { createClient } from "../auth/supabase/client";
import { redirect } from "next/navigation";

async function signOut() {
    'use server'
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export default async function SideNav() {
    return (
        <div className="h-full bg-gray-800 text-white p-6">
            <h2 className="text-2xl font-bold mb-6"><Link href="/">NextSet</Link></h2>
            <nav className="space-y-4">
                <Link href="/festivals" className="block px-4 py-2 rounded hover:bg-gray-700">Festivals</Link>
                <Link href="/pastfestivals" className="block px-4 py-2 rounded hover:bg-gray-700">Past Festivals</Link>
                <Link href="/announcements" className="block px-4 py-2 rounded hover:bg-gray-700">Announcements</Link>
                <hr/>

                <form action={signOut}>
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </form>
            </nav>
        </div>
    );
}
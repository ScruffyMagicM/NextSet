'use client';

import Link from "next/link";
import LoginButton from "@/auth/ui/login.button";
import Groups from "../../components/groups.component";
import { useUser } from "@/contexts/UserContext";
import { useGroup } from "@/contexts/GroupContext";

export default function SideNav() {
    const user = useUser();
    const { group_id, setGroupId } = useGroup();

    return (
        <div className="h-full bg-gray-800 text-white p-6">
            <div className="flex">
                <div className="flex-initial justify-start w-6/8">
                    <h2 className="text-2xl font-bold mb-6"><Link href="/">NextSet</Link></h2>
                </div>
                <div className="flex justify-between w-2/8">
                    <h2 className="text-2xl font-bold mb-6" hidden={user === null}><Link href="/user"><img src={user?.profile?.pfp_url || "/pfp.png"} alt="NS"></img></Link></h2>
                    <h2 className="justify-end" hidden={user !== null}><LoginButton /></h2>
                </div>
            </div>
            <nav className="space-y-4">
                <div>Festival Details</div>
                <Link href="/upcomingfestivals" className="block px-4 py-2 rounded hover:bg-gray-700">Back to Festivals</Link>
                <div hidden={user === null}>
                    <div onClick={() => setGroupId(null)}>My Schedule</div>
                    <Groups />
                </div>
                <hr/>
            </nav>
        </div>
    );
}
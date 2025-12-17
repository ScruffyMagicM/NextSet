'use client';

import { getUserGroups } from "@/supabase/actions/client/groups/getUserGroups";
import { useEffect, useState } from "react";
import CreateGroupModal from "./createGroup.modal";
import { Festival } from "@shared/types/festival.types";

export default function Groups({ user_id, festival }: { user_id: string | undefined, festival?: Festival }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [groups, setGroups] = useState<Record<number, { name: string; member_count: number }>>({});

    if (!user_id || !festival) {
        return (
            <div/>
        );
    }

    function reloadAfterAdd(newGroups: Record<number, { name: string; member_count: number }>) {
        const newestGroups = { ...groups, ...newGroups };
        setGroups(newestGroups);
        setIsCreateModalOpen(false);
    }

    useEffect(() => {
        const loadGroups = async () => {
            const initialGroups = await getUserGroups(festival.id, user_id);
            if (initialGroups) {
                setGroups(initialGroups);
            }
        };
        loadGroups();
    },[]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Groups</h1>
            {groups && Object.keys(groups).length > 0 ? (
                <div>
                    <ul>
                        {Object.entries(groups).map(([group_id, group]) => (
                            <li key={group_id} className="mb-2 p-4 border rounded-lg shadow">
                                <h2 className="text-xl font-semibold">{group.name} : {group.member_count}</h2>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p/>
            )}
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>Add Group</button>
            {isCreateModalOpen && <CreateGroupModal onCloseCreate={reloadAfterAdd} onCloseQuit={() =>setIsCreateModalOpen(false)} festival_id={festival.id} />}
        </div>
    );
}
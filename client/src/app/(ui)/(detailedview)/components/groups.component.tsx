'use client';

import { getUserGroups } from "@/supabase/actions/client/groups/getUserGroups";
import { useEffect, useState } from "react";
import CreateGroupModal from "./createGroup.modal";
import { useUser } from "@/contexts/UserContext";
import { useFestival } from "@/contexts/FestivalContext";
import { useGroup } from "@/contexts/GroupContext";

export default function Groups() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [groups, setGroups] = useState<Record<number, { name: string; member_count: number }>>({});
    const { profile } = useUser();
    const { festival } = useFestival();
    const { group_id, setGroupId } = useGroup();

    if (!profile?.id) {
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
            const initialGroups = await getUserGroups(festival.id, profile.id);
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
                        {Object.entries(groups).map(([curr_group_id, group]) => (
                            <li key={curr_group_id} className={"mb-2 p-4 border rounded-lg shadow" + (group_id === curr_group_id ? " bg-blue-100" : "")} onClick={() => setGroupId(curr_group_id)}>
                                <h2 className="text-xl font-semibold">{group.name} : {group.member_count}</h2>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p/>
            )}
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>Add Group</button>
            {isCreateModalOpen && <CreateGroupModal onCloseCreate={reloadAfterAdd} onCloseQuit={() =>setIsCreateModalOpen(false)} />}
        </div>
    );
}
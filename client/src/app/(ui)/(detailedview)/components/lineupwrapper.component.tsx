'use client';

import Lineup from "./lineup.component";
import { useEffect, useState } from "react";
import { useGroup } from "@/contexts/GroupContext";
import getGroupSetPreferences from "@/supabase/actions/client/groups/getGroupPreferences";
import { Profile } from "@shared/types/user.types";

export default function LineupWrapper() {
    const [ groupPreferences, setGroupPreferences] = useState<Map<number, Profile[]> | null>(null);
    const { group_id } = useGroup();

    useEffect(() => {
        if (group_id) {
            const asyncGroupPreferences = async () => {
                const preferences = await getGroupSetPreferences(group_id);
                setGroupPreferences(preferences);
            }

            asyncGroupPreferences();
        }
        else {
            setGroupPreferences(null);
        }
    }, [group_id]);

    return (
        <div>
            <Lineup groupPreferences={groupPreferences} />
        </div>
    )
}
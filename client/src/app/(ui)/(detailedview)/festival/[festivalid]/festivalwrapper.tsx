'use client';

import { GroupProvider } from "@/contexts/GroupContext";
import { useState } from "react";
import SideNav from "@/(ui)/(detailedview)/components/sidenav.component";
import { Festival } from "@shared/types/festival.types";
import { FestivalProvider } from "@/contexts/FestivalContext";

export default function FestivalWrapper({ children, festival }: { children: React.ReactNode, festival: Festival }) {
    const [group_id, setGroupId] = useState<string | null>(null);

    return (
        <div>
            <FestivalProvider festival={festival}>
            <GroupProvider group_id={group_id} setGroupId={setGroupId}>
                <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                    <div className="w-full flex-none md:w-64">
                        <SideNav />
                    </div>
                    <div className="grow p-6 md:overflow-y-auto md:p-12">
                        {children}
                    </div>
                </div>
            </GroupProvider>
            </FestivalProvider>
        </div>
    )
}
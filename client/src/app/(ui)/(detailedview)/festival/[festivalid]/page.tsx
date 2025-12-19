'use client';

import LineupWrapper from "../../components/lineupwrapper.component";
import { useFestival } from "@/contexts/FestivalContext";

export default function FestivalPage() {
    const { festival } = useFestival();

    return (
    <div>
        <h1 className="text-3xl font-bold">{festival.name}</h1>
        
        <LineupWrapper />
    </div>
    );
}
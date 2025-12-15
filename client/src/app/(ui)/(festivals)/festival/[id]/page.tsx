import getFestival from "@/supabase/actions/server/festival/getFestival";
import Lineup from "../lineup.component";

export default async function FestivalPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const festival = await getFestival(id);

    return (
    <div>
        <h1 className="text-3xl font-bold">{festival.name}</h1>
        
        <Lineup festival={ festival } />

    </div>
    );
}
import getFestivals from "@/supabase/actions/server/festival/getFestivals";
import FestivalListComponent from "../festivalList.component";
import { Festival } from "@shared/types/festival.types";

export default async function FestivalsPage() {

    const festivals = await getFestivals();

    const festivalsByMonth = festivals.reduce<Record<string, Festival>>((acc: any, festival) => {
        const month = new Date(festival.start_date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(festival);
        return acc;
    }, {});

    return (
        <FestivalListComponent festivalsByMonth={festivalsByMonth}/>
    );
}
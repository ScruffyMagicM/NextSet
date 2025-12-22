import getFestivals from "@/supabase/actions/server/festival/getFestivals";
import { Festival } from "@shared/types/festival.types";
import FestivalListComponent from "../components/festivalList.component";

export default async function PastFestivalsPage() {

    const festivals = await getFestivals(false);

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
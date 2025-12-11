import getFestivals from "@/supabase/actions/festival/getFestivals";
import MonthComponent from "@/(ui)/(festivals)/month.component";

export default async function FestivalsPage() {
    
    const festivals = await getFestivals();
    
    const festivalsByMonth = festivals.reduce((acc: any, festival) => {
        const month = new Date(festival.start_date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(festival);
        return acc;
    }, {});

    const monthsGroups = Object.keys(festivalsByMonth).map((month: string) => (
            <div key={month} className="mb-2">
                <MonthComponent month={month} festivals={festivalsByMonth[month]} />
                <hr />
            </div>
        ));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Festivals Page</h1>
            {monthsGroups}
        </div>
    );
}
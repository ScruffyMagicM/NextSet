import Link from "next/link";

export default function MonthComponent({ month, festivals }: { month: string, festivals: any[] }) {
    const festivalsInMonth = festivals.map((festival) => (
        <div key={festival.id} className="mb-4">
            <div className="w-64 h-80 overflow-hidden">
                <Link href={`/festival/${festival.id}`}>
                <img
                    src={festival?.poster_url || "/pfp.png"}
                    alt="Festival Poster"
                    className="w-full h-auto"
                />
                </Link>
            </div>
            <h4 className="text-lg font-medium mb-2">{festival?.name}</h4>
        </div>
    ));

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Festivals in {month}</h2>
            {festivalsInMonth}
        </div>
    );
}
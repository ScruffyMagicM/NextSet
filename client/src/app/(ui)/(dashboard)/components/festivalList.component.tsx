'use client';

import { useState } from "react";
import MonthComponent from "./month.component";

export default function FestivalListComponent({festivalsByMonth}: any) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFestivalsByMonth = Object.keys(festivalsByMonth).reduce((acc: any, month: string) => {
        const filteredFestivals = festivalsByMonth[month].filter((festival: any) =>
            festival.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Only include the month if it has festivals matching the search
        if (filteredFestivals.length > 0) {
            acc[month] = filteredFestivals;
        }
        
        return acc;
    }, {});
    
    const monthsGroups = Object.keys(filteredFestivalsByMonth).map((month: string) => (
        <div key={month} className="mb-2">
            <MonthComponent month={month} festivals={filteredFestivalsByMonth[month]} />
            <hr />
        </div>
    ));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Festivals Page</h1>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
            />
            {monthsGroups}
        </div>
    );
}
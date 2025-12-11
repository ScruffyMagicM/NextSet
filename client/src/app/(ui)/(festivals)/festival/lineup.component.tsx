'use client';
import { Festival } from "@shared/types/festival.types";
import { useState } from "react";

export default function Lineup({ festival }: { festival: Festival }) {
    const [selectedDay, setSelectedDay] = useState(0);
    
    const startingHour = festival.openingTimes[selectedDay];
    const endingHour = festival.closingTimes[selectedDay];

    // Convert set time to minutes from festival start, handling midnight crossover
    const getMinutesFromStart = (hour: number, minute: number, crossesMidnight: boolean) => {
        let targetHour = hour;
        
        // If set crosses midnight and hour is "early" (e.g., 1 AM), treat it as next day
        if (crossesMidnight && hour < 12) {
            targetHour = hour + 24;
        }
        
        // If festival starts late (e.g., 2 PM) and we haven't crossed midnight yet
        // but the hour is "early" (e.g., before noon), it must be next day
        if (!crossesMidnight && startingHour > 12 && hour < startingHour && hour < 12) {
            targetHour = hour + 24;
        }
        
        const totalMinutes = (targetHour * 60 + minute) - (startingHour * 60);
        return totalMinutes * 2;
    };

    // Calculate total minutes from start to end
    const getTotalMinutes = () => {
        let endHourAdjusted = endingHour;
        
        // If ending hour appears to be "before" starting hour, it's next day
        if (endingHour <= startingHour) {
            endHourAdjusted = endingHour + 24;
        }
        
        return (endHourAdjusted - startingHour) * 60;
    };

    // Generate time labels for each hour
    const generateTimeLabels = () => {
        const labels = [];
        let currentHour = startingHour;
        let minutesFromStart = 0;
        
        const totalMinutes = getTotalMinutes();
        
        while (minutesFromStart <= totalMinutes) {
            const displayHour = currentHour % 24;
            labels.push({
                hour: displayHour,
                position: minutesFromStart * 2,
                displayTime: `${String(displayHour).padStart(2, '0')}:00`
            });
            
            // Move to next hour
            currentHour++;
            minutesFromStart = (currentHour - startingHour) * 60;
        }
        
        return labels;
    };

    // Get stages for selected day
    const getStagesForDay = () => {
        return festival.stages.filter(stage => stage.days.includes(selectedDay));
    };

    const timeLabels = generateTimeLabels();
    const stagesForDay = getStagesForDay();
    const totalHeight = getTotalMinutes() * 2;

    return (
        <div className="p-4">
            {/* Day selector */}
            <div className="flex gap-2 mb-4">
                {festival.dayNames.map((dayName, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded ${
                            selectedDay === index 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setSelectedDay(index)}
                    >
                        {dayName}
                    </button>
                ))}
            </div>

            {/* Grid container */}
            <div className="flex">
                {/* Time scale column */}
                <div className="relative" style={{ width: '20px', minWidth: '20px' }}>
                    {/* Sticky header for time column */}
                    <div className="h-12 border-gray-300 bg-black-100 font-bold flex items-center justify-center sticky top-0 z-10" />
                    {/* Time labels */}
                    <div className="relative" style={{ height: `${totalHeight}px` }}>
                        {timeLabels.map((label, index) => (
                            <div
                                key={index}
                                className="absolute w-full text-right pr-2 text-sm text-gray-600 border-t border-gray-200"
                                style={{ top: `${label.position}px` }}
                            >
                                {label.hour}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stages columns */}
                <div className="flex flex-1">
                    {stagesForDay.map((stage) => (
                        <div key={stage.id} className="flex-1 min-w-[100px] max-w-[200px] border-l border-gray-300">
                            {/* Stage header */}
                            <div className="h-12 border-gray-300 bg-black-100 font-bold flex items-center justify-center sticky top-0 z-10">
                                {stage.name}
                            </div>
                            
                            {/* Sets for this stage */}
                            <div className="relative" style={{ height: `${totalHeight}px` }}>
                                {/* Hour grid lines */}
                                {timeLabels.map((label, index) => (
                                    <div
                                        key={index}
                                        className="absolute w-full border-t border-gray-200"
                                        style={{ top: `${label.position}px` }}
                                    />
                                ))}
                                
                                {/* Sets */}
                                {festival.setsByDayAndStage.get(selectedDay)?.get(stage.id)?.map((set) => {
                                    const topPosition = getMinutesFromStart(
                                        set.start_hour, 
                                        set.start_minute, 
                                        set.crosses_midnight
                                    );
                                    const bottomPosition = getMinutesFromStart(
                                        set.end_hour, 
                                        set.end_minute, 
                                        set.crosses_midnight
                                    );
                                    const height = bottomPosition - topPosition;
                                    
                                    return (
                                        <div
                                            key={set.id}
                                            className="absolute left-1 right-1 bg-blue-500 text-white p-2 rounded shadow-md overflow-hidden hover:bg-blue-600 cursor-pointer transition-colors"
                                            style={{
                                                top: `${topPosition + 2}px`,
                                                height: `${height}px`
                                            }}
                                        >
                                            <div className="font-bold text-sm truncate">{set.artist}</div>
                                            <div className="text-xs opacity-90">
                                                {String(set.start_hour).padStart(2, '0')}:
                                                {String(set.start_minute).padStart(2, '0')} - 
                                                {String(set.end_hour).padStart(2, '0')}:
                                                {String(set.end_minute).padStart(2, '0')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
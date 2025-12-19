'use client';

import getUserSetPreferences from "@/supabase/actions/client/user/setPreferences/getUserSetPreferences";
import { Festival, Set } from "@shared/types/festival.types";
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from "react";
import { Profile, UserSet } from "@shared/types/user.types";
import deleteUserSetPreference from "@/supabase/actions/client/user/setPreferences/deleteUserSetPreference";
import upsertUserSetPreference from "@/supabase/actions/client/user/setPreferences/upsertUserSetPreference";
import { useFestival } from "@/contexts/FestivalContext";
import { useGroup } from "@/contexts/GroupContext";

export default function Lineup({ groupPreferences }: { groupPreferences: Map<number, Profile[]> | null}) {
    const [selectedDay, setSelectedDay] = useState(0);
    const [userSets, setUserSets] = useState<Map<number, UserSet>>();
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    const { profile } = useUser();
    const { festival } = useFestival();
    const { group_id } = useGroup();

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

    function updatePreference(userId: string, set: Set) {
        if (!userId || isUpdating === set.id || userSets === undefined) return;

        setIsUpdating(set.id);
        (async () => {
            try {
                const currentUserSet = userSets.get(set.id);
                let newRank: number;

                if (!currentUserSet) {
                    // Not set yet, start at rank 1
                    newRank = 1;
                } else if (currentUserSet.rank === 2) {
                    // At max rank, remove the preference
                    await deleteUserSetPreference(userId, currentUserSet.set_id);

                    // Update local state
                    const newUserSets = new Map(userSets);
                    newUserSets.delete(set.id);
                    setUserSets(newUserSets);
                    setIsUpdating(null);
                    return;
                } else {
                    // Increment rank
                    newRank = currentUserSet.rank + 1;
                }

                // Upsert the preference
                const result = await upsertUserSetPreference(userId, set.id, newRank);

                if (result) {
                    // Update local state
                    const newUserSets = new Map(userSets);
                    newUserSets.set(set.id, result);
                    setUserSets(newUserSets);
                }


            } catch (error) {
                console.error('Error updating preference:', error);
            }
        })();

        setIsUpdating(null);
    }

    useEffect(() => {
        if (!profile)
            return;

        let isMounted = true; // Flag to track component mount status

        const getPrefs = async () => {
            const prefs = await getUserSetPreferences(profile?.id, festival.id);
            if (isMounted) {
                setUserSets(prefs);
            }
        }

        getPrefs();

        return () => {
            isMounted = false;
        };
    }, [])

    return (
        <div className="p-4">
            {/* Day selector */}
            <div className="flex gap-2 mb-4">
                {festival.dayNames.map((dayName, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded cursor-pointer ${selectedDay === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => setSelectedDay(index)}
                    >
                        {dayName}
                    </button>
                ))}
                <button className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer" hidden={group_id === null} onClick={() => {navigator.clipboard.writeText(`https://localhost:3000/festival/${festival.id}/joingroup/${group_id}`)}}>Share</button>
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
                                            onClick={() => updatePreference(profile!.id, set)}
                                        >
                                            <div className="font-bold text-sm truncate">{set.artist}</div>
                                            <div className="text-xs opacity-90">
                                                {String(set.start_hour).padStart(2, '0')}:
                                                {String(set.start_minute).padStart(2, '0')} -
                                                {String(set.end_hour).padStart(2, '0')}:
                                                {String(set.end_minute).padStart(2, '0')}

                                                <div className="absolute bottom-0 left-0 bg-yellow-400 text-black px-1 rounded" hidden={!userSets?.has(set.id) || userSets?.get(set.id)?.rank === 0}>
                                                    {userSets?.get(set.id)?.rank}
                                                </div>
                                                <div className="absolute bottom-0 right-0 bg-yellow-400 text-black px-1 rounded" hidden={groupPreferences === null || !groupPreferences?.has(set.id)}>
                                                    {groupPreferences?.get(set.id)?.map((profile) => 
                                                            <img src={profile.pfp_url!} alt={profile.username} className="w-4 h-4 rounded-full mr-1" />
                                                        )}
                                                </div>
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
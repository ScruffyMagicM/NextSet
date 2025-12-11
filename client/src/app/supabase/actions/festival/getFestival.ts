import { createClient } from '@/supabase/server';
import { Festival, Set } from '@shared/types/festival.types';

export default async function getFestival(id: number): Promise<Festival> {
    const supabase = await createClient();
    const dayInMillis = 24 * 60 * 60 * 1000;

    // TODO: Add pagination and allow getting festivals by date range or as a search
    const { data: festival, error } = await supabase
        .from('festivals')
        .select(
            `
            id, name, start_date, end_date, location, poster_url,
            stages (id, name, rank, days),
            sets (id, stage_id, artist, start_hour, start_minute, end_hour, end_minute, crosses_midnight, day)
            `
        )
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching festival:', error);
        return {} as Festival;
    }

    const festivalDTO: Festival = {
        id: festival.id,
        name: festival.name,
        startDate: new Date(festival.start_date),
        endDate: new Date(festival.end_date),
        location: festival.location,
        posterUrl: festival.poster_url,
        festivalLength: Math.floor((new Date(festival.end_date).getTime() - new Date(festival.start_date).getTime()) / (dayInMillis)),
        stages: festival.stages.map((stage: any) => ({
            id: stage.id,
            name: stage.name,
            rank: stage.rank,
            days: stage.days
        })),
        dayNames: [],
        setsByDayAndStage: new Map<number, Map<number, Set[]>>(),
        openingTimes: [],
        closingTimes: []
    };

    // Organize stages by day and initialize day of the week names
    for (let day = 0; day <= festivalDTO.festivalLength; day++) {
        festivalDTO.setsByDayAndStage.set(day, new Map<number, Set[]>());
        festivalDTO.dayNames.push(new Date(festivalDTO.startDate.getTime() + (day * dayInMillis)).toLocaleDateString('en-US', { weekday: 'short' }));
    }

    festivalDTO.stages.forEach((stage) => {
        stage.days.forEach((day) => {
            if (!festivalDTO.setsByDayAndStage.get(day)) {
                festivalDTO.setsByDayAndStage.set(day, new Map<number, Set[]>());
            }
            festivalDTO.setsByDayAndStage.get(day)!.set(stage.id, []);
        });
    });

    festival.sets.forEach((set: any) => {
        festivalDTO.setsByDayAndStage.get(set.day)?.get(set.stage_id)?.push({
            id: set.id,
            stage_id: set.stage_id,
            artist: set.artist,
            start_hour: set.start_hour,
            start_minute: set.start_minute,
            end_hour: set.end_hour,
            end_minute: set.end_minute,
            crosses_midnight: set.crosses_midnight,
            day: set.day
        });

        if ((festivalDTO.openingTimes[set.day] === undefined) || (set.start_hour < festivalDTO.openingTimes[set.day] && !set.crosses_midnight)) {
            festivalDTO.openingTimes[set.day] = set.start_hour;
        }

        let postMidnight = false;

        if (festivalDTO.closingTimes[set.day] === undefined ||
            (set.end_hour > festivalDTO.closingTimes[set.day] && !postMidnight) ||
            (set.crosses_midnight && !postMidnight) ||
            (set.crosses_midnight && set.end_hour > festivalDTO.closingTimes[set.day] && postMidnight)) {

            if (set.crosses_midnight) {
                postMidnight = true;
            }

            if (set.end_minute > 0) {
                festivalDTO.closingTimes[set.day] = set.end_hour + 1;
            } else {
                festivalDTO.closingTimes[set.day] = set.end_hour;
            }
        }
    });

    return festivalDTO;
}
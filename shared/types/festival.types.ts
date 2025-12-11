export type Festival = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    posterUrl: string | null;
    festivalLength: number;
    stages: Stage[];
    dayNames: string[];
    setsByDayAndStage: Map<number, Map<number, Set[]>>;
    openingTimes: number[];
    closingTimes: number[];
}

export type Stage = {
    id: number;
    name: string;
    rank: number;
    days: number[];
}

export type Set = {
    id: number;
    stage_id: number;
    artist: string;
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
    crosses_midnight: boolean;
    day: number;
}
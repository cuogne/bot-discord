interface MovieScheduleTime {
        time: string;
        showtime_id: string;
}

interface MovieSchedule {
    date: string;
    times: MovieScheduleTime[];
}

interface MovieData {
    id: string;
    name_vn: string;
    image: string;
    type_name_vn: string;
    time_m: number;
    country_name_vn: string;
    language_vn: string;
    brief_vn: string;
    trailer?: string;
    schedule?: MovieSchedule[];
}

export interface DataMovieResponse {
    data: MovieData[];
}
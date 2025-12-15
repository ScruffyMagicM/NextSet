import { createClient } from '@/supabase/server';

export default async function getFestivals() {
    const supabase = await createClient();

    // TODO: Add pagination and allow getting festivals by date range or as a search
    const { data: festivals, error } = await supabase
        .from('festivals')
        .select('id, name, start_date, end_date, location, poster_url')
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching festivals:', error.message);
        return [];
    }

    return festivals;
}
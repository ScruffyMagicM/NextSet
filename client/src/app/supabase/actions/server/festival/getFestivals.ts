import { createClient } from '@/supabase/server';

export default async function getFestivals(upcoming: boolean) {
    const supabase = await createClient();

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const query = supabase
        .from('festivals')
        .select('id, name, start_date, end_date, location, poster_url')
        .order('start_date', { ascending: upcoming }); // ascending for upcoming, descending for past
    
    // Add the date filter based on the upcoming flag
    if (upcoming) {
        query.gte('end_date', today);
    } else {
        query.lt('end_date', today);
    }
    
    const { data: festivals, error } = await query;

    if (error) {
        console.error('Error fetching festivals:', error.message);
        return [];
    }

    return festivals;
}
import { createClient } from '@/supabase/client';
import { UserSet } from '@shared/types/user.types';

export default async function getUserSetPreferences(user_id: string, festival_id: number): Promise<Map<number, UserSet>> {
    const supabase = await createClient();

    const { data: preferences, error } = await supabase
        .from('usersets')
        .select(
            `
            user_id, set_id, rank,
            sets (id, festival_id)
            `
        )
        .eq('user_id', user_id)
        .eq('sets.festival_id', festival_id);

    if (error) {
        console.error('Error fetching user preferences:', error.message);
        return new Map<number, UserSet>();
    }

    const setsDTO = new Map<number, UserSet>();

    preferences?.forEach((pref: any) => {
        setsDTO.set(pref.set_id, {
            user_id: pref.id,
            set_id: pref.set_id,
            rank: pref.rank
        });
    });

    return setsDTO;
}
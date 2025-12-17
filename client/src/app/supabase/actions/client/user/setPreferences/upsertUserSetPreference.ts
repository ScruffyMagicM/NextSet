import { createClient } from '@/supabase/client';
import { UserSet } from '@shared/types/user.types';

export default async function upsertUserSetPreferences(user_id: string, set_id: number, rank: number): Promise<UserSet> {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from('usersets')
    .upsert({ set_id: set_id, rank: rank, user_id: user_id }, { onConflict: 'user_id, set_id' })
    .select('user_id, set_id, rank')
    .single();

    if (error) {
        console.error(error.message);
    }

    return data as UserSet;
}
import { createClient } from '@/supabase/client';
import { UserSet } from '@shared/types/user.types';

export default async function deleteUserSetPreferences(user_id: string, set_id: number) {
    const supabase = await createClient();

    await supabase
        .from(`usersets`)
        .delete()
        .eq('user_id', user_id)
        .eq('set_id', set_id);
}
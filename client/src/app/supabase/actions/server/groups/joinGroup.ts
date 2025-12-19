import { createClient } from '@/supabase/server';
import { getProfile } from '../user/getProfile';

// cache() ensures this is only called once per request
export default async function joinGroup(groupId: string) {
    const supabase = await createClient();
    const userId = await getProfile();

    await supabase
        .from('usergroups')
        .insert([{ user_id: userId?.user.id, group_id: groupId }]);
}

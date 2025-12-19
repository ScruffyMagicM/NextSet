import { createClient } from '@/supabase/client';
import { getProfile } from '@/supabase/actions/server/user/getProfile';

export default async function leaveGroup(groupId: string) {
    const supabase = await createClient();
    const userId = await getProfile();

    await supabase
        .from('usergroups')
        .delete()
        .eq('user_id', userId)
        .eq('group_id', groupId);
}

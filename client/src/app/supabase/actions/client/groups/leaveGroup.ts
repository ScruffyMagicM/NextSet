import { createClient } from '@/supabase/client';
import { useUser } from '@/contexts/UserContext';

export default async function leaveGroup(groupId: string, userId: string) {
    const supabase = await createClient();

    await supabase
        .from('usergroups')
        .delete()
        .eq('user_id', userId)
        .eq('group_id', groupId);
}

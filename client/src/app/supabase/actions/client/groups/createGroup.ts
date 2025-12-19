import { createClient } from '@/supabase/client';
import { cache } from 'react';

// cache() ensures this is only called once per request
export default async function createGroup (group_name: string, festival_id: number, user_id: string) {

    const supabase = createClient();

    const { data, error } = await supabase
        .from('festivalgroups')
        .insert([{ name: group_name, festival_id: festival_id }])
        .select('id')
        .single();
    if (error) {
        console.error('Error creating group:', error.message);
        return null;
    } else {
        const { error: groupError } = await supabase
            .from('usergroups')
            .insert([{ user_id: user_id, group_id: data.id }]);
        if (groupError) {
            console.error('Error adding user to group:', groupError.message);
            return null;
        } else {
            console.log('Group created and user added successfully');
            const newGroupData: Record<number, { name: string; member_count: number }> = {
                [data.id]: {
                    name: group_name,
                    member_count: 1
                }
            };

            return newGroupData;
        }
    }
};
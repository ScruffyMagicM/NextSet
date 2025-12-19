import { createClient } from '@/supabase/client';
import { Profile } from '@shared/types/user.types';

export default async function getGroupSetPreferences(group_id: string): Promise<Map<number, Profile[]>> {
    const supabase = await createClient();

    const { data: preferences, error } = await supabase
        .from('userprofiles')
        .select(
            `
            id, username, pfp_url, email,
            usergroups!inner (user_id, group_id),
            usersets!inner (set_id, rank)
            `
        )
        .eq('usergroups.group_id', group_id);

    if (error) {
        console.error('Error fetching group preferences:', error.message);
        return new Map<number, Profile[]>();
    }

    const setsDTO = new Map<number, Profile[]>();

    preferences?.forEach((pref: any) => {
        const profile = {
            id: pref.id,
            username: pref.username,
            pfp_url: pref.pfp_url,
            email: pref.email,
        };

        if (!setsDTO.has(pref.set_id)) {
            setsDTO.set(pref.set_id, []);
        }

        setsDTO.get(pref.set_id)?.push(profile);
    });

    return setsDTO;
}
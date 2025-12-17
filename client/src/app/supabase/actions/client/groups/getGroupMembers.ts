import { createClient } from '@/supabase/client';
import { cache } from 'react';

// cache() ensures this is only called once per request
export const getGroupMembers = cache(async (group_id: string) => {
  const supabase = await createClient();

  //Needs to pull all users and set preferences in specified group
  const { data: userSets, error: error } = await supabase
    .from('usergroups')
    .select(`
        group_id, user_id, 
        festivalgroups (id, festival_id),
        sets (id, user_id, set_id, rank),
    `)
    .eq('group_id', group_id);

  if (error) {
    console.error('Error fetching group user sets:', error.message);
    return null;
  }

  const setMap = new Map<number, Array<{ user_id: string; rank: number }>>();

  //Map setId to collection of User + Rank
  userSets.map((userSet: any) => {
    setMap.set(userSet.sets.id, [
      ...(setMap.get(userSet.sets.id) || []),
      { user_id: userSet.user_id, rank: userSet.sets.rank },
    ]);
  });

  return setMap;
});
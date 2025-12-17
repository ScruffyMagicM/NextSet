import { createClient } from '@/supabase/client';
import { cache } from 'react';

export const getUserGroups = cache(async (festival_id: number, user_id: string) => {
  const supabase = await createClient();
  
  // First, get the groups the user is a member of for this festival
  const { data: userGroupIds, error: userGroupError } = await supabase
    .from('usergroups')
    .select('group_id')
    .eq('user_id', user_id);

  if (userGroupError) {
    console.error('Error fetching user groups:', userGroupError!.message);
    return [];
  }

  if(!userGroupIds || userGroupIds.length === 0) {
    return [];
  }

  const groupIds = userGroupIds.map(ug => ug.group_id);

  // Then get the member counts for those groups in this festival
  const { data: groups, error } = await supabase
    .from('usergroups')
    .select(`
      group_id,
      festivalgroups!inner (id, name, festival_id)
    `)
    .in('group_id', groupIds)
    .eq('festivalgroups.festival_id', festival_id);

  if (error) {
    console.error('Error fetching festival groups:', error.message);
    return null;
  }

  //Don't know why there's an error on name, but this works
  const groupData = groups.reduce((acc, row) => {
    if (!acc[row.group_id]) {
      acc[row.group_id] = {
        name: row.festivalgroups.name,
        member_count: 0
      };
    }
    acc[row.group_id].member_count += 1;
    return acc;
  }, {} as Record<number, { name: string; member_count: number }>);

  return groupData;
});
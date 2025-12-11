import { createClient } from '@/supabase/server';
import { cache } from 'react';

// cache() ensures this is only called once per request
export const getProfile = cache(async () => {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return null;
  }

  console.log('User Id: ' + user.id);

  const { data: profile, error: profileError } = await supabase
    .from('userprofiles')    
    .select('id, username, pfp_url, email')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  return { user, profile };
})
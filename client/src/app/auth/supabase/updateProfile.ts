'use server'

import { createClient } from './server'
import { getProfile } from './getProfile'
import { Profile } from '@shared/types/database.types';
import { revalidatePath } from 'next/cache'

//TODO: Implement response type to indicate success/failure with error details
//TODO: Do validation of submitted data, i.e. valid email format, username constraints, etc.
export default async function updateProfile(newProfileData: Profile): Promise<boolean> {

    const currUser = await getProfile();

    console.log('Current User in updateProfile:', currUser);
    console.log('New user data in updateProfile:', newProfileData);

    if (!currUser) return false;

    const supabase = await createClient();

    try {
        if (newProfileData.email !== currUser.profile.email) {
            console.log('Updating user email to:', newProfileData.email);
            const authResponse = await supabase.auth.updateUser({ email: newProfileData.email });
            if (authResponse.error) {
                console.error('Error updating user:', authResponse.error);
                throw authResponse.error;
            }
        }

        console.log('Updating profile data to:', newProfileData);

        //Email address update is handled via supabase sql trigger to auth.users table
        const profileResponse = await supabase
            .from('userprofiles')
            .update({
                username: newProfileData.username,
                pfp_url: newProfileData.pfp_url
            })
            .eq('id', currUser.user.id);

        if (profileResponse.error) {
            console.error('Error updating profile:', profileResponse.error);
            throw profileResponse.error;
        }

        console.log('Values changed?', {
            username: currUser.profile.username !== newProfileData.username,
            pfp_url: currUser.profile.pfp_url !== newProfileData.pfp_url
        })

        revalidatePath('/', 'layout')
    }
    catch (error) {
        console.error('Error in updateProfile:', error);
        return false;
    }

    return true;
}
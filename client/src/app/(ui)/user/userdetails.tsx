'use client';

import { useState } from "react";
import { useUser } from '@/contexts/UserContext';
import { Profile } from "@shared/types/database.types";
import PfpUpload from "./pfpUpload";

export function UserDetailsComponent({updateProfile}: {updateProfile: (newProfileData: Profile) => Promise<boolean>}) {
    const { profile } = useUser();

    if (!profile) return null; //Update this to prompt user to create an account - actually, just promp user creation upon clicking link to user page

    const [locked, setLocked] = useState(true);
    const [username, setUsername] = useState(profile.username);
    const [email, setEmail] = useState(profile.email);
    const [pfpUrl, setPfpUrl] = useState(profile.pfp_url == "" ? null : profile.pfp_url);

    function editProfile() {
        setLocked(!locked);
    }

    async function handleSave() {
        setLocked(true);
        await updateProfile({username, email, pfp_url: pfpUrl || "", id: profile!.id});
    }

    function handleCancel() {
        setUsername(profile?.username || "");
        setEmail(profile?.email || "");
        setPfpUrl(profile?.pfp_url || null);
        setLocked(true);
    }

    return (
        <div>
            <div className="p-8">
                <div className="">
                    Profile Picture: 
                    <PfpUpload userId={profile.id} currentPfpUrl={pfpUrl || undefined} setPfpUrlInParent={setPfpUrl} locked={locked}/>
                </div>
                <div>
                    Username: 
                    <input className="input-default" placeholder="Username" disabled={locked} value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div>
                    Email: 
                    <input className="input-default" placeholder="Email Address" disabled={locked} value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="space-x-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer" hidden={!locked} onClick={() => editProfile()}>Edit Profile</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer" hidden={locked} onClick={() => handleSave()}>Save</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer" hidden={locked} onClick={() => handleCancel()}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
import { UserDetailsComponent } from "./userdetails.tsx";
import updateProfile from "@/supabase/actions/server/user/updateProfile.ts";

export default function UserPage() {

    return (
        <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <UserDetailsComponent updateProfile={updateProfile} />
        </div>
    );
}
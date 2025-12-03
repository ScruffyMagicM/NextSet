import { getProfile } from '@/auth/supabase/getProfile';

export default async function DashboardPage() {
 
  const user = await getProfile();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.profile.email ?? 'Guest'}</p>
    </div>
  )
}
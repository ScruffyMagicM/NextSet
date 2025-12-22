'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGroup } from '@/contexts/GroupContext';

export default function FestivalGroupPage({ 
  params 
}: { 
  params: { festivalid: string; groupid: string } 
}) {
  const router = useRouter();
  const { setGroupId } = useGroup();

  useEffect(() => {
    // Set the groupId in context
    setGroupId(params.groupid);
    
    // Redirect to the festival page (this updates the URL but keeps the context)
    router.replace(`/festival/${params.festivalid}`);
  }, [params.festivalid, params.groupid, setGroupId, router]);
  // Show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading group...</p>
    </div>
  );
}
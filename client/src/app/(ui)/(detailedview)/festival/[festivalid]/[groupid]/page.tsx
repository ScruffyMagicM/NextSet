'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGroup } from '@/contexts/GroupContext';

export default function FestivalGroupPage({ 
  params 
}: { 
  params: { festivalId: string; groupId: string } 
}) {
  const router = useRouter();
  const { setGroupId } = useGroup();

  useEffect(() => {
    // Set the groupId in context
    setGroupId(params.groupId);
    
    // Redirect to the festival page (this updates the URL but keeps the context)
    router.replace(`/festival/${params.festivalId}`);
  }, [params.festivalId, params.groupId, setGroupId, router]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading group...</p>
    </div>
  );
}
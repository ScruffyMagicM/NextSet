'use client'

import { createContext, useContext, ReactNode } from 'react';
import { Profile } from '@shared/types/user.types';

type GroupContextType = {
  group_id: string | null,
    setGroupId: (group_id: string | null) => void
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ 
  children, 
  group_id,
  setGroupId
}: { 
  children: ReactNode
  group_id: string | null,
  setGroupId: (group_id: string | null) => void 
}) {
  return (
    <GroupContext.Provider value={{ group_id, setGroupId }}>
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}
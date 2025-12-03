'use client'

import { createContext, useContext, ReactNode } from 'react';
import { Profile } from '@shared/types/database.types';

type UserContextType = {
  profile: Profile | null
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  profile 
}: { 
  children: ReactNode
  profile: Profile | null
}) {
  return (
    <UserContext.Provider value={{ profile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
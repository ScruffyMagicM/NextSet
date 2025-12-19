'use client'

import { createContext, useContext, ReactNode } from 'react';
import { Festival } from '@shared/types/festival.types';

type FestivalContextType = {
  festival: Festival
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined);
export function FestivalProvider({ 
  children, 
  festival
}: { 
  children: ReactNode
  festival: Festival
}) {
  return (
    <FestivalContext.Provider value={{ festival }}>
      {children}
    </FestivalContext.Provider>
  )
}

export function useFestival() {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
}

import React, { createContext, useContext, ReactNode } from 'react';
import { PositionManagementContextType } from './types';
import { useSupabasePositionOperations } from './hooks/useSupabasePositionOperations';

const PositionManagementContext = createContext<PositionManagementContextType | undefined>(undefined);

export const PositionManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const positionManagement = useSupabasePositionOperations();

  return (
    <PositionManagementContext.Provider value={positionManagement}>
      {children}
    </PositionManagementContext.Provider>
  );
};

export const usePositionManagementContext = (): PositionManagementContextType => {
  const context = useContext(PositionManagementContext);
  if (context === undefined) {
    throw new Error('usePositionManagementContext must be used within a PositionManagementProvider');
  }
  return context;
};

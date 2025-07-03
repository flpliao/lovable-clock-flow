import { useCurrentUser } from '@/hooks/useStores';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useScheduleOperations } from './hooks/useScheduleOperations';
import { SchedulingContextType } from './types';

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};

interface SchedulingProviderProps {
  children: ReactNode;
}

export const SchedulingProvider: React.FC<SchedulingProviderProps> = ({ children }) => {
  const currentUser = useCurrentUser();
  const {
    schedules,
    loading,
    error,
    loadSchedules,
    addSchedules,
    getSchedulesForDate,
    removeSchedule,
    updateSchedule,
    refreshSchedules,
  } = useScheduleOperations(currentUser?.id);

  // 初始載入
  useEffect(() => {
    loadSchedules();
  }, []);

  return (
    <SchedulingContext.Provider value={{
      schedules,
      loading,
      error,
      addSchedules,
      getSchedulesForDate,
      removeSchedule,
      updateSchedule,
      refreshSchedules,
    }}>
      {children}
    </SchedulingContext.Provider>
  );
};

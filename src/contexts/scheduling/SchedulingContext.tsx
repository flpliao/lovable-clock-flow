
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { SchedulingContextType } from './types';
import { useScheduleOperations } from './hooks/useScheduleOperations';

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
  const { currentUser } = useUser();
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


import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Schedule {
  id: string;
  userId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
}

interface SchedulingContextType {
  schedules: Schedule[];
  addSchedules: (newSchedules: Omit<Schedule, 'id'>[]) => void;
  getSchedulesForDate: (date: string) => Schedule[];
  removeSchedule: (id: string) => void;
}

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
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const addSchedules = (newSchedules: Omit<Schedule, 'id'>[]) => {
    const schedulesWithIds = newSchedules.map(schedule => ({
      ...schedule,
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));
    
    setSchedules(prev => [...prev, ...schedulesWithIds]);
  };

  const getSchedulesForDate = (date: string) => {
    return schedules.filter(schedule => schedule.workDate === date);
  };

  const removeSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  return (
    <SchedulingContext.Provider value={{
      schedules,
      addSchedules,
      getSchedulesForDate,
      removeSchedule,
    }}>
      {children}
    </SchedulingContext.Provider>
  );
};

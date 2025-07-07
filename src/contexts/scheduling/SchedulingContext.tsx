import { useCurrentUser } from '@/hooks/useStores';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
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

  // 穩定化 loadSchedules 函數
  const stableLoadSchedules = useCallback(() => {
    loadSchedules();
  }, [loadSchedules]);

  // 初始載入 - 只執行一次
  useEffect(() => {
    stableLoadSchedules();
  }, [stableLoadSchedules]);

  // Memoize context value 以避免不必要的重新渲染
  const contextValue = useMemo(
    () => ({
      schedules,
      loading,
      error,
      addSchedules,
      getSchedulesForDate,
      removeSchedule,
      updateSchedule,
      refreshSchedules,
    }),
    [
      schedules,
      loading,
      error,
      addSchedules,
      getSchedulesForDate,
      removeSchedule,
      updateSchedule,
      refreshSchedules,
    ]
  );

  return <SchedulingContext.Provider value={contextValue}>{children}</SchedulingContext.Provider>;
};

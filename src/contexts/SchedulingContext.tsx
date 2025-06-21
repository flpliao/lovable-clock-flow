
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { scheduleService, Schedule as SupabaseSchedule, CreateSchedule } from '@/services/scheduleService';
import { useUser } from '@/contexts/UserContext';

export interface Schedule {
  id: string;
  userId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  createdBy?: string;
}

interface SchedulingContextType {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  addSchedules: (newSchedules: Omit<Schedule, 'id'>[]) => Promise<void>;
  getSchedulesForDate: (date: string) => Schedule[];
  removeSchedule: (id: string) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<Omit<Schedule, 'id'>>) => Promise<void>;
  refreshSchedules: () => Promise<void>;
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

// 轉換函數：Supabase 格式 -> 應用程式格式
const transformFromSupabase = (supabaseSchedule: SupabaseSchedule): Schedule => ({
  id: supabaseSchedule.id,
  userId: supabaseSchedule.user_id,
  workDate: supabaseSchedule.work_date,
  startTime: supabaseSchedule.start_time,
  endTime: supabaseSchedule.end_time,
  timeSlot: supabaseSchedule.time_slot,
  createdBy: supabaseSchedule.created_by,
});

// 轉換函數：應用程式格式 -> Supabase 格式
const transformToSupabase = (schedule: Omit<Schedule, 'id'>, createdBy: string): CreateSchedule => ({
  user_id: schedule.userId,
  work_date: schedule.workDate,
  start_time: schedule.startTime,
  end_time: schedule.endTime,
  time_slot: schedule.timeSlot,
  created_by: createdBy,
});

export const SchedulingProvider: React.FC<SchedulingProviderProps> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUser();

  // 載入所有排班記錄
  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading schedules from database...');
      
      const supabaseSchedules = await scheduleService.getAllSchedules();
      const transformedSchedules = supabaseSchedules.map(transformFromSupabase);
      
      console.log('Loaded schedules:', transformedSchedules);
      setSchedules(transformedSchedules);
    } catch (err) {
      console.error('Failed to load schedules:', err);
      setError(err instanceof Error ? err.message : '載入排班記錄失敗');
    } finally {
      setLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    loadSchedules();
  }, []);

  const addSchedules = async (newSchedules: Omit<Schedule, 'id'>[]) => {
    if (!currentUser) {
      setError('用戶未登入');
      return;
    }

    // 檢查是否有重複的排班記錄（同一人同一天）
    const duplicateCheck = newSchedules.some(newSchedule => {
      return schedules.some(existingSchedule => 
        existingSchedule.userId === newSchedule.userId && 
        existingSchedule.workDate === newSchedule.workDate
      );
    });

    if (duplicateCheck) {
      setError('同一員工在同一天已有排班記錄，請檢查後重新安排');
      throw new Error('同一員工在同一天已有排班記錄，請檢查後重新安排');
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Adding schedules:', newSchedules);
      
      const supabaseSchedules = newSchedules.map(schedule => 
        transformToSupabase(schedule, currentUser.id)
      );
      
      const createdSchedules = await scheduleService.createSchedules(supabaseSchedules);
      const transformedSchedules = createdSchedules.map(transformFromSupabase);
      
      setSchedules(prev => [...prev, ...transformedSchedules]);
      console.log('Successfully added schedules');
    } catch (err) {
      console.error('Failed to add schedules:', err);
      setError(err instanceof Error ? err.message : '新增排班失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSchedulesForDate = (date: string) => {
    return schedules.filter(schedule => schedule.workDate === date);
  };

  const removeSchedule = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Removing schedule:', id);
      
      await scheduleService.deleteSchedule(id);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      console.log('Successfully removed schedule');
    } catch (err) {
      console.error('Failed to remove schedule:', err);
      setError(err instanceof Error ? err.message : '刪除排班失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, updates: Partial<Omit<Schedule, 'id'>>) => {
    // 檢查更新是否會造成重複排班
    if (updates.userId && updates.workDate) {
      const duplicateCheck = schedules.some(existingSchedule => 
        existingSchedule.id !== id &&
        existingSchedule.userId === updates.userId && 
        existingSchedule.workDate === updates.workDate
      );

      if (duplicateCheck) {
        setError('該員工在此日期已有排班記錄，無法更新');
        throw new Error('該員工在此日期已有排班記錄，無法更新');
      }
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Updating schedule:', id, updates);
      
      const supabaseUpdates: Partial<CreateSchedule> = {};
      if (updates.userId) supabaseUpdates.user_id = updates.userId;
      if (updates.workDate) supabaseUpdates.work_date = updates.workDate;
      if (updates.startTime) supabaseUpdates.start_time = updates.startTime;
      if (updates.endTime) supabaseUpdates.end_time = updates.endTime;
      if (updates.timeSlot) supabaseUpdates.time_slot = updates.timeSlot;
      
      const updatedSchedule = await scheduleService.updateSchedule(id, supabaseUpdates);
      const transformedSchedule = transformFromSupabase(updatedSchedule);
      
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id ? transformedSchedule : schedule
      ));
      console.log('Successfully updated schedule');
    } catch (err) {
      console.error('Failed to update schedule:', err);
      setError(err instanceof Error ? err.message : '更新排班失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSchedules = async () => {
    await loadSchedules();
  };

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

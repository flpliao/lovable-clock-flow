import { scheduleService } from '@/services/scheduleService';
import { useCallback, useState } from 'react';
import { transformFromSupabase, transformToSupabase } from '../transformUtils';
import { Schedule } from '../types';

export const useScheduleOperations = (currentUserId: string | undefined) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 載入所有排班記錄
  const loadSchedules = useCallback(async () => {
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
  }, []);

  const addSchedules = useCallback(
    async (newSchedules: Omit<Schedule, 'id'>[]) => {
      if (!currentUserId) {
        setError('用戶未登入');
        return;
      }

      // 檢查是否有重複的排班記錄（同一人同一天）
      const duplicateCheck = newSchedules.some(newSchedule => {
        return schedules.some(
          existingSchedule =>
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
          transformToSupabase(schedule, currentUserId)
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
    },
    [currentUserId, schedules]
  );

  const getSchedulesForDate = useCallback(
    (date: string) => {
      return schedules.filter(schedule => schedule.workDate === date);
    },
    [schedules]
  );

  const removeSchedule = useCallback(async (id: string) => {
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
  }, []);

  const updateSchedule = useCallback(
    async (id: string, updates: Partial<Omit<Schedule, 'id'>>) => {
      // 檢查更新是否會造成重複排班
      if (updates.userId && updates.workDate) {
        const duplicateCheck = schedules.some(
          existingSchedule =>
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

        const supabaseUpdates: Record<string, unknown> = {};
        if (updates.userId) supabaseUpdates.user_id = updates.userId;
        if (updates.workDate) supabaseUpdates.work_date = updates.workDate;
        if (updates.startTime) supabaseUpdates.start_time = updates.startTime;
        if (updates.endTime) supabaseUpdates.end_time = updates.endTime;
        if (updates.timeSlot) supabaseUpdates.time_slot = updates.timeSlot;

        const updatedSchedule = await scheduleService.updateSchedule(id, supabaseUpdates);
        const transformedSchedule = transformFromSupabase(updatedSchedule);

        setSchedules(prev =>
          prev.map(schedule => (schedule.id === id ? transformedSchedule : schedule))
        );
        console.log('Successfully updated schedule');
      } catch (err) {
        console.error('Failed to update schedule:', err);
        setError(err instanceof Error ? err.message : '更新排班失敗');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [schedules]
  );

  const refreshSchedules = useCallback(async () => {
    await loadSchedules();
  }, [loadSchedules]);

  return {
    schedules,
    loading,
    error,
    loadSchedules,
    addSchedules,
    getSchedulesForDate,
    removeSchedule,
    updateSchedule,
    refreshSchedules,
  };
};

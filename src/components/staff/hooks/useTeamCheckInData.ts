import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Staff } from '../types';

export interface TeamMemberCheckInData {
  staff: Staff;
  totalRecords: number;
  successRecords: number;
  latestRecord: CheckInRecord | null;
}

export const useTeamCheckInData = () => {
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { staffList } = useStaffManagementContext();
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [allRecords, setAllRecords] = useState<CheckInRecord[]>([]);

  // 穩定化 hasPermission 檢查
  const hasPermission = useMemo(() => {
    return isAdmin;
  }, [isAdmin]);

  // 使用 useCallback 穩定化載入函數
  const loadRecords = useCallback(async () => {
    if (!hasPermission) return;

    try {
      console.log('🔄 載入團隊打卡記錄...');
      
      const { data, error } = await supabase
        .from('check_in_records')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading team check-in records:', error);
        return;
      }

      const formattedRecords = (data || []).map((record: any) => ({
        id: record.id,
        userId: record.user_id,
        timestamp: record.timestamp,
        type: record.type as 'location' | 'ip',
        status: record.status as 'success' | 'failed',
        action: record.action as 'check-in' | 'check-out',
        details: {
          latitude: record.latitude,
          longitude: record.longitude,
          distance: record.distance,
          ip: record.ip_address,
          locationName: record.location_name
        }
      }));

      console.log('✅ 團隊打卡記錄載入完成:', formattedRecords.length, '筆記錄');
      setAllRecords(formattedRecords);
    } catch (error) {
      console.error('載入團隊打卡記錄失敗:', error);
    }
  }, [hasPermission]);

  // Load check-in records from Supabase - 只在 hasPermission 改變時執行
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Get all departments - 穩定化計算
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    staffList.forEach(staff => {
      if (staff.department) {
        deptSet.add(staff.department);
      }
    });
    return Array.from(deptSet);
  }, [staffList]);

  // Filter staff members by department - 穩定化計算
  const filteredStaff = useMemo(() => {
    if (departmentFilter === 'all') {
      return staffList;
    }
    return staffList.filter(staff => staff.department === departmentFilter);
  }, [staffList, departmentFilter]);

  // Process check-in data - 穩定化計算
  const teamCheckInData = useMemo(() => {
    if (!hasPermission) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(today - (now.getDay() > 0 ? now.getDay() - 1 : 6) * 86400000).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return filteredStaff.map(staff => {
      // Filter records by date range and user ID
      const userRecords = allRecords.filter(record => {
        const recordTime = new Date(record.timestamp).getTime();
        
        if (record.userId !== staff.id) return false;
        
        if (filter === 'today') {
          return recordTime >= today;
        } else if (filter === 'week') {
          return recordTime >= weekStart;
        } else if (filter === 'month') {
          return recordTime >= monthStart;
        }
        
        return false;
      });

      // Get stats
      const totalRecords = userRecords.length;
      const successRecords = userRecords.filter(r => r.status === 'success').length;
      
      // Get latest record
      const latestRecord = userRecords.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0] || null;

      return {
        staff,
        totalRecords,
        successRecords,
        latestRecord
      };
    });
  }, [filteredStaff, filter, hasPermission, allRecords]);

  return {
    filter,
    setFilter,
    departmentFilter,
    setDepartmentFilter,
    departments,
    teamCheckInData,
    hasPermission
  };
};

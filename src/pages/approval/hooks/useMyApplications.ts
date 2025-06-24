
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { queryOvertimeService } from '@/services/overtime/queryOvertimeService';

interface MyApplication {
  id: string;
  type: 'overtime' | 'missed_checkin' | 'leave';
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  details: any;
}

export const useMyApplications = () => {
  const { currentUser } = useUser();
  const [myApplications, setMyApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMyApplications = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setIsLoading(true);
      console.log('🔍 載入我的申請記錄，當前用戶:', currentUser.id, currentUser.name);

      // 載入加班申請
      const overtimeRecords = await queryOvertimeService.getOvertimeRequestsByCurrentUser(currentUser.id);
      
      // 載入忘記打卡申請
      const { data: missedCheckinData } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name
          )
        `)
        .eq('staff_id', currentUser.id)
        .order('created_at', { ascending: false });

      // 載入請假申請
      const { data: leaveData } = await supabase
        .from('leave_requests')  
        .select('*')
        .or(`staff_id.eq.${currentUser.id},user_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      const applications: MyApplication[] = [];

      // 轉換加班申請
      overtimeRecords.forEach(record => {
        applications.push({
          id: record.id,
          type: 'overtime',
          title: `加班申請 - ${record.overtime_date}`,
          status: record.status as 'pending' | 'approved' | 'rejected',
          created_at: record.created_at,
          details: record
        });
      });

      // 轉換忘記打卡申請
      (missedCheckinData || []).forEach(record => {
        const typeText = record.missed_type === 'check_in' ? '忘記上班打卡' : 
                        record.missed_type === 'check_out' ? '忘記下班打卡' : '忘記上下班打卡';
        applications.push({
          id: record.id,
          type: 'missed_checkin',
          title: `${typeText} - ${record.request_date}`,
          status: record.status as 'pending' | 'approved' | 'rejected',
          created_at: record.created_at,
          details: record
        });
      });

      // 轉換請假申請
      (leaveData || []).forEach(record => {
        applications.push({
          id: record.id,
          type: 'leave',
          title: `請假申請 - ${record.leave_type}`,
          status: record.status as 'pending' | 'approved' | 'rejected',
          created_at: record.created_at,
          details: record
        });
      });

      // 按建立時間排序
      applications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setMyApplications(applications);
      console.log('✅ 載入我的申請記錄成功:', applications.length, '筆');
      
    } catch (error) {
      console.error('❌ 載入我的申請記錄失敗:', error);
      setMyApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, currentUser?.name]);

  return {
    myApplications,
    isLoading,
    loadMyApplications,
    setMyApplications
  };
};

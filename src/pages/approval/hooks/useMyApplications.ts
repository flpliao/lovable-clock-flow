
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

      // 載入加班申請 - 使用專門的方法確保所有用戶都能查看自己的記錄
      console.log('📋 開始載入加班申請記錄...');
      const overtimeRecords = await queryOvertimeService.getOvertimeRequestsByCurrentUser(currentUser.id);
      console.log('✅ 加班申請記錄載入完成:', overtimeRecords.length, '筆');
      
      // 載入忘記打卡申請
      console.log('📋 開始載入忘記打卡申請記錄...');
      const { data: missedCheckinData, error: missedCheckinError } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name
          )
        `)
        .eq('staff_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (missedCheckinError) {
        console.error('❌ 載入忘記打卡申請失敗:', missedCheckinError);
      } else {
        console.log('✅ 忘記打卡申請記錄載入完成:', missedCheckinData?.length || 0, '筆');
      }

      // 載入請假申請
      console.log('📋 開始載入請假申請記錄...');
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')  
        .select('*')
        .or(`staff_id.eq.${currentUser.id},user_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (leaveError) {
        console.error('❌ 載入請假申請失敗:', leaveError);
      } else {
        console.log('✅ 請假申請記錄載入完成:', leaveData?.length || 0, '筆');
      }

      const applications: MyApplication[] = [];

      // 轉換加班申請
      if (overtimeRecords && overtimeRecords.length > 0) {
        console.log('🔄 轉換加班申請記錄...');
        overtimeRecords.forEach(record => {
          console.log('📝 處理加班記錄:', {
            id: record.id,
            date: record.overtime_date,
            status: record.status,
            hours: record.hours
          });
          
          applications.push({
            id: record.id,
            type: 'overtime',
            title: `加班申請 - ${record.overtime_date}`,
            status: record.status as 'pending' | 'approved' | 'rejected',
            created_at: record.created_at,
            details: {
              ...record,
              // 確保所有必要的欄位都存在
              overtime_date: record.overtime_date,
              start_time: record.start_time,
              end_time: record.end_time,
              hours: record.hours,
              overtime_type: record.overtime_type,
              compensation_type: record.compensation_type,
              reason: record.reason,
              status: record.status
            }
          });
        });
        console.log('✅ 加班申請記錄轉換完成');
      } else {
        console.log('ℹ️ 沒有找到加班申請記錄');
      }

      // 轉換忘記打卡申請
      if (missedCheckinData && missedCheckinData.length > 0) {
        console.log('🔄 轉換忘記打卡申請記錄...');
        missedCheckinData.forEach(record => {
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
        console.log('✅ 忘記打卡申請記錄轉換完成');
      }

      // 轉換請假申請
      if (leaveData && leaveData.length > 0) {
        console.log('🔄 轉換請假申請記錄...');
        leaveData.forEach(record => {
          applications.push({
            id: record.id,
            type: 'leave',
            title: `請假申請 - ${record.leave_type}`,
            status: record.status as 'pending' | 'approved' | 'rejected',
            created_at: record.created_at,
            details: record
          });
        });
        console.log('✅ 請假申請記錄轉換完成');
      }

      // 按建立時間排序
      applications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('📊 最終統計:', {
        總計: applications.length,
        加班申請: applications.filter(a => a.type === 'overtime').length,
        忘記打卡: applications.filter(a => a.type === 'missed_checkin').length,
        請假申請: applications.filter(a => a.type === 'leave').length,
        狀態分布: {
          pending: applications.filter(a => a.status === 'pending').length,
          approved: applications.filter(a => a.status === 'approved').length,  
          rejected: applications.filter(a => a.status === 'rejected').length
        }
      });

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

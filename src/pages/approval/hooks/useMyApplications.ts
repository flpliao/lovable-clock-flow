
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

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

      // 載入加班申請 - 僅限自己申請的記錄
      console.log('📋 開始載入加班申請記錄...');
      const { data: overtimeData, error: overtimeError } = await supabase
        .from('overtimes')
        .select(`
          *,
          staff!staff_id (
            name,
            department,
            position,
            supervisor_id
          ),
          overtime_approval_records (
            id,
            approver_id,
            approver_name,
            level,
            status,
            approval_date,
            comment,
            created_at,
            updated_at
          )
        `)
        .eq('staff_id', currentUser.id)  // 僅查詢自己的申請
        .order('created_at', { ascending: false });

      if (overtimeError) {
        console.error('❌ 載入加班申請失敗:', overtimeError);
      } else {
        console.log('✅ 加班申請記錄載入完成:', overtimeData?.length || 0, '筆');
      }
      
      // 載入忘記打卡申請 - 僅限自己申請的記錄
      console.log('📋 開始載入忘記打卡申請記錄...');
      const { data: missedCheckinData, error: missedCheckinError } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name
          )
        `)
        .eq('staff_id', currentUser.id)  // 僅查詢自己的申請
        .order('created_at', { ascending: false });

      if (missedCheckinError) {
        console.error('❌ 載入忘記打卡申請失敗:', missedCheckinError);
      } else {
        console.log('✅ 忘記打卡申請記錄載入完成:', missedCheckinData?.length || 0, '筆');
      }

      // 載入請假申請 - 僅限自己申請的記錄
      console.log('📋 開始載入請假申請記錄...');
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')  
        .select('*')
        .or(`staff_id.eq.${currentUser.id},user_id.eq.${currentUser.id}`)  // 僅查詢自己的申請
        .order('created_at', { ascending: false });

      if (leaveError) {
        console.error('❌ 載入請假申請失敗:', leaveError);
      } else {
        console.log('✅ 請假申請記錄載入完成:', leaveData?.length || 0, '筆');
      }

      const applications: MyApplication[] = [];

      // 轉換加班申請
      if (overtimeData && overtimeData.length > 0) {
        console.log('🔄 轉換加班申請記錄...');
        overtimeData.forEach(record => {
          console.log('📝 處理加班記錄:', {
            id: record.id,
            date: record.overtime_date,
            status: record.status,
            hours: record.hours,
            isPending: record.status === 'pending'
          });
          
          applications.push({
            id: record.id,
            type: 'overtime',
            title: `加班申請 - ${record.overtime_date}`,
            status: record.status as 'pending' | 'approved' | 'rejected',
            created_at: record.created_at,
            details: {
              ...record,
              staff: Array.isArray(record.staff) ? record.staff[0] : record.staff,
              overtime_approval_records: Array.isArray(record.overtime_approval_records) 
                ? record.overtime_approval_records 
                : []
            }
          });
        });
        console.log('✅ 加班申請記錄轉換完成');
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

      // 按建立時間排序，pending 狀態的申請優先顯示
      applications.sort((a, b) => {
        // 如果狀態不同，pending 優先
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        
        // 其他情況按建立時間倒序
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      console.log('📊 最終統計:', {
        總計: applications.length,
        加班申請: applications.filter(a => a.type === 'overtime').length,
        待審核加班: applications.filter(a => a.type === 'overtime' && a.status === 'pending').length,
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

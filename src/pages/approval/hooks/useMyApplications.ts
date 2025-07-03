import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import type { MyApplication } from '@/types/myApplication';
import { useCallback, useState } from 'react';

export const useMyApplications = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();
  
  const [myApplications, setMyApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMyApplications = useCallback(async () => {
    // 使用預設用戶 ID 如果沒有當前用戶
    const userId = currentUser?.id || '550e8400-e29b-41d4-a716-446655440001';
    
    try {
      setIsLoading(true);
      console.log('🔍 載入我的申請記錄，當前用戶:', userId, currentUser?.name || '預設用戶');

      // 載入加班申請
      console.log('📋 開始載入加班申請記錄...');
      const { data: overtimeData, error: overtimeError } = await supabase
        .from('overtime_requests')
        .select('*')
        .or(`staff_id.eq.${userId},user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (overtimeError) {
        console.error('❌ 載入加班申請失敗:', overtimeError);
      } else {
        console.log('✅ 加班申請記錄載入完成:', overtimeData?.length || 0, '筆');
      }
      
      // 載入忘記打卡申請
      console.log('📋 開始載入忘記打卡申請記錄...');
      const { data: missedCheckinData, error: missedCheckinError } = await supabase
        .from('missed_checkin_requests')
        .select('*')
        .eq('staff_id', userId)
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
        .or(`staff_id.eq.${userId},user_id.eq.${userId}`)
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
          const statusText = record.status === 'pending' ? '審核中' : 
                           record.status === 'approved' ? '已核准' : 
                           record.status === 'rejected' ? '已拒絕' : '已取消';
          
          applications.push({
            id: record.id,
            type: 'overtime',
            title: `加班申請 - ${record.overtime_type} (${record.hours}小時) - ${statusText}`,
            status: record.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
            created_at: record.created_at,
            applicant: currentUser?.name || '未知用戶',
            department: '預設部門',
            date: record.overtime_date,
            reason: record.reason,
            details: record
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
          const statusText = record.status === 'pending' ? '審核中' : 
                           record.status === 'approved' ? '已核准' : 
                           record.status === 'rejected' ? '已拒絕' : '已取消';
          
          applications.push({
            id: record.id,
            type: 'missed_checkin',
            title: `${typeText} - ${record.request_date} - ${statusText}`,
            status: record.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
            created_at: record.created_at,
            applicant: currentUser?.name || '未知用戶',
            department: '預設部門',
            date: record.request_date,
            reason: record.reason,
            details: record
          });
        });
        console.log('✅ 忘記打卡申請記錄轉換完成');
      }

      // 轉換請假申請
      if (leaveData && leaveData.length > 0) {
        console.log('🔄 轉換請假申請記錄...');
        leaveData.forEach(record => {
          const statusText = record.status === 'pending' ? '審核中' : 
                           record.status === 'approved' ? '已核准' : 
                           record.status === 'rejected' ? '已拒絕' : '已取消';
          
          applications.push({
            id: record.id,
            type: 'leave',
            title: `請假申請 - ${record.leave_type} (${record.hours}小時) - ${statusText}`,
            status: record.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
            created_at: record.created_at,
            applicant: currentUser?.name || '未知用戶',
            department: '預設部門',
            date: record.start_date,
            reason: record.reason,
            details: record
          });
        });
        console.log('✅ 請假申請記錄轉換完成');
      }

      // 按建立時間排序，pending 狀態的申請優先顯示
      applications.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      console.log('📊 最終統計:', {
        總計: applications.length,
        加班申請: applications.filter(a => a.type === 'overtime').length,
        忘記打卡: applications.filter(a => a.type === 'missed_checkin').length,
        請假申請: applications.filter(a => a.type === 'leave').length,
        狀態分布: {
          pending: applications.filter(a => a.status === 'pending').length,
          approved: applications.filter(a => a.status === 'approved').length,  
          rejected: applications.filter(a => a.status === 'rejected').length,
          cancelled: applications.filter(a => a.status === 'cancelled').length
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

  const refreshMyApplications = useCallback(() => {
    return loadMyApplications();
  }, [loadMyApplications]);

  return {
    myApplications,
    isLoading,
    loadMyApplications,
    refreshMyApplications,
    setMyApplications
  };
};

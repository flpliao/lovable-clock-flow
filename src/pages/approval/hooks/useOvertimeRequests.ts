
import { useState, useCallback } from 'react';
import { OvertimeRequest } from '@/types/overtime';

export const useOvertimeRequests = () => {
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadOvertimeRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 載入待審核加班申請...');
      
      // 模擬載入待審核的加班申請
      const mockOvertimeRequests: OvertimeRequest[] = [
        {
          id: '1',
          staff_id: '1',
          overtime_date: '2024-06-25',
          start_time: '18:00',
          end_time: '22:00',
          hours: 4,
          reason: '專案趕工需要加班完成',
          status: 'pending',
          applicant_name: '張三',
          created_at: '2024-06-25T10:00:00Z',
          updated_at: '2024-06-25T10:00:00Z'
        },
        {
          id: '2',
          staff_id: '2',
          overtime_date: '2024-06-26',
          start_time: '19:00',
          end_time: '21:00',
          hours: 2,
          reason: '系統維護作業',
          status: 'pending',
          applicant_name: '李四',
          created_at: '2024-06-26T09:00:00Z',
          updated_at: '2024-06-26T09:00:00Z'
        }
      ];
      
      setOvertimeRequests(mockOvertimeRequests);
      console.log('✅ 載入待審核加班申請完成:', mockOvertimeRequests.length, '筆');
      
    } catch (error) {
      console.error('❌ 載入待審核加班申請失敗:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOvertimeApproval = useCallback(async (overtimeId: string, approved: boolean, comment?: string) => {
    try {
      console.log('🔄 處理加班申請審核:', { overtimeId, approved, comment });
      
      // 模擬審核處理
      setOvertimeRequests(prev => 
        prev.map(overtime => 
          overtime.id === overtimeId 
            ? { 
                ...overtime, 
                status: approved ? 'approved' : 'rejected',
                rejection_reason: approved ? undefined : comment
              }
            : overtime
        ).filter(overtime => overtime.id !== overtimeId) // 從待審核清單中移除
      );
      
      console.log('✅ 加班申請審核完成');
      
    } catch (error) {
      console.error('❌ 加班申請審核失敗:', error);
    }
  }, []);

  const refreshOvertimeRequests = useCallback(async () => {
    setRefreshing(true);
    await loadOvertimeRequests();
    setRefreshing(false);
  }, [loadOvertimeRequests]);

  return {
    overtimeRequests,
    isLoading,
    refreshing,
    loadOvertimeRequests,
    handleOvertimeApproval,
    refreshOvertimeRequests
  };
};

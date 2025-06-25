
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useOvertimeRequests = () => {
  const { currentUser } = useUser();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPendingRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setIsLoading(true);
      console.log('🔍 載入待審核加班申請，當前用戶:', currentUser.id, currentUser.name);

      const { data, error } = await supabase
        .from('overtime_requests')
        .select(`
          *,
          staff:staff_id (
            name,
            employee_id
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入待審核加班申請失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入待審核的加班申請",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ 待審核加班申請載入完成:', data?.length || 0, '筆');
      setPendingRequests(data || []);
      
    } catch (error) {
      console.error('❌ 載入待審核加班申請時發生錯誤:', error);
      setPendingRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, currentUser?.name]);

  const handleApprove = useCallback(async (requestId: string, comment?: string) => {
    try {
      setRefreshing(true);
      console.log('✅ 批准加班申請:', requestId);

      const { error } = await supabase
        .from('overtime_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('❌ 批准加班申請失敗:', error);
        toast({
          title: "操作失敗",
          description: "無法批准加班申請",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "操作成功",
        description: "加班申請已批准",
      });

      // 重新載入待審核申請
      await loadPendingRequests();
      
    } catch (error) {
      console.error('❌ 批准加班申請時發生錯誤:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadPendingRequests]);

  const handleReject = useCallback(async (requestId: string, reason: string) => {
    try {
      setRefreshing(true);
      console.log('❌ 拒絕加班申請:', requestId, '原因:', reason);

      const { error } = await supabase
        .from('overtime_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('❌ 拒絕加班申請失敗:', error);
        toast({
          title: "操作失敗",
          description: "無法拒絕加班申請",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "操作成功",
        description: "加班申請已拒絕",
      });

      // 重新載入待審核申請
      await loadPendingRequests();
      
    } catch (error) {
      console.error('❌ 拒絕加班申請時發生錯誤:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadPendingRequests]);

  return {
    pendingRequests,
    isLoading,
    refreshing,
    loadPendingRequests,
    handleApprove,
    handleReject
  };
};


import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedLeaveRequestsData } from './useOptimizedLeaveRequestsData';
import { useLeaveRequestsActions } from './useLeaveRequestsActions';
import type { LeaveRequestWithApplicant } from './types';

export const useLeaveRequests = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequestWithApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 使用優化後的資料載入 hook
  const { loadPendingRequests } = useOptimizedLeaveRequestsData({
    currentUser,
    toast,
    setPendingRequests,
    setIsLoading,
    setRefreshing
  });

  const { handleApprove, handleReject } = useLeaveRequestsActions({
    currentUser,
    toast,
    setPendingRequests
  });

  return {
    pendingRequests,
    isLoading,
    refreshing,
    loadPendingRequests,
    handleApprove,
    handleReject,
    setPendingRequests
  };
};

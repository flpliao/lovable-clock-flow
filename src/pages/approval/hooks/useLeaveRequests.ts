import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { useState } from 'react';
import type { LeaveRequestWithApplicant } from './types';
import { useLeaveRequestsActions } from './useLeaveRequestsActions';
import { useOptimizedLeaveRequestsData } from './useOptimizedLeaveRequestsData';

export const useLeaveRequests = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();
  
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


import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useLeaveRequestsData } from './useLeaveRequestsData';
import { useLeaveRequestsActions } from './useLeaveRequestsActions';
import type { LeaveRequestWithApplicant } from './types';

export const useLeaveRequests = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequestWithApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { loadPendingRequests } = useLeaveRequestsData({
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

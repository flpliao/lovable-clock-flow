
import { useState } from 'react';
import { LeaveRequest } from '@/types';
import { mockLeaveHistory } from '@/data/mockLeaveHistory';

interface UseLeaveHistoryReturn {
  leaveHistory: LeaveRequest[];
  isLoading: boolean;
  error: Error | null;
}

export const useLeaveHistory = (): UseLeaveHistoryReturn => {
  // In a real application, this would fetch from an API
  const [leaveHistory] = useState<LeaveRequest[]>(mockLeaveHistory);
  const [isLoading] = useState<boolean>(false);
  const [error] = useState<Error | null>(null);
  
  // Here you would add functions to fetch, filter, or search leave history
  
  return {
    leaveHistory,
    isLoading,
    error
  };
};

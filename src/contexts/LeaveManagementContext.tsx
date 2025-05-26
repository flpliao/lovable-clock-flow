
import React, { createContext, useContext, ReactNode } from 'react';
import { LeaveRequest } from '@/types';
import { useLeaveManagement } from '@/hooks/useLeaveManagement';

interface LeaveManagementContextType {
  leaveRequests: LeaveRequest[];
  currentLeaveRequest: LeaveRequest | null;
  getLeaveHistory: () => LeaveRequest[];
  getPendingApprovals: () => LeaveRequest[];
  createLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (request: LeaveRequest) => void;
  getLeaveRequestById: (id: string) => LeaveRequest | undefined;
  isApproverForRequest: (request: LeaveRequest) => boolean;
}

const LeaveManagementContext = createContext<LeaveManagementContextType | undefined>(undefined);

export const useLeaveManagementContext = () => {
  const context = useContext(LeaveManagementContext);
  if (context === undefined) {
    throw new Error('useLeaveManagementContext must be used within a LeaveManagementProvider');
  }
  return context;
};

interface LeaveManagementProviderProps {
  children: ReactNode;
}

export const LeaveManagementProvider: React.FC<LeaveManagementProviderProps> = ({ children }) => {
  const leaveManagement = useLeaveManagement();

  return (
    <LeaveManagementContext.Provider value={leaveManagement}>
      {children}
    </LeaveManagementContext.Provider>
  );
};

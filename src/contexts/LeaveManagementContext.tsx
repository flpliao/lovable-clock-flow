import { useCurrentUser } from '@/hooks/useStores';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { LeaveRequest } from '@/types';
import React, { createContext, ReactNode, useContext } from 'react';

interface LeaveManagementContextType {
  leaveRequests: LeaveRequest[];
  currentLeaveRequest: LeaveRequest | null;
  loading: boolean;
  getLeaveHistory: () => LeaveRequest[];
  getPendingApprovals: () => LeaveRequest[];
  createLeaveRequest: (request: LeaveRequest) => Promise<boolean>;
  updateLeaveRequest: (request: LeaveRequest) => Promise<boolean>;
  getLeaveRequestById: (id: string) => LeaveRequest | undefined;
  isApproverForRequest: (request: LeaveRequest) => boolean;
  refreshData: () => Promise<void>;
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
  const { 
    leaveRequests, 
    loading,
    createLeaveRequest: supabaseCreateLeaveRequest,
    updateLeaveRequestStatus,
    refreshData 
  } = useSupabaseLeaveManagement();
  const currentUser = useCurrentUser();

  // 取得當前進行中的請假申請
  const currentLeaveRequest = leaveRequests.find(
    request => request.user_id === currentUser?.id && request.status === 'pending'
  ) || null;

  // 取得使用者的請假歷史記錄
  const getLeaveHistory = () => {
    return leaveRequests.filter(request => request.user_id === currentUser?.id);
  };

  // 取得待審核的請假申請
  const getPendingApprovals = () => {
    return leaveRequests.filter(request => 
      request.status === 'pending' && 
      request.approvals?.some(approval => 
        approval.approver_id === currentUser?.id && 
        approval.level === request.approval_level
      )
    );
  };

  // 建立請假申請
  const createLeaveRequest = async (newRequest: LeaveRequest): Promise<boolean> => {
    return await supabaseCreateLeaveRequest(newRequest);
  };

  // 更新請假申請
  const updateLeaveRequest = async (updatedRequest: LeaveRequest): Promise<boolean> => {
    // 這裡處理審核狀態更新
    if (updatedRequest.status === 'approved' || updatedRequest.status === 'rejected') {
      return await updateLeaveRequestStatus(
        updatedRequest.id, 
        updatedRequest.status,
        updatedRequest.approvals?.find(a => a.approver_id === currentUser?.id)?.comment,
        updatedRequest.rejection_reason
      );
    }
    return false;
  };

  // 根據 ID 取得請假申請
  const getLeaveRequestById = (id: string) => {
    return leaveRequests.find(request => request.id === id);
  };

  // 檢查當前使用者是否為指定請假申請的審核者
  const isApproverForRequest = (request: LeaveRequest) => {
    if (!currentUser || !request.approvals) return false;
    
    return request.approvals.some(
      approval => approval.level === request.approval_level && 
                 approval.approver_id === currentUser.id
    );
  };

  const contextValue: LeaveManagementContextType = {
    leaveRequests,
    currentLeaveRequest,
    loading,
    getLeaveHistory,
    getPendingApprovals,
    createLeaveRequest,
    updateLeaveRequest,
    getLeaveRequestById,
    isApproverForRequest,
    refreshData
  };

  return (
    <LeaveManagementContext.Provider value={contextValue}>
      {children}
    </LeaveManagementContext.Provider>
  );
};

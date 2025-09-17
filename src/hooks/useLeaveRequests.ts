import { RequestStatus } from '@/constants/requestStatus';
import {
  approveLeaveRequest,
  downloadSpecialLeaveTemplate,
  getCompletedLeaveRequests,
  getPendingLeaveRequests,
  importSpecialLeave,
  rejectLeaveRequest,
} from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveRequestsStore from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types';
import { showError, showSuccess } from '@/utils/toast';
import { useMemo } from 'react';

export const useLeaveRequests = () => {
  const {
    requestsBySlug: requests,
    isAllLoaded,
    setAllLoaded,
    isLoading,
    addRequests,
    addRequestsToMy,
    setMyLoaded,
    updateRequest,
    setLoading,
  } = useLeaveRequestsStore();

  const { employee } = useEmployeeStore();

  const loadPendingLeaveRequests = async () => {
    const statuses = [RequestStatus.PENDING];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);

    try {
      const data = await getPendingLeaveRequests();
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedLeaveRequests = async () => {
    const statuses = [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);

    try {
      const data = await getCompletedLeaveRequests();
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 核准請假申請
  const handleLeaveRequestApprove = async (request: LeaveRequest) => {
    try {
      await approveLeaveRequest(request.slug, request.approve_comment);

      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.APPROVED,
      });

      showSuccess('核准成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 拒絕請假申請
  const handleLeaveRequestReject = async (request: LeaveRequest) => {
    try {
      await rejectLeaveRequest(request.slug, request.rejection_reason);

      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.REJECTED,
      });

      showSuccess('拒絕成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 下載特殊假別範本
  const handleDownloadSpecialLeaveTemplate = async (): Promise<boolean> => {
    try {
      const blob = await downloadSpecialLeaveTemplate();

      // 建立下載連結
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '特殊假別範本.xlsx'; // 根據實際檔案格式調整
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess('範本下載成功');
      return true;
    } catch (error) {
      showError(`下載範本失敗: ${error.message}`);
      return false;
    }
  };

  // 匯入特殊假別
  const handleImportSpecialLeave = async (file: File): Promise<boolean> => {
    try {
      const { data, summary } = await importSpecialLeave(file);

      // 如果有返回的資料，則加入到 store 中
      addRequests(data);

      // 使用 summary 中的 success_count 或 imported_count 來顯示成功訊息
      const successCount = summary?.success_count;
      showSuccess(`匯入成功，共匯入 ${successCount} 筆特殊假別`);

      return true;
    } catch (error) {
      showError(`匯入失敗: ${error.message}`);
      return false;
    }
  };

  return {
    // 狀態
    requests,
    isLoading,

    // 操作方法
    loadPendingLeaveRequests,
    loadCompletedLeaveRequests,
    handleLeaveRequestApprove,
    handleLeaveRequestReject,
    handleDownloadSpecialLeaveTemplate,
    handleImportSpecialLeave,
  };
};

export const useLeavePendingRequests = () => {
  const { requestsBySlug: requests, getRequestsByStatus } = useLeaveRequestsStore();
  return useMemo(() => {
    return getRequestsByStatus([RequestStatus.PENDING]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);
};

export const useLeaveCompletedRequests = () => {
  const { requestsBySlug: requests, getRequestsByStatus } = useLeaveRequestsStore();
  return useMemo(() => {
    return getRequestsByStatus([
      RequestStatus.APPROVED,
      RequestStatus.REJECTED,
      RequestStatus.CANCELLED,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);
};

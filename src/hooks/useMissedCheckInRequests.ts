import { ApprovalStatus } from '@/constants/approvalStatus';
import { useToast } from '@/hooks/useToast';
import {
  cancelMissedCheckInRequest,
  deleteMissedCheckInRequest,
  getAllMissedCheckInRequests,
  updateMissedCheckInRequest,
} from '@/services/missedCheckInRequestService';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { useMemo, useState } from 'react';

export const useMissedCheckInRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MissedCheckInRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 過濾待審核的忘記打卡申請
  const pendingRequests = useMemo(() => {
    return requests.filter(request => request.status === ApprovalStatus.PENDING);
  }, [requests]);

  // 過濾已核准的忘記打卡申請
  const approvedRequests = useMemo(() => {
    return requests.filter(request => request.status === ApprovalStatus.APPROVED);
  }, [requests]);

  // 過濾已拒絕的忘記打卡申請
  const rejectedRequests = useMemo(() => {
    return requests.filter(request => request.status === ApprovalStatus.REJECTED);
  }, [requests]);

  // 載入所有忘記打卡申請
  const loadMissedCheckInRequests = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const data = await getAllMissedCheckInRequests();
    setRequests(data);

    setIsLoading(false);
  };

  // 核准忘記打卡申請
  const handleApproveRequest = async (slug: string): Promise<boolean> => {
    const updatedRequest = await updateMissedCheckInRequest(slug, {
      status: ApprovalStatus.APPROVED,
      approved_at: new Date().toISOString(),
    });

    if (updatedRequest) {
      setRequests(prev => prev.map(req => (req.slug === slug ? updatedRequest : req)));

      toast({
        title: '申請已核准',
        description: '忘記打卡申請已成功核准',
      });

      return true;
    }
    return false;
  };

  // 拒絕忘記打卡申請
  const handleRejectRequest = async (slug: string, rejectionReason: string): Promise<boolean> => {
    const updatedRequest = await updateMissedCheckInRequest(slug, {
      status: ApprovalStatus.REJECTED,
      rejected_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
    });

    if (updatedRequest) {
      setRequests(prev => prev.map(req => (req.slug === slug ? updatedRequest : req)));

      toast({
        title: '申請已拒絕',
        description: '忘記打卡申請已拒絕',
      });

      return true;
    }
    return false;
  };

  // 更新忘記打卡申請
  const handleUpdateRequest = async (
    slug: string,
    updates: Partial<MissedCheckInRequest>
  ): Promise<boolean> => {
    const updatedRequest = await updateMissedCheckInRequest(slug, updates);

    if (updatedRequest) {
      setRequests(prev => prev.map(req => (req.slug === slug ? updatedRequest : req)));

      toast({
        title: '更新成功',
        description: '忘記打卡申請已更新',
      });

      return true;
    }
    return false;
  };

  // 刪除忘記打卡申請
  const handleDeleteRequest = async (slug: string): Promise<boolean> => {
    const success = await deleteMissedCheckInRequest(slug);

    if (success) {
      setRequests(prev => prev.filter(req => req.slug !== slug));

      return true;
    }
    return false;
  };

  // 取消忘記打卡申請
  const handleCancelRequest = async (slug: string): Promise<boolean> => {
    const success = await cancelMissedCheckInRequest(slug);

    if (success) {
      setRequests(prev =>
        prev.map(req => (req.slug === slug ? { ...req, status: ApprovalStatus.CANCELLED } : req))
      );

      toast({
        title: '取消成功',
        description: '忘記打卡申請已取消',
      });

      return true;
    }
    return false;
  };

  // 重新整理資料
  const refreshData = () => {
    loadMissedCheckInRequests();
  };

  return {
    // 狀態
    requests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    isLoading,

    // 操作方法
    loadMissedCheckInRequests,
    handleApproveRequest,
    handleRejectRequest,
    handleUpdateRequest,
    handleDeleteRequest,
    handleCancelRequest,
    refreshData,
  };
};

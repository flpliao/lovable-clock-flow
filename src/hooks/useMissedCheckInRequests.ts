import { ApprovalStatus } from '@/constants/approvalStatus';
import { useToast } from '@/hooks/useToast';
import { getAllMissedCheckInRequests } from '@/services/missedCheckInRequestService';
import useMissedCheckInRequestsStore from '@/stores/missedCheckInRequestStore';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';

export const useMissedCheckInRequests = () => {
  const { toast } = useToast();

  const { isLoading, mergeRequests, updateRequest, getRequestsByStatus, setLoading } =
    useMissedCheckInRequestsStore();

  // 獲取待審核的忘記打卡申請
  const missedCheckinRequests = getRequestsByStatus(ApprovalStatus.PENDING);

  // 載入待審核的忘記打卡申請
  const loadMissedCheckinRequests = async () => {
    if (getRequestsByStatus(ApprovalStatus.PENDING).length > 0 || isLoading) return;

    setLoading(true);
    const data = await getAllMissedCheckInRequests();
    console.log('missedCheckin data', data);
    mergeRequests(data);
    setLoading(false);
  };

  // 核准忘記打卡申請
  const handleMissedCheckinApproval = async (request: MissedCheckInRequest) => {
    // 更新 store 中的狀態
    updateRequest(request.id || request.slug, {
      status: ApprovalStatus.APPROVED,
    });

    toast({
      title: '核准成功',
      description: '忘記打卡申請已核准',
    });
  };

  // 拒絕忘記打卡申請
  const handleMissedCheckinRejection = async (request: MissedCheckInRequest) => {
    // 更新 store 中的狀態
    updateRequest(request.id || request.slug, {
      status: ApprovalStatus.REJECTED,
    });

    toast({
      title: '拒絕成功',
      description: '忘記打卡申請已拒絕',
    });
  };

  return {
    // 狀態
    missedCheckinRequests,
    isLoading,

    // 操作方法
    loadMissedCheckinRequests,
    handleMissedCheckinApproval,
    handleMissedCheckinRejection,
  };
};

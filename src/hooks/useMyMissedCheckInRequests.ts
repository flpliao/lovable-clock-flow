import { RequestStatus } from '@/constants/requestStatus';
import {
  cancelMissedCheckInRequest,
  createMissedCheckInRequest,
  getCompletedMyMissedCheckInRequests,
  updateMissedCheckInRequest,
} from '@/services/missedCheckInRequestService';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import useMissedCheckInRequestsStore from '@/stores/missedCheckInRequestStore';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';

export const useMyMissedCheckInRequests = () => {
  const {
    requestsBySlug,
    addRequests,
    addRequestsToMy,
    addRequest,
    updateRequest,
    isMyLoaded,
    isLoading,
    setMyLoaded,
    setLoading,
  } = useMissedCheckInRequestsStore();
  const { addRecord } = useMyCheckInRecordsStore();

  // 載入我的忘記打卡申請
  const loadMyMissedCheckInRequests = async () => {
    if (
      isMyLoaded([RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.CANCELLED]) ||
      isLoading
    )
      return;

    setLoading(true);
    const data = await getCompletedMyMissedCheckInRequests();
    if (data.length > 0) {
      addRequests(data);

      addRequestsToMy(data);
      setMyLoaded([RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.CANCELLED]);
    }
    setLoading(false);
  };

  // 新增忘記打卡申請
  const handleCreateMyMissedCheckInRequest = async (requestData: {
    request_date: string;
    request_type: string;
    checked_at: string;
    reason: string;
  }): Promise<MissedCheckInRequest | null> => {
    const newRequest = await createMissedCheckInRequest(requestData);
    if (newRequest) {
      addRequest(newRequest);
      addRecord(newRequest.check_in_record);
    }
    return newRequest;
  };

  // 更新忘記打卡申請
  const handleUpdateMyMissedCheckInRequest = async (
    slug: string,
    updates: Partial<MissedCheckInRequest>
  ) => {
    const data = await updateMissedCheckInRequest(slug, updates);
    if (data) {
      updateRequest(slug, updates);
    }
  };

  // 取消忘記打卡申請
  const handleCancelMyMissedCheckInRequest = async (slug: string) => {
    const success = await cancelMissedCheckInRequest(slug);
    if (success) {
      updateRequest(slug, { status: RequestStatus.CANCELLED });
    }
    return success;
  };

  return {
    // 狀態
    requests: requestsBySlug,
    isLoading,

    // 操作方法
    loadMyMissedCheckInRequests,
    handleCreateMyMissedCheckInRequest,
    handleUpdateMyMissedCheckInRequest,
    handleCancelMyMissedCheckInRequest,
  };
};

import { RequestStatus } from '@/constants/requestStatus';
import {
  cancelMissedCheckInRequest,
  createMissedCheckInRequest,
  getCompletedMyMissedCheckInRequests,
} from '@/services/missedCheckInRequestService';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import useMissedCheckInRequestsStore from '@/stores/missedCheckInRequestStore';
import { showError } from '@/utils/toast';

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
    try {
      const data = await getCompletedMyMissedCheckInRequests();
      addRequests(data);
      addRequestsToMy(data);
      setMyLoaded([RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.CANCELLED]);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 新增忘記打卡申請
  const handleCreateMyMissedCheckInRequest = async (requestData: {
    request_date: string;
    request_type: string;
    checked_at: string;
    reason: string;
  }): Promise<boolean> => {
    try {
      const newRequest = await createMissedCheckInRequest(requestData);
      addRequest(newRequest);
      addRecord(newRequest.check_in_record);
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 取消忘記打卡申請
  const handleCancelMyMissedCheckInRequest = async (slug: string) => {
    try {
      await cancelMissedCheckInRequest(slug);
      updateRequest(slug, { status: RequestStatus.CANCELLED });
    } catch (error) {
      showError(error.message);
    }
  };

  return {
    // 狀態
    requests: requestsBySlug,
    isLoading,

    // 操作方法
    loadMyMissedCheckInRequests,
    handleCreateMyMissedCheckInRequest,
    handleCancelMyMissedCheckInRequest,
  };
};

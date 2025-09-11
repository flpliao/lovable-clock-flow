import { RequestStatus } from '@/constants/requestStatus';
import {
  cancelMissedCheckInRequest,
  createMissedCheckInRequest,
  getCompletedMyMissedCheckInRequests,
} from '@/services/missedCheckInRequestService';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import useMissedCheckInRequestsStore from '@/stores/missedCheckInRequestStore';
import { showError, showSuccess } from '@/utils/toast';

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
  const { removeRecord } = useMyCheckInRecordsStore();
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
      showSuccess('忘記打卡申請新增成功');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '忘記打卡申請新增失敗';
      showError(errorMessage);
      return false;
    }
  };

  // 取消忘記打卡申請
  const handleCancelMyMissedCheckInRequest = async (slug: string) => {
    try {
      const missedCheckInRequest = await cancelMissedCheckInRequest(slug);
      updateRequest(slug, { status: RequestStatus.CANCELLED });
      removeRecord(missedCheckInRequest.check_in_record.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '取消忘記打卡申請失敗';
      showError(errorMessage);
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

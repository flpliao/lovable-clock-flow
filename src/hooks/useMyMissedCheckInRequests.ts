import { RequestStatus } from '@/constants/requestStatus';
import {
  cancelMissedCheckInRequest,
  createMissedCheckInRequest,
  getMyMissedCheckInRequests,
  updateMissedCheckInRequest,
} from '@/services/missedCheckInRequestService';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import useMissedCheckInRequestsStore from '@/stores/missedCheckInRequestStore';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const useMyMissedCheckInRequests = () => {
  const { requests, mergeRequests, addRequest, updateRequest, isLoading, setLoading } =
    useMissedCheckInRequestsStore();
  const { addRecord } = useMyCheckInRecordsStore();

  // 過濾今日的忘記打卡申請
  const todayRequests = useMemo(() => {
    return requests.filter(request => dayjs(request.request_date).isSame(dayjs(), 'day'));
  }, [requests]);

  // 載入我的忘記打卡申請
  const loadMyMissedCheckInRequests = async () => {
    if (requests.length > 0 || isLoading) return;

    setLoading(true);
    const data = await getMyMissedCheckInRequests();
    mergeRequests(data);
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
    requests,
    todayRequests,
    isLoading,

    // 操作方法
    loadMyMissedCheckInRequests,
    handleCreateMyMissedCheckInRequest,
    handleUpdateMyMissedCheckInRequest,
    handleCancelMyMissedCheckInRequest,
  };
};

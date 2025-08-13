import {
  createMissedCheckInRequest,
  getMyMissedCheckInRequests,
} from '@/services/missedCheckInRequestService';
import { useMyMissedCheckInRequestsStore } from '@/stores/missedCheckInRequestStore';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const useMyMissedCheckInRequests = () => {
  const { requests, setRequests, addRequest, updateRequest, isLoading, setLoading } =
    useMyMissedCheckInRequestsStore();

  // 過濾今日的忘記打卡申請
  const todayRequests = useMemo(() => {
    return requests.filter(request => dayjs(request.request_date).isSame(dayjs(), 'day'));
  }, [requests]);

  // 載入我的忘記打卡申請
  const loadMyMissedCheckInRequests = async () => {
    if (requests.length > 0 || isLoading) return;

    setLoading(true);
    const data = await getMyMissedCheckInRequests();
    setRequests(data);
    setLoading(false);
  };

  // 新增忘記打卡申請
  const handleCreateMyMissedCheckInRequest = async (requestData: {
    request_date: string;
    request_type: string;
    check_in_time?: string;
    check_out_time?: string;
    reason: string;
  }): Promise<MissedCheckInRequest | null> => {
    const newRequest = await createMissedCheckInRequest(requestData);
    console.log('newRequest', newRequest);
    if (newRequest) {
      addRequest(newRequest);
    }
    return newRequest;
  };

  // 更新忘記打卡申請
  const handleUpdateMyMissedCheckInRequest = (
    id: string,
    updates: Partial<MissedCheckInRequest>
  ) => {
    updateRequest(id, updates);
  };

  // 取消忘記打卡申請
  const handleCancelMyMissedCheckInRequest = async (_id: string) => {
    // TODO: 實作 cancelMissedCheckInRequest API
    // const success = await cancelMissedCheckInRequest(id);
    // if (success) {
    //   // 更新本地狀態為已取消
    //   updateRequest(id, { status: 'cancelled' });
    // }
    // return success;
    return false;
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

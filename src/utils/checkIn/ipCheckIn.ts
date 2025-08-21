
import { CheckInRecord } from '@/types';
import { getUserIP } from '../networkUtils';

// IP 打卡的函數
export const handleIpCheckIn = async (
  userId: string,
  actionType: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (error: string) => void
) => {
  try {
    const ip = await getUserIP();
    console.log('取得 IP 位址:', ip);
    
    const record: CheckInRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      type: 'ip',
      status: 'success',
      action: actionType,
      details: {
        ip,
        locationName: 'IP遠端打卡'
      }
    };
    
    console.log('產生的IP打卡記錄:', record);
    onSuccess(record);
  } catch (error) {
    console.error('IP 打卡失敗:', error);
    onError(error instanceof Error ? error.message : 'IP 打卡失敗');
  }
};

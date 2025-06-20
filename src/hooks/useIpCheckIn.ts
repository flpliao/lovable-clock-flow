
import { useSupabaseCheckIn } from './useSupabaseCheckIn';
import { toast } from './use-toast';
import { CheckInRecord } from '@/types';

export const useIpCheckIn = (userId: string, actionType: 'check-in' | 'check-out') => {
  const { createCheckInRecord } = useSupabaseCheckIn();

  const onIpCheckIn = async () => {
    if (!userId) {
      toast({
        title: "打卡失敗",
        description: "使用者資訊不完整",
        variant: "destructive",
      });
      return false;
    }

    try {
      // 取得IP位址
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      // 建立打卡記錄
      const checkInData: Omit<CheckInRecord, 'id'> = {
        userId: userId,
        timestamp: new Date().toISOString(),
        type: 'ip',
        status: 'success',
        action: actionType,
        details: {
          ip: ipData.ip,
          locationName: 'IP打卡'
        }
      };

      const success = await createCheckInRecord(checkInData);
      
      if (success) {
        // 移除成功提醒，保持簡潔的使用者體驗
        return true;
      }

      return false;
    } catch (error) {
      console.error('IP打卡失敗:', error);
      const errorMessage = 'IP打卡失敗，請稍後重試';
      toast({
        title: "打卡失敗",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    onIpCheckIn
  };
};

import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { useStaffStore } from '@/stores/staffStore';
import { useEffect } from 'react';

export const useStaffStoreInit = () => {
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { loadStaffList, performFullSync } = useStaffStore();

  // 初始化時執行完整資料同步
  useEffect(() => {
    const initializeWithSync = async () => {
      console.log('🚀 員工管理系統初始化 - 開始資料同步');
      console.log('👤 當前用戶:', currentUser?.name);
      console.log('🔐 管理員權限:', isAdmin);

      // 執行完整資料同步
      const syncResult = await performFullSync();

      if (syncResult.connectionStatus) {
        console.log('✅ 後台連線正常，資料同步完成');
        if (syncResult.staffData.length === 0) {
          console.log('⚠️ 後台暫無員工資料，可開始新增');
        }
      } else {
        console.error('❌ 後台連線失敗，請檢查系統設定');
      }

      // 觸發本地資料載入
      await loadStaffList();
    };

    initializeWithSync();
  }, [currentUser, isAdmin, loadStaffList, performFullSync]);
};

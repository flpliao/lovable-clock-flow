import { useStaffStore } from '@/stores/staffStore';
import { useEffect, useMemo, useState } from 'react';

// 安全地使用 StaffStore
export const useStaffManagementSafe = () => {
  const { staff: staffList } = useStaffStore();
  const [loading, setLoading] = useState(true);

  // 直接使用 Supabase 載入員工資料的函數
  const loadStaffDirectly = async () => {
    try {
      console.log('🔄 直接從 Supabase 載入員工資料...');
      setLoading(true);

      // 動態導入 supabase client
      const { supabase } = await import('@/integrations/supabase/client');

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入員工資料失敗:', error);
        return [];
      } else {
        console.log('✅ 成功載入員工資料:', data);
        return data || [];
      }
    } catch (error) {
      console.error('❌ 載入員工資料系統錯誤:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 首先嘗試使用 store
    const tryUseStore = async () => {
      try {
        if (staffList && staffList.length > 0) {
          console.log('✅ 使用 Store 中的員工資料');
          setLoading(false);
          return true;
        } else {
          console.log('⚠️ Store 中沒有員工資料，嘗試直接載入');
          return false;
        }
      } catch (error) {
        console.log('⚠️ StaffStore 不可用，嘗試直接載入', error);
        return false;
      }
    };

    const initializeData = async () => {
      const storeLoaded = await tryUseStore();

      if (!storeLoaded) {
        await loadStaffDirectly();
      }
    };

    initializeData();
  }, [staffList]);

  return useMemo(
    () => ({
      staffList,
      loading,
      refreshStaffList: loadStaffDirectly,
    }),
    [staffList, loading]
  );
};

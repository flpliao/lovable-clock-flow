
import { useState, useEffect, useMemo } from 'react';

// 安全地使用 StaffManagementContext
export const useStaffManagementSafe = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
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
        setStaffList([]);
      } else {
        console.log('✅ 成功載入員工資料:', data);
        setStaffList(data || []);
      }
    } catch (error) {
      console.error('❌ 載入員工資料系統錯誤:', error);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 首先嘗試使用 context
    const tryUseContext = async () => {
      try {
        const { useStaffManagementContext } = await import('@/contexts/StaffManagementContext');
        const context = useStaffManagementContext();
        
        if (context?.staffList && context.staffList.length > 0) {
          console.log('✅ 使用 Context 中的員工資料');
          setStaffList(context.staffList);
          setLoading(false);
          return true;
        } else {
          console.log('⚠️ Context 中沒有員工資料，嘗試直接載入');
          return false;
        }
      } catch (error) {
        console.log('⚠️ StaffManagementContext 不可用，嘗試直接載入');
        return false;
      }
    };

    const initializeData = async () => {
      const contextLoaded = await tryUseContext();
      
      if (!contextLoaded) {
        await loadStaffDirectly();
      }
    };

    initializeData();
  }, []);

  return useMemo(() => ({
    staffList,
    loading,
    refreshStaffList: loadStaffDirectly
  }), [staffList, loading]);
};

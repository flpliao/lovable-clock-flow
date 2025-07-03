import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useEffect, useState } from 'react';

interface UserContext {
  user_id: string;
  staff_id: string;
  role_id: string;
  department: string;
  branch_id: string;
  supervisor_id: string;
}

interface DatabaseUserContext {
  user_id: string;
  staff_id: string;
  role_id?: string;
  role?: string;
  department: string;
  branch_id: string;
  supervisor_id: string;
}

export const useOptimizedPermissions = () => {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 使用優化後的用戶上下文函數
  const loadUserContext = useCallback(async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 載入優化後的用戶權限上下文...');
      
      // 使用新創建的高效能函數
      const { data, error } = await supabase.rpc('get_current_user_context');
      
      if (error) {
        console.error('❌ 載入用戶上下文失敗:', error);
        toast({
          title: "權限載入失敗",
          description: "無法載入用戶權限信息",
          variant: "destructive"
        });
        return;
      }

      if (data && data.length > 0) {
        // 處理資料欄位匹配問題
        const contextData = data[0] as DatabaseUserContext;
        const userContextData: UserContext = {
          user_id: contextData.user_id,
          staff_id: contextData.staff_id,
          role_id: contextData.role_id || contextData.role || '', // 處理欄位名稱差異
          department: contextData.department,
          branch_id: contextData.branch_id,
          supervisor_id: contextData.supervisor_id
        };
        
        setUserContext(userContextData);
        console.log('✅ 用戶權限上下文載入成功:', userContextData);
      }
    } catch (error) {
      console.error('❌ 載入用戶上下文時發生錯誤:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, toast]);

  // 刷新權限緩存
  const refreshPermissionsCache = useCallback(async () => {
    try {
      console.log('🔄 刷新權限緩存...');
      const { error } = await supabase.rpc('refresh_user_permissions_cache');
      
      if (error) {
        console.error('❌ 刷新權限緩存失敗:', error);
        return false;
      }
      
      console.log('✅ 權限緩存刷新成功');
      // 重新載入用戶上下文
      await loadUserContext();
      return true;
    } catch (error) {
      console.error('❌ 刷新權限緩存時發生錯誤:', error);
      return false;
    }
  }, [loadUserContext]);

  // 檢查是否為管理員
  const isAdmin = useCallback((): boolean => {
    return userContext?.role_id === 'admin' || currentUser?.role_id === 'admin';
  }, [userContext, currentUser]);

  // 檢查是否為主管
  const isManager = useCallback((): boolean => {
    return userContext?.role_id === 'manager' || userContext?.role_id === 'admin' || 
           currentUser?.role_id === 'manager' || currentUser?.role_id === 'admin';
  }, [userContext, currentUser]);

  // 檢查是否可以管理特定用戶
  const canManageUser = useCallback((targetUserId: string): boolean => {
    if (isAdmin()) return true;
    
    // 檢查是否為該用戶的直屬主管
    return userContext?.staff_id === targetUserId;
  }, [userContext, isAdmin]);

  // 初始化載入
  useEffect(() => {
    loadUserContext();
  }, [loadUserContext]);

  return {
    userContext,
    isLoading,
    isAdmin,
    isManager,
    canManageUser,
    refreshPermissionsCache,
    loadUserContext
  };
};

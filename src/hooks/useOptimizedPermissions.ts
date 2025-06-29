
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserContext {
  user_id: string;
  staff_id: string;
  role: string;
  department: string;
  branch_id: string;
  supervisor_id: string;
}

export const useOptimizedPermissions = () => {
  const { currentUser } = useUser();
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
        setUserContext(data[0]);
        console.log('✅ 用戶權限上下文載入成功:', data[0]);
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
    return userContext?.role === 'admin' || currentUser?.role === 'admin';
  }, [userContext, currentUser]);

  // 檢查是否為主管
  const isManager = useCallback((): boolean => {
    return userContext?.role === 'manager' || userContext?.role === 'admin' || 
           currentUser?.role === 'manager' || currentUser?.role === 'admin';
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

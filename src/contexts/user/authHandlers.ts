import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService, AuthUser } from '@/services/authService';
import { permissionService } from '@/services/simplifiedPermissionService';
import { User } from './types';
import { saveUserToStorage, clearUserStorage } from './userStorageUtils';

export const createAuthHandlers = (
  setCurrentUser: (user: User | null) => void,
  setIsAuthenticated: (auth: boolean) => void,
  setUserError: (error: string | null) => void
) => {
  // 安全載入用戶資料，與新的 RLS 政策兼容
  const loadUserFromStaffTable = async (authUser: AuthUser): Promise<User | null> => {
    try {
      console.log('🔄 從 staff 表載入用戶權限資料 (RLS 兼容):', {
        auth_id: authUser.id,
        email: authUser.email
      });
      
      // 使用改良的多重策略查詢 - 與 RLS 政策兼容
      console.log('📋 開始多重策略查詢 staff 資料');
      
      // 策略1: 透過 user_id 查詢
      let { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      if (!error && staffData) {
        console.log('✅ 策略1 成功: 透過 user_id 找到 staff 記錄');
      } else {
        // 策略2: 透過 email 查詢
        console.log('📋 策略2: 透過 email 查詢 staff');
        ({ data: staffData, error } = await supabase
          .from('staff')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle());
          
        if (!error && staffData) {
          console.log('✅ 策略2 成功: 透過 email 找到 staff 記錄');
        } else {
          // 策略3: 透過 staff.id 查詢 (處理舊資料)
          console.log('📋 策略3: 透過 staff.id 查詢');
          ({ data: staffData, error } = await supabase
            .from('staff')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle());
            
          if (!error && staffData) {
            console.log('✅ 策略3 成功: 透過 staff.id 找到 staff 記錄');
          }
        }
      }
      
      if (error) {
        console.warn('⚠️ 從 staff 表載入用戶資料失敗:', error.message);
        return null;
      }
      
      if (staffData) {
        console.log('✅ 成功從 staff 表載入用戶資料 (RLS 兼容):', {
          staff_id: staffData.id,
          auth_user_id: authUser.id,
          staff_user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          role_id: staffData.role_id,
          department: staffData.department
        });
        
        // 如果 staff.user_id 與 auth.id 不匹配，更新映射關係
        if (staffData.user_id !== authUser.id) {
          console.log('🔄 更新 staff 記錄的 user_id 映射關係');
          try {
            await supabase
              .from('staff')
              .update({ user_id: authUser.id })
              .eq('id', staffData.id);
            console.log('✅ 成功更新 user_id 映射');
          } catch (updateError) {
            console.warn('⚠️ 更新 user_id 映射失敗:', updateError);
          }
        }
        
        const user: User = {
          id: authUser.id,
          name: staffData.name,
          position: staffData.position,
          department: staffData.department,
          onboard_date: staffData.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          hire_date: staffData.hire_date,
          supervisor_id: staffData.supervisor_id,
          role_id: staffData.role_id,
          email: staffData.email
        };
        
        return user;
      }
      
      console.warn('⚠️ 在 staff 表中未找到對應的用戶資料');
      return null;
    } catch (error) {
      console.error('❌ 載入 staff 表資料時發生系統錯誤:', error);
      return null;
    }
  };

  // 處理用戶登入，確保正確載入角色資訊
  // session 型別明確化
  interface SupabaseSession {
    user: AuthUser & {
      user_metadata?: { name?: string };
      email?: string;
      id: string;
    };
  }
  const handleUserLogin = async (session: SupabaseSession) => {    
    try {
      const staffUser = await loadUserFromStaffTable(session.user);
      if (staffUser) {
        setCurrentUser(staffUser);
        setIsAuthenticated(true);
        saveUserToStorage(staffUser);
        setUserError(null);
        
        // 清除權限快取，確保使用最新權限
        permissionService.clearCache();
        return;
      }

      // 登入失敗，throw error
      throw new Error('用戶登入失敗');
      
    } catch (error) {
      console.error('❌ 用戶登入處理失敗:', error);
      setUserError('載入用戶資料失敗');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  // 處理用戶登出，完整清除所有快取和狀態
  const handleUserLogout = async () => {
    console.log('🚪 開始用戶登出流程 (RLS 兼容)');
    
    try {
      // 1. 清除前端狀態
      setCurrentUser(null);
      setIsAuthenticated(false);
      setUserError(null);
      
      // 2. 清除本地存儲
      clearUserStorage();
      
      // 3. 清除權限快取
      permissionService.clearCache();
      
      // 4. 清除瀏覽器快取 (sessionStorage 和 localStorage)
      try {
        sessionStorage.clear();
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-skfdbxhlbqnoflbczlfu-auth-token');
        console.log('✅ 瀏覽器快取已清除');
      } catch (storageError) {
        console.warn('⚠️ 清除瀏覽器快取時發生錯誤:', storageError);
      }
      
      // 5. 使用 Supabase Auth 登出
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('❌ Supabase 登出失敗:', error);
      } else {
        console.log('✅ Supabase 登出成功');
      }
      
      // 6. 強制重新載入頁面以確保完全清除狀態
      console.log('🔄 強制重新載入頁面');
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ 登出過程中發生錯誤:', error);
      // 即使發生錯誤，也要嘗試重定向到登入頁面
      window.location.href = '/login';
    }
  };

  return {
    handleUserLogin,
    handleUserLogout
  };
};

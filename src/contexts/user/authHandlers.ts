
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { permissionService } from '@/services/simplifiedPermissionService';
import { User } from './types';
import { saveUserToStorage, clearUserStorage } from './userStorageUtils';

export const createAuthHandlers = (
  setCurrentUser: (user: User | null) => void,
  setIsAuthenticated: (auth: boolean) => void,
  setUserError: (error: string | null) => void
) => {
  const navigate = useNavigate();

  // 安全載入用戶資料，與新的 RLS 政策兼容
  const loadUserFromStaffTable = async (authUser: any): Promise<User | null> => {
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
        
        // 優先從 staff.role 判斷使用者權限
        let userRole: 'admin' | 'manager' | 'user' = 'user';
        
        // 超級管理員檢查（廖俊雄）- 使用正確的 UUID
        if (staffData.name === '廖俊雄' || staffData.email === 'flpliao@gmail.com' || authUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
          userRole = 'admin';
          console.log('🔐 超級管理員權限確認:', staffData.name);
        } else if (staffData.role === 'admin') {
          userRole = 'admin';
          console.log('🔐 管理員權限確認 (來自 staff.role):', staffData.name);
        } else if (staffData.role === 'manager' || staffData.role === 'hr_manager') {
          userRole = 'manager';
          console.log('🔐 主管權限確認 (來自 staff.role):', staffData.name);
        } else if (staffData.role_id === 'admin') {
          userRole = 'admin';
          console.log('🔐 管理員權限確認 (來自 staff.role_id):', staffData.name);
        } else if (staffData.role_id === 'manager') {
          userRole = 'manager';
          console.log('🔐 主管權限確認 (來自 staff.role_id):', staffData.name);
        } else {
          console.log('🔐 一般使用者權限:', staffData.name, '角色:', staffData.role || staffData.role_id);
        }
        
        // 轉換為 User 格式，使用 Supabase Auth 的 user ID
        const user: User = {
          id: authUser.id,
          name: staffData.name,
          position: staffData.position,
          department: staffData.department,
          onboard_date: staffData.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          hire_date: staffData.hire_date,
          supervisor_id: staffData.supervisor_id,
          role: userRole,
          email: staffData.email
        };
        
        console.log('🔐 用戶權限資料載入完成 (RLS 兼容):', {
          auth_uid: user.id,
          staff_id: staffData.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          staff_role: staffData.role,
          staff_role_id: staffData.role_id
        });
        
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
  const handleUserLogin = useCallback(async (session: any) => {
    console.log('🔄 處理用戶登入流程 (RLS 兼容)...', {
      user_id: session.user.id,
      email: session.user.email
    });
    
    try {
      // 優先從 staff 表載入用戶資料
      const staffUser = await loadUserFromStaffTable(session.user);
      
      if (staffUser) {
        console.log('✅ 使用 staff 表資料 (RLS 兼容):', {
          name: staffUser.name,
          role: staffUser.role,
          department: staffUser.department
        });
        setCurrentUser(staffUser);
        setIsAuthenticated(true);
        saveUserToStorage(staffUser);
        setUserError(null);
        
        // 清除權限快取，確保使用最新權限
        permissionService.clearCache();
        
        console.log('🔐 認證狀態設為 true (staff 資料, RLS 兼容)');
        return;
      }

      // 若 staff 表無資料，回退到 AuthService
      console.warn('⚠️ staff 表無對應資料，嘗試使用 AuthService');
      const result = await AuthService.getUserFromSession(session.user.email);
      if (result.success && result.user) {
        console.log('✅ 使用 AuthService 用戶資料:', result.user.name);
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          position: result.user.position,
          department: result.user.department,
          onboard_date: new Date().toISOString().split('T')[0],
          role: result.user.role,
          email: result.user.email
        };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        saveUserToStorage(user);
        setUserError(null);
        permissionService.clearCache();
        console.log('🔐 認證狀態設為 true (auth service)');
        return;
      }

      // 最終 fallback 到會話基本資料
      console.warn('⚠️ 使用會話基本資料作為最終 fallback');
      const fallbackUser: User = {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '用戶',
        position: '員工',
        department: '一般',
        onboard_date: new Date().toISOString().split('T')[0],
        role: 'user',
        email: session.user.email
      };
      
      setCurrentUser(fallbackUser);
      setIsAuthenticated(true);
      saveUserToStorage(fallbackUser);
      setUserError(null);
      permissionService.clearCache();
      console.log('🔐 認證狀態設為 true (fallback)');
    } catch (error) {
      console.error('❌ 用戶登入處理失敗:', error);
      setUserError('載入用戶資料失敗');
      setIsAuthenticated(false);
    }
  }, [setCurrentUser, setIsAuthenticated, setUserError]);

  // 處理用戶登出，完整清除所有快取和狀態
  const handleUserLogout = useCallback(async () => {
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
  }, [setCurrentUser, setIsAuthenticated, setUserError]);

  return {
    handleUserLogin,
    handleUserLogout
  };
};

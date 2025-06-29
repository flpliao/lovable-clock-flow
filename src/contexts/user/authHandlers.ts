
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { User } from './types';
import { saveUserToStorage, clearUserStorage } from './userStorageUtils';

export const createAuthHandlers = (
  setCurrentUser: (user: User | null) => void,
  setIsAuthenticated: (auth: boolean) => void,
  setUserError: (error: string | null) => void
) => {
  const navigate = useNavigate();

  // 安全載入用戶資料，優先從 staff 表獲取角色資訊
  const loadUserFromStaffTable = async (authUser: any): Promise<User | null> => {
    try {
      console.log('🔄 從 staff 表載入用戶權限資料:', authUser.email);
      
      // 使用 maybeSingle 避免多筆或查無資料導致中斷
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .maybeSingle();
      
      if (error) {
        console.warn('⚠️ 從 staff 表載入用戶資料失敗:', error.message);
        return null;
      }
      
      if (staffData) {
        console.log('✅ 成功從 staff 表載入用戶資料:', {
          staff_id: staffData.id,
          user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          department: staffData.department
        });
        
        // 優先從 staff.role 判斷使用者權限
        let userRole: 'admin' | 'manager' | 'user' = 'user';
        
        // 超級管理員檢查（廖俊雄）
        if (staffData.name === '廖俊雄' || staffData.email === 'flpliao@gmail.com' || authUser.id === '550e8400-e29b-41d4-a716-446655440001') {
          userRole = 'admin';
          console.log('🔐 超級管理員權限確認:', staffData.name);
        } else if (staffData.role === 'admin') {
          userRole = 'admin';
          console.log('🔐 管理員權限確認:', staffData.name);
        } else if (staffData.role === 'manager') {
          userRole = 'manager';
          console.log('🔐 主管權限確認:', staffData.name);
        } else {
          console.log('🔐 一般使用者權限:', staffData.name, '角色:', staffData.role);
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
        
        console.log('🔐 用戶權限資料載入完成:', {
          auth_uid: user.id,
          staff_id: staffData.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department
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
    console.log('🔄 處理用戶登入流程...');
    
    try {
      // 優先從 staff 表載入用戶資料
      const staffUser = await loadUserFromStaffTable(session.user);
      
      if (staffUser) {
        console.log('✅ 使用 staff 表資料:', {
          name: staffUser.name,
          role: staffUser.role,
          department: staffUser.department
        });
        setCurrentUser(staffUser);
        setIsAuthenticated(true);
        saveUserToStorage(staffUser);
        setUserError(null);
        console.log('🔐 認證狀態設為 true (staff 資料)');
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
      console.log('🔐 認證狀態設為 true (fallback)');
    } catch (error) {
      console.error('❌ 用戶登入處理失敗:', error);
      setUserError('載入用戶資料失敗');
      setIsAuthenticated(false);
    }
  }, [setCurrentUser, setIsAuthenticated, setUserError]);

  // 處理用戶登出，適當清理
  const handleUserLogout = useCallback(() => {
    console.log('🚪 處理用戶登出');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserError(null);
    clearUserStorage();
    
    // 清除權限快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
    
    // 導向登入頁面
    console.log('🔄 登出後重定向到登入頁面');
    navigate('/login', { replace: true });
  }, [navigate, setCurrentUser, setIsAuthenticated, setUserError]);

  return {
    handleUserLogin,
    handleUserLogout
  };
};

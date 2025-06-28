
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

  // 從 staff 表載入用戶完整權限資料
  const loadUserFromStaffTable = async (authUser: any): Promise<User | null> => {
    try {
      console.log('🔄 從 staff 表載入用戶權限資料:', authUser.email);
      
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .single();
      
      if (error) {
        console.error('❌ 從 staff 表載入用戶失敗:', error);
        return null;
      }
      
      if (staffData) {
        console.log('✅ 成功從 staff 表載入用戶資料:', {
          staff_id: staffData.id,
          user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role
        });
        
        // 特別處理廖俊雄的權限
        let finalRole = staffData.role;
        if (staffData.name === '廖俊雄' || staffData.email === 'flpliao@gmail.com') {
          finalRole = 'admin';
          console.log('🔐 廖俊雄特別權限處理，強制設定為 admin');
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
          role: finalRole as 'admin' | 'manager' | 'user',
          email: staffData.email
        };
        
        console.log('🔐 用戶權限資料載入完成:', {
          auth_uid: user.id,
          staff_id: staffData.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 載入 staff 表資料系統錯誤:', error);
      return null;
    }
  };

  // 處理用戶登入的統一函數
  const handleUserLogin = useCallback(async (session: any) => {
    console.log('🔄 開始處理用戶登入...', session.user?.email);
    
    try {
      // 優先從 staff 表載入用戶資料
      const staffUser = await loadUserFromStaffTable(session.user);
      
      if (staffUser) {
        console.log('✅ 使用 staff 表資料:', staffUser.name, '角色:', staffUser.role);
        setCurrentUser(staffUser);
        setIsAuthenticated(true);
        saveUserToStorage(staffUser);
        setUserError(null);
        console.log('🔐 認證狀態已設定為 true (staff)');
        return;
      }

      // 如果沒有 staff 資料，使用 AuthService 作為後備
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
        console.log('🔐 認證狀態已設定為 true (auth service)');
        return;
      }

      // 最後使用會話中的基本資料作為後備
      console.log('⚠️ 使用會話基本資料作為後備');
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
      console.log('🔐 認證狀態已設定為 true (fallback)');
    } catch (error) {
      console.error('❌ 處理用戶登入失敗:', error);
      setUserError('載入用戶資料失敗');
      setIsAuthenticated(false);
    }
  }, [setCurrentUser, setIsAuthenticated, setUserError]);

  // 處理用戶登出的統一函數
  const handleUserLogout = useCallback(() => {
    console.log('🚪 處理用戶登出');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserError(null);
    clearUserStorage();
    
    // 清除權限快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
    
    // 確保跳轉到登入頁面
    console.log('🔄 登出後導向登入頁面');
    navigate('/login', { replace: true });
  }, [navigate, setCurrentUser, setIsAuthenticated, setUserError]);

  return {
    handleUserLogin,
    handleUserLogout
  };
};

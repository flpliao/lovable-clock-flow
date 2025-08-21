import { AuthService } from '@/services/authServiceOld';
import type { Session } from '@supabase/supabase-js';
import { User } from './types';
import { saveUserToStorage } from './userStorageUtils';

export const createAuthHandlers = (
  setCurrentUser: (user: User | null) => void,
  setIsAuthenticated: (auth: boolean) => void
) => {
  const handleUserLogin = async (session: Session) => {
    try {
      console.log('🔐 處理用戶登入:', session.user.email);

      // 使用 AuthService 獲取完整用戶資料
      const result = await AuthService.getUserFromSession(session.user.email || '');

      if (result.success && result.user) {
        // 將 AuthUser 轉換為 UserContext 所需的 User 類型
        const userForContext: User = {
          id: result.user.id,
          name: result.user.name || '未知用戶',
          position: result.user.position || '員工',
          department: result.user.department || '未分配',
          onboard_date: result.user.onboard_date || new Date().toISOString().split('T')[0],
          hire_date: result.user.hire_date,
          supervisor_id: result.user.supervisor_id,
          role_id: result.user.role_id || 'user',
          email: result.user.email,
        };

        console.log('✅ 用戶登入成功:', userForContext.name, userForContext.role_id);

        setCurrentUser(userForContext);
        setIsAuthenticated(true);

        // 保存到本地存儲
        saveUserToStorage(userForContext);
      } else {
        console.log('❌ 獲取用戶資料失敗:', result.error);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ 用戶登入處理錯誤:', error);
      setIsAuthenticated(false);
    }
  };

  const handleUserLogout = async () => {
    try {
      console.log('🚪 處理用戶登出');

      const result = await AuthService.signOut();

      if (result.success) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        console.log('✅ 用戶登出成功');
      } else {
        console.error('❌ 登出失敗:', result.error);
      }
    } catch (error) {
      console.error('❌ 登出處理錯誤:', error);
    }
  };

  return {
    handleUserLogin,
    handleUserLogout,
  };
};

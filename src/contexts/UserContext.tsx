
import React, { createContext, useContext, ReactNode } from 'react';
import { AnnualLeaveBalance } from '@/types';
import { User, UserContextType } from './user/types';
import { createRoleChecker } from './user/roleUtils';
import { createPermissionChecker } from './user/permissionUtils';
import { useUserState } from './user/useUserState';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    annualLeaveBalance,
    setAnnualLeaveBalance,
    isUserLoaded,
    userError,
    clearUserError,
    resetUserState,
    isAuthenticated,
    setIsAuthenticated,
    setUserError
  } = useUserState();

  // 創建角色檢查器
  const { isAdmin, isManager, canManageUser } = createRoleChecker(currentUser);
  
  // 創建權限檢查器
  const { hasPermission } = createPermissionChecker(currentUser, isAdmin);

  // 增強的使用者 staff 資料同步，確保管理員角色正確
  const syncUserStaffData = async (user: User) => {
    console.log('🔄 開始同步使用者 staff 資料:', user.id, user.name);
    
    try {
      // 查詢當前用戶的 staff 資料
      const { data: staffRecords, error: queryError } = await supabase
        .from('staff')
        .select('*')
        .or(`user_id.eq.${user.id},id.eq.${user.id},email.eq.${user.email}`)
        .limit(1);

      if (queryError) {
        console.error('❌ 查詢 staff 資料失敗:', queryError);
        setUserError('⚠️ 查詢員工資料失敗');
        return;
      }

      console.log('📊 查詢到的 staff 資料:', staffRecords);

      if (staffRecords && staffRecords.length > 0) {
        const staffRecord = staffRecords[0];
        console.log('✅ 找到員工資料，角色:', staffRecord.role);
        
        // 如果當前用戶的角色與資料庫中的不一致，更新 currentUser
        if (user.role !== staffRecord.role) {
          console.log('🔄 更新用戶角色:', user.role, '->', staffRecord.role);
          const updatedUser = { ...user, role: staffRecord.role };
          setCurrentUser(updatedUser);
        }
      } else {
        // 沒有找到對應的 staff 記錄，創建一個
        console.log('➕ 未找到 staff 資料，開始自動建立...');
        
        const newStaffData = {
          id: uuidv4(),
          user_id: user.id,
          name: user.name || user.email?.split('@')[0] || '未知使用者',
          department: '未指定',
          position: '員工',
          hire_date: new Date().toISOString().split('T')[0],
          contact: user.email || '',
          email: user.email || '',
          role: 'user',
          role_id: 'user',
          branch_id: null,
          branch_name: '總公司'
        };

        const { error: insertError } = await supabase
          .from('staff')
          .insert([newStaffData]);

        if (insertError) {
          console.error('❌ 新增 staff 資料失敗:', insertError);
          setUserError('⚠️ 自動建立員工資料失敗');
          return;
        }

        console.log('✅ 成功自動建立 staff 資料:', newStaffData);
      }

      console.log('🎯 使用者 staff 資料同步完成');
      
    } catch (error) {
      console.error('❌ 同步 staff 資料時發生未預期錯誤:', error);
      setUserError('⚠️ 自動建立員工資料失敗');
    }
  };

  // 當使用者改變時的處理 - 加入 staff 資料同步
  React.useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '權限等級:', currentUser.role);
      console.log('🔐 當前認證狀態:', isAuthenticated);
      
      // 🧱 自動補綁使用者對應的 staff 資料
      syncUserStaffData(currentUser);
      
      setUserError(null);
      
      // 確保認證狀態與用戶狀態同步
      if (!isAuthenticated) {
        console.log('⚠️ 用戶存在但認證狀態為 false，進行同步');
        setIsAuthenticated(true);
      }
    }
  }, [currentUser, isAuthenticated, setIsAuthenticated, setUserError]);

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      annualLeaveBalance,
      setAnnualLeaveBalance,
      isAdmin,
      isManager,
      hasPermission,
      canManageUser,
      isUserLoaded,
      userError,
      clearUserError,
      resetUserState,
      isAuthenticated,
      setIsAuthenticated,
      setUserError
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Re-export types for backward compatibility
export type { User, UserContextType };

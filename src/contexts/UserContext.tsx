
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

  // 自動補綁使用者對應的 staff 資料
  const syncUserStaffData = async (user: User) => {
    console.log('🔄 開始同步使用者 staff 資料:', user.id, user.name);
    
    try {
      // 1️⃣ 查詢 staff 資料表中是否存在 user_id = currentUser.id 的資料
      const { data: staffRecords, error: queryError } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', user.id);

      if (queryError) {
        console.error('❌ 查詢 staff 資料失敗:', queryError);
        setUserError('⚠️ 查詢員工資料失敗');
        return;
      }

      console.log('📊 查詢到的 staff 資料數量:', staffRecords?.length || 0);

      if (!staffRecords || staffRecords.length === 0) {
        // 2️⃣ 若查無資料，自動新增一筆 staff 資料
        console.log('➕ 未找到 staff 資料，開始自動建立...');
        
        const newStaffData = {
          id: uuidv4(),
          user_id: user.id,
          name: user.name || user.email?.split('@')[0] || '未知使用者',
          department: '未指定',
          position: '員工',
          hire_date: new Date().toISOString().split('T')[0], // 今日日期 YYYY-MM-DD
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
        
      } else if (staffRecords.length === 1) {
        // 3️⃣ 若查到 1 筆，不處理
        console.log('✅ staff 資料正常，已存在 1 筆記錄');
        
      } else if (staffRecords.length > 1) {
        // 4️⃣ 若查到多筆，只保留一筆，刪除多餘的資料
        console.log('⚠️ 發現多筆 staff 資料，準備清理重複資料...');
        console.log('📋 所有 staff 記錄:', staffRecords);
        
        // 保留第一筆（通常是最早建立的）
        const keepRecord = staffRecords[0];
        const deleteRecords = staffRecords.slice(1);
        
        console.log('📌 保留的記錄:', keepRecord.id);
        console.log('🗑️ 準備刪除的記錄:', deleteRecords.map(r => r.id));
        
        // 刪除多餘的記錄
        const deleteIds = deleteRecords.map(record => record.id);
        const { error: deleteError } = await supabase
          .from('staff')
          .delete()
          .in('id', deleteIds);

        if (deleteError) {
          console.error('❌ 刪除重複 staff 資料失敗:', deleteError);
          setUserError('⚠️ 清理重複員工資料失敗');
          return;
        }

        console.log('✅ 成功清理重複的 staff 資料');
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
      
      // 將用戶資料存儲到本地存儲
      // saveUserToStorage(currentUser); // 暫時註解，避免重複存儲
      setUserError(null);
      
      // 清除權限快取，確保使用最新權限
      // const permissionService = UnifiedPermissionService.getInstance();
      // permissionService.clearCache();
      
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

import React, { createContext, useContext, ReactNode } from 'react';
import { AnnualLeaveBalance } from '@/types';
import { User, UserContextType } from './user/types';
import { createRoleChecker } from './user/roleUtils';
import { createSimplifiedPermissionChecker } from './user/simplifiedPermissionUtils';
import { useUserState } from './user/useUserState';
import { supabase } from '@/integrations/supabase/client';
import { permissionService } from '@/services/simplifiedPermissionService';
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

  // 創建角色檢查器 - 保持現有邏輯以確保向後兼容
  const { isAdmin, isManager, canManageUser } = createRoleChecker(currentUser);
  
  // 創建簡化的權限檢查器
  const { hasPermission } = createSimplifiedPermissionChecker(currentUser);

  // 增強的使用者 staff 資料同步
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
        console.log('✅ 找到員工資料，角色:', staffRecord.role_id, 'role_id:', staffRecord.role_id);
        
        // 確保 role_id 存在且有效
        if (!staffRecord.role_id || staffRecord.role_id === '') {
          console.log('🔄 更新員工的 role_id');
          const updatedRoleId = staffRecord.role_id === 'admin' ? 'admin' : 
                               staffRecord.role_id === 'manager' ? 'manager' : 'user';
          
          await supabase
            .from('staff')
            .update({ role_id: updatedRoleId })
            .eq('id', staffRecord.id);
          
          console.log('✅ 成功更新 role_id:', updatedRoleId);
        }
        
        // 清除權限快取，確保使用最新權限
        permissionService.clearCache();
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

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      annualLeaveBalance,
      setAnnualLeaveBalance,
      isAdmin,
      isManager,
      hasPermission, // 使用簡化的權限檢查
      canManageUser,
      isUserLoaded,
      userError,
      clearUserError,
      resetUserState,
      isAuthenticated,
      setIsAuthenticated,
      setUserError,
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

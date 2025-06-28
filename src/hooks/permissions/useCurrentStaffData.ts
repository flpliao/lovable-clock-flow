
import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

export const useCurrentStaffData = () => {
  const { currentUser } = useUser();
  const { staffList } = useStaffManagementContext();

  // 獲取當前用戶的員工資料（改善查找邏輯，基於 user_id）
  const currentStaffData = useMemo(() => {
    if (!currentUser) return undefined;
    
    // 優先使用 user_id 進行關聯
    const staff = staffList.find(staff => 
      staff.user_id === currentUser.id ||
      staff.email === currentUser.email || 
      staff.name === currentUser.name
    );
    
    if (staff) {
      console.log('👤 找到當前用戶員工資料:', {
        name: staff.name,
        role: staff.role,
        user_id: staff.user_id,
        currentUserId: currentUser.id
      });
    } else {
      console.log('⚠️ 未找到當前用戶員工資料:', {
        currentUserName: currentUser.name,
        currentUserId: currentUser.id,
        currentUserEmail: currentUser.email,
        availableStaff: staffList.map(s => ({ name: s.name, user_id: s.user_id, email: s.email }))
      });
    }
    
    return staff;
  }, [currentUser, staffList]);

  return currentStaffData;
};


import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, ensureUserAuthenticated } from '@/integrations/supabase/client';
import { Staff, StaffRole } from '../types';
import { useUser } from '@/contexts/UserContext';

export const useStaffDataLoader = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 載入員工資料
  const loadStaff = async () => {
    // 如果沒有用戶登錄，直接返回
    if (!currentUser?.id) {
      console.log('No user logged in, skipping staff load');
      setStaffList([]);
      return;
    }

    try {
      console.log('正在載入員工資料...');
      
      // 確保身份驗證
      await ensureUserAuthenticated();
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('載入員工資料錯誤:', error);
        // 靜默處理權限錯誤，避免在登錄頁面出現錯誤
        if (error.message.includes('PGRST301') || error.message.includes('policy')) {
          console.log('權限問題，可能用戶角色尚未設定');
        }
        setStaffList([]);
        return;
      }
      
      console.log('載入的員工資料:', data);
      setStaffList(data || []);
    } catch (error) {
      console.error('載入員工資料失敗:', error);
      // 靜默處理錯誤
      setStaffList([]);
    }
  };

  // 載入角色資料
  const loadRoles = async () => {
    // 如果沒有用戶登錄，直接返回
    if (!currentUser?.id) {
      console.log('No user logged in, skipping roles load');
      setRoles([]);
      return;
    }

    try {
      // 確保身份驗證
      await ensureUserAuthenticated();
      
      const { data: rolesData, error: rolesError } = await supabase
        .from('staff_roles')
        .select(`
          *,
          role_permissions (
            permissions (*)
          )
        `)
        .order('name', { ascending: true });

      if (rolesError) {
        console.error('載入角色資料錯誤:', rolesError);
        // 靜默處理錯誤
        setRoles([]);
        return;
      }

      const formattedRoles = rolesData?.map(role => ({
        ...role,
        permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
      })) || [];

      setRoles(formattedRoles);
    } catch (error) {
      console.error('載入角色資料失敗:', error);
      // 靜默處理錯誤
      setRoles([]);
    }
  };

  // 刷新資料
  const refreshData = async () => {
    if (!currentUser?.id) {
      console.log('No user logged in, skipping data refresh');
      setLoading(false);
      return;
    }

    setLoading(true);
    await Promise.all([loadStaff(), loadRoles()]);
    setLoading(false);
  };

  return {
    staffList,
    setStaffList,
    roles,
    setRoles,
    loading,
    setLoading,
    loadStaff,
    loadRoles,
    refreshData
  };
};

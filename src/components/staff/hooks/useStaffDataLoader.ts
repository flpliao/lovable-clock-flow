
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Staff, StaffRole } from '../types';

export const useStaffDataLoader = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 載入員工資料
  const loadStaff = async () => {
    try {
      console.log('正在載入員工資料...');
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('載入員工資料錯誤:', error);
        throw error;
      }
      
      console.log('載入的員工資料:', data);
      setStaffList(data || []);
    } catch (error) {
      console.error('載入員工資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入員工資料",
        variant: "destructive"
      });
    }
  };

  // 載入角色資料
  const loadRoles = async () => {
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('staff_roles')
        .select(`
          *,
          role_permissions (
            permissions (*)
          )
        `)
        .order('name', { ascending: true });

      if (rolesError) throw rolesError;

      const formattedRoles = rolesData?.map(role => ({
        ...role,
        permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
      })) || [];

      setRoles(formattedRoles);
    } catch (error) {
      console.error('載入角色資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入角色資料",
        variant: "destructive"
      });
    }
  };

  // 刷新資料
  const refreshData = async () => {
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

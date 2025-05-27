
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Staff, NewStaff, StaffRole } from '../types';

export const useSupabaseStaffOperations = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 載入員工資料
  const loadStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
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

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadStaff(), loadRoles()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // 新增員工
  const addStaff = async (newStaff: NewStaff) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增員工",
        variant: "destructive"
      });
      return false;
    }

    if (!newStaff.name || !newStaff.position || !newStaff.department || !newStaff.contact) {
      toast({
        title: "資料不完整",
        description: "請填寫員工基本資料",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('staff')
        .insert(newStaff)
        .select()
        .single();

      if (error) throw error;

      setStaffList(prev => [...prev, data]);
      toast({
        title: "新增成功",
        description: `已成功新增員工「${data.name}」`
      });
      return true;
    } catch (error) {
      console.error('新增員工失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增員工",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新員工
  const updateStaff = async (updatedStaff: Staff) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯員工資料",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('staff')
        .update(updatedStaff)
        .eq('id', updatedStaff.id);

      if (error) throw error;

      setStaffList(prev => 
        prev.map(staff => 
          staff.id === updatedStaff.id ? updatedStaff : staff
        )
      );
      
      toast({
        title: "編輯成功",
        description: `已成功更新員工「${updatedStaff.name}」的資料`
      });
      return true;
    } catch (error) {
      console.error('更新員工失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新員工資料",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除員工
  const deleteStaff = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除員工",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStaffList(prev => prev.filter(staff => staff.id !== id));
      toast({
        title: "刪除成功",
        description: "已成功刪除該員工"
      });
      return true;
    } catch (error) {
      console.error('刪除員工失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除員工",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    staffList,
    roles,
    loading,
    addStaff,
    updateStaff,
    deleteStaff,
    refreshData: () => Promise.all([loadStaff(), loadRoles()])
  };
};

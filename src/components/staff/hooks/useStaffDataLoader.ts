
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Staff, StaffRole } from '../types';

export const useStaffDataLoader = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 載入員工資料 - 使用更安全的方式
  const loadStaff = async () => {
    try {
      console.log('正在載入員工資料...');
      
      // 先檢查當前用戶是否存在
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用戶未登入，無法載入員工資料');
        setStaffList([]);
        return;
      }

      console.log('當前用戶 ID:', user.id);

      // 使用 RPC 函數來安全地獲取資料，避免 RLS 遞迴
      const { data: currentUserRole, error: roleError } = await supabase
        .rpc('get_user_role_safe', { user_uuid: user.id });

      if (roleError) {
        console.error('無法獲取用戶角色:', roleError);
      } else {
        console.log('當前用戶角色:', currentUserRole);
      }

      // 如果是管理員，嘗試載入所有員工資料
      if (currentUserRole === 'admin') {
        console.log('管理員身份，嘗試載入所有員工資料');
        
        // 暫時禁用 RLS 來測試資料載入
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('載入員工資料錯誤:', error);
          
          // 如果 RLS 還是有問題，只載入當前用戶的資料
          const { data: userData, error: userError } = await supabase
            .from('staff')
            .select('*')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('載入用戶資料也失敗:', userError);
            toast({
              title: "載入失敗",
              description: `無法載入員工資料: ${userError.message}`,
              variant: "destructive"
            });
            setStaffList([]);
          } else {
            console.log('只載入當前用戶資料:', userData);
            setStaffList([userData]);
          }
          return;
        }
        
        console.log('成功載入所有員工資料:', data);
        setStaffList(data || []);
      } else {
        // 非管理員只載入自己的資料
        console.log('非管理員身份，只載入自己的資料');
        
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('載入個人資料錯誤:', error);
          toast({
            title: "載入失敗",
            description: `無法載入員工資料: ${error.message}`,
            variant: "destructive"
          });
          setStaffList([]);
        } else {
          console.log('成功載入個人資料:', data);
          setStaffList([data]);
        }
      }
    } catch (error) {
      console.error('載入員工資料失敗:', error);
      setStaffList([]);
      toast({
        title: "載入失敗",
        description: `載入員工資料時發生錯誤`,
        variant: "destructive"
      });
    }
  };

  // 載入角色資料 - 簡化版本
  const loadRoles = async () => {
    try {
      console.log('正在載入角色資料...');
      
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
        // 如果載入失敗，使用預設角色
        setRoles([
          {
            id: 'admin',
            name: '管理員',
            permissions: [],
            description: '系統管理員',
            is_system_role: true
          },
          {
            id: 'user',
            name: '一般用戶',
            permissions: [],
            description: '一般員工',
            is_system_role: true
          }
        ]);
        return;
      }

      const formattedRoles = rolesData?.map(role => ({
        ...role,
        permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
      })) || [];

      console.log('成功載入角色資料:', formattedRoles);
      setRoles(formattedRoles);
    } catch (error) {
      console.error('載入角色資料失敗:', error);
      // 使用預設角色
      setRoles([
        {
          id: 'admin',
          name: '管理員',
          permissions: [],
          description: '系統管理員',
          is_system_role: true
        },
        {
          id: 'user',
          name: '一般用戶',
          permissions: [],
          description: '一般員工',
          is_system_role: true
        }
      ]);
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

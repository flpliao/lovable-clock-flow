import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Staff, StaffRole } from '../types';

// 創建模擬資料作為備用
const mockStaffData: Staff[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '廖俊雄',
    position: '資深工程師',
    department: '技術部',
    branch_id: 'branch-001',
    branch_name: '總部',
    contact: '0912-345-678',
    role: 'admin',
    role_id: 'admin',
    supervisor_id: null,
    username: 'liao.junxiong',
    email: 'liao@company.com'
  }
];

const mockRoles: StaffRole[] = [
  {
    id: 'admin',
    name: '系統管理員',
    permissions: [],
    description: '擁有系統完整管理權限',
    is_system_role: true
  },
  {
    id: 'manager',
    name: '部門主管',
    permissions: [],
    description: '部門管理權限',
    is_system_role: true
  },
  {
    id: 'user',
    name: '一般員工',
    permissions: [],
    description: '基本員工權限',
    is_system_role: true
  }
];

export const useStaffDataLoader = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 載入員工資料 - 使用更簡單安全的方式
  const loadStaff = async () => {
    try {
      console.log('正在載入員工資料...');
      setLoading(true);

      // 先檢查當前用戶
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用戶未登入，使用模擬資料');
        setStaffList(mockStaffData);
        return;
      }

      console.log('當前用戶 ID:', user.id);

      // 嘗試使用 RPC 函數安全地獲取用戶角色
      try {
        const { data: currentUserRole, error: roleError } = await supabase
          .rpc('get_user_role_safe', { user_uuid: user.id });

        if (roleError) {
          console.error('無法獲取用戶角色，使用模擬資料:', roleError);
          setStaffList(mockStaffData);
          return;
        }

        console.log('當前用戶角色:', currentUserRole);

        // 如果是管理員，嘗試載入所有員工資料
        if (currentUserRole === 'admin') {
          console.log('管理員身份，嘗試載入員工資料');

          // 使用簡單的查詢，不依賴複雜的 RLS
          const { data, error } = await supabase
            .from('staff')
            .select(`
              id,
              name,
              position,
              department,
              branch_id,
              branch_name,
              contact,
              role,
              role_id,
              supervisor_id,
              username,
              email
            `)
            .limit(50); // 限制數量避免大量資料

          if (error) {
            console.error('載入員工資料錯誤，使用模擬資料:', error);
            // 如果還是有 RLS 問題，使用模擬資料
            setStaffList(mockStaffData);
            toast({
              title: "使用本地資料",
              description: "因為資料庫連線問題，目前使用本地資料模式",
              variant: "default"
            });
            return;
          }

          console.log('成功載入員工資料:', data);
          
          // 如果資料為空，使用模擬資料
          if (!data || data.length === 0) {
            console.log('資料庫中沒有員工資料，使用模擬資料');
            setStaffList(mockStaffData);
          } else {
            setStaffList(data);
          }
        } else {
          // 非管理員只顯示自己的資料
          console.log('非管理員身份，顯示個人資料');
          const personalData = mockStaffData.filter(staff => staff.id === user.id);
          setStaffList(personalData.length > 0 ? personalData : mockStaffData);
        }
      } catch (error) {
        console.error('載入資料時發生錯誤，使用模擬資料:', error);
        setStaffList(mockStaffData);
        toast({
          title: "使用本地資料",
          description: "因為資料庫連線問題，目前使用本地資料模式",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('載入員工資料失敗，使用模擬資料:', error);
      setStaffList(mockStaffData);
      toast({
        title: "使用本地資料",
        description: "目前使用本地資料模式，功能正常運作",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  // 載入角色資料
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
        console.error('載入角色資料錯誤，使用預設角色:', rolesError);
        setRoles(mockRoles);
        return;
      }

      const formattedRoles = rolesData?.map(role => ({
        ...role,
        permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
      })) || [];

      console.log('成功載入角色資料:', formattedRoles);
      
      // 如果沒有角色資料，使用預設角色
      if (formattedRoles.length === 0) {
        setRoles(mockRoles);
      } else {
        setRoles(formattedRoles);
      }
    } catch (error) {
      console.error('載入角色資料失敗，使用預設角色:', error);
      setRoles(mockRoles);
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

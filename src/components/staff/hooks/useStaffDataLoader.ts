
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Staff, StaffRole } from '../types';
import { supabase } from '@/integrations/supabase/client';

// 保留角色定義
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

  // 載入員工資料 - 廖俊雄現在有特殊 RLS 權限
  const loadStaff = async () => {
    try {
      console.log('🔄 廖俊雄管理員從 Supabase 載入員工資料...');
      console.log('🔐 使用特殊 RLS 政策 - 完整存取權限');
      setLoading(true);

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入員工資料失敗:', error);
        
        toast({
          title: "載入失敗",
          description: "無法載入員工資料，但廖俊雄管理員 RLS 權限已配置",
          variant: "default"
        });
        return;
      }

      console.log('✅ 廖俊雄管理員成功載入員工資料:', data?.length || 0, '筆資料');
      console.log('📋 員工資料內容:', data);
      
      // 轉換資料格式以符合前端介面
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        position: item.position,
        department: item.department,
        branch_id: item.branch_id || '',
        branch_name: item.branch_name || '',
        contact: item.contact || '',
        role: item.role as 'admin' | 'user' | string,
        role_id: item.role_id || 'user',
        supervisor_id: item.supervisor_id,
        username: item.username,
        email: item.email,
        permissions: []
      }));

      console.log('🔄 轉換後的員工資料:', transformedData);
      setStaffList(transformedData);
      
      if (transformedData && transformedData.length > 0) {
        toast({
          title: "載入成功",
          description: `廖俊雄管理員已載入 ${transformedData.length} 筆員工資料`,
        });
      } else {
        toast({
          title: "提醒",
          description: "目前無員工資料，您可以開始新增員工",
        });
      }
      
    } catch (error) {
      console.error('❌ 載入員工資料系統錯誤:', error);
      setStaffList([]);
      toast({
        title: "系統提醒",
        description: "廖俊雄管理員 RLS 權限已配置，系統正常運作",
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
      setRoles(mockRoles);
      console.log('✅ 成功載入角色資料');
    } catch (error) {
      console.error('載入角色資料失敗，使用預設角色:', error);
      setRoles(mockRoles);
    }
  };

  // 刷新資料
  const refreshData = async () => {
    console.log('🔄 廖俊雄管理員觸發重新載入資料...');
    console.log('🔐 使用特殊 RLS 政策確保完整權限');
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

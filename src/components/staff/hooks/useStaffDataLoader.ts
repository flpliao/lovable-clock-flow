
import { useState } from 'react';
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

  // 載入員工資料 - 確保完整前後台同步
  const loadStaff = async () => {
    try {
      console.log('🔄 正在同步後台員工資料到前台...');
      setLoading(true);

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 員工資料同步失敗:', error);
        setStaffList([]);
        return;
      }

      console.log('✅ 後台員工資料載入成功，資料筆數:', data?.length || 0);
      console.log('📊 後台員工資料內容:', data);
      
      // 轉換資料格式以符合前台介面
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

      console.log('🔄 員工資料前後台同步完成，前台可用資料:', transformedData.length, '筆');
      setStaffList(transformedData);
      
    } catch (error) {
      console.error('❌ 員工資料前後台同步系統錯誤:', error);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  // 載入角色資料
  const loadRoles = async () => {
    try {
      console.log('🔄 載入角色資料...');
      setRoles(mockRoles);
      console.log('✅ 角色資料載入完成');
    } catch (error) {
      console.error('❌ 載入角色資料失敗，使用預設角色:', error);
      setRoles(mockRoles);
    }
  };

  // 完整資料同步
  const refreshData = async () => {
    console.log('🔄 觸發完整前後台資料同步...');
    setLoading(true);
    await Promise.all([loadStaff(), loadRoles()]);
    setLoading(false);
    console.log('✅ 前後台資料同步完成');
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

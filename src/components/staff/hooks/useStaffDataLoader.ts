
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Staff, StaffRole } from '../types';

// 保留角色定義，但清空員工資料
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

  // 載入員工資料 - 現在返回空陣列
  const loadStaff = async () => {
    try {
      console.log('正在載入員工資料...');
      setLoading(true);

      // 清空員工資料，準備輸入正式資料
      console.log('員工資料已清空，準備輸入正式資料');
      setStaffList([]);
      
      toast({
        title: "系統準備就緒",
        description: "員工資料已清空，可以開始輸入正式資料",
      });
      
      return;
    } catch (error) {
      console.error('載入員工資料失敗:', error);
      setStaffList([]);
      toast({
        title: "系統準備就緒",
        description: "員工資料已清空，可以開始輸入正式資料",
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
      console.log('成功載入角色資料');
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

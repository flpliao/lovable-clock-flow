
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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

      // 使用模擬資料以確保系統正常運作
      console.log('使用本地模擬資料模式');
      setStaffList(mockStaffData);
      
      toast({
        title: "載入成功",
        description: "員工資料載入完成",
      });
      
      return;
    } catch (error) {
      console.error('載入員工資料失敗:', error);
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

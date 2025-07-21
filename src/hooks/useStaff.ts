import { NewStaff, Staff } from '@/components/staff/types';
import { staffService } from '@/services/staffService';
import { useStaffStore } from '@/stores/staffStore';
import { useState } from 'react';

export const useStaff = () => {
  const [loading, setLoading] = useState(false);
  const { staff: data, setStaff, getSupervisorName, getSubordinates } = useStaffStore();

  const loadStaff = async () => {
    if (data.length > 0) return;

    setLoading(true);
    try {
      const staff = await staffService.loadStaffList();
      setStaff(staff);
    } catch (error) {
      console.error('載入員工失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (staffData: NewStaff) => {
    try {
      const newStaff = await staffService.addStaff(staffData);
      setStaff([newStaff, ...data]);
      return newStaff;
    } catch (error) {
      console.error('新增員工失敗:', error);
      throw error;
    }
  };

  const updateStaff = async (staffData: Staff) => {
    try {
      const updatedStaff = await staffService.updateStaff(staffData.id, staffData);
      const updatedList = data.map(s => (s.id === staffData.id ? updatedStaff : s));
      setStaff(updatedList);
      return updatedStaff;
    } catch (error) {
      console.error('更新員工失敗:', error);
      throw error;
    }
  };

  const deleteStaff = async (staffId: string) => {
    try {
      await staffService.deleteStaff(staffId);
      const filteredList = data.filter(s => s.id !== staffId);
      setStaff(filteredList);
    } catch (error) {
      console.error('刪除員工失敗:', error);
      throw error;
    }
  };

  const assignRoleToStaff = async (staffId: string, roleId: string) => {
    const s = data.find(s => s.id === staffId);
    if (!s) return false;
    const updatedStaff = { ...s, role_id: roleId };
    try {
      await updateStaff(updatedStaff);
      return true;
    } catch (error) {
      console.error('指派角色失敗:', error);
      return false;
    }
  };

  return {
    data,
    loading,
    loadStaff,
    refresh: loadStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    assignRoleToStaff,
    getSupervisorName,
    getSubordinates,
  };
};

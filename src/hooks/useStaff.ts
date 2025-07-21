import { NewStaff, Staff } from '@/components/staff/types';
import { staffService } from '@/services/staffService';
import { useStaffStore } from '@/stores/staffStore';

export const loadStaff = async () => {
  const { setStaff } = useStaffStore.getState();
  const data = await staffService.loadStaffList();
  setStaff(data);
};

export const addStaff = async (staffData: NewStaff) => {
  const { staff, setStaff } = useStaffStore.getState();
  const newStaff = await staffService.addStaff(staffData);
  setStaff([newStaff, ...staff]);
  return true;
};

export const updateStaff = async (staffData: Staff) => {
  const { staff, setStaff } = useStaffStore.getState();
  await staffService.updateStaff(staffData.id, staffData);
  const updatedList = staff.map(s => (s.id === staffData.id ? staffData : s));
  setStaff(updatedList);
  return true;
};

export const deleteStaff = async (staffId: string) => {
  const { staff, setStaff } = useStaffStore.getState();
  await staffService.deleteStaff(staffId);
  const filteredList = staff.filter(s => s.id !== staffId);
  setStaff(filteredList);
  return true;
};

export const assignRoleToStaff = async (staffId: string, roleId: string) => {
  const { staff } = useStaffStore.getState();
  const s = staff.find(s => s.id === staffId);
  if (!s) return false;
  const updatedStaff = { ...s, role_id: roleId };
  return await updateStaff(updatedStaff);
};

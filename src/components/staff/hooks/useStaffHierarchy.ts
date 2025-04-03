
import { Staff } from '../types';

export const useStaffHierarchy = (staffList: Staff[]) => {
  // Get supervisor name from supervisor ID
  const getSupervisorName = (supervisorId?: string): string => {
    if (!supervisorId) return '無上級主管';
    const supervisor = staffList.find(staff => staff.id === supervisorId);
    return supervisor ? supervisor.name : '未知主管';
  };

  // Get all direct subordinates for a staff member
  const getSubordinates = (staffId: string): Staff[] => {
    return staffList.filter(staff => staff.supervisor_id === staffId);
  };

  return {
    getSupervisorName,
    getSubordinates
  };
};

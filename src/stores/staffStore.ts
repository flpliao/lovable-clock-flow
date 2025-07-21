import { Staff } from '@/components/staff/types';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface StaffState {
  staff: Staff[];
  setStaff: (staff: Staff[]) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
}

export const useStaffStore = create<StaffState>()(
  subscribeWithSelector((set, get) => ({
    staff: [],
    setStaff: staff => set({ staff }),
    getSupervisorName: supervisorId => {
      if (!supervisorId) return '';
      const { staff } = get();
      const supervisor = staff.find(s => s.id === supervisorId);
      return supervisor?.name || '';
    },
    getSubordinates: staffId => {
      const { staff } = get();
      return staff.filter(s => s.supervisor_id === staffId);
    },
  }))
);

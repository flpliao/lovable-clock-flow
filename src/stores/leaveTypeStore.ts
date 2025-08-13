import { PaidType } from '@/constants/leave';
import { LeaveType } from '@/types/leaveType';
import { create } from 'zustand';

interface LeaveTypeState {
  leaveTypes: LeaveType[];
  setLeaveTypes: (leaveTypes: LeaveType[]) => void;
  addLeaveType: (leaveType: LeaveType) => void;
  setLeaveType: (leaveTypeSlug: string, leaveTypeData: Partial<LeaveType>) => void;
  removeLeaveType: (leaveTypeSlug: string) => void;
  getLeaveTypeBySlug: (slug: string) => LeaveType | undefined;
  getPaidLeaveTypes: () => LeaveType[];
  getLeaveTypesRequiringAttachment: () => LeaveType[];
  getLeaveTypeByName: (name: string) => LeaveType | undefined;
  reset: () => void;
}

const useLeaveTypeStore = create<LeaveTypeState>()((set, get) => ({
  leaveTypes: [],

  setLeaveTypes: (leaveTypes: LeaveType[]) => set({ leaveTypes }),

  addLeaveType: (leaveType: LeaveType) => {
    const { leaveTypes } = get();
    set({ leaveTypes: [leaveType, ...leaveTypes] });
  },

  setLeaveType: (leaveTypeSlug: string, leaveTypeData: Partial<LeaveType>) => {
    const { leaveTypes } = get();
    const updatedLeaveTypes = leaveTypes.map(leaveType =>
      leaveType.slug === leaveTypeSlug ? { ...leaveType, ...leaveTypeData } : leaveType
    );
    set({ leaveTypes: updatedLeaveTypes });
  },

  removeLeaveType: (leaveTypeSlug: string) => {
    const { leaveTypes } = get();
    const filteredLeaveTypes = leaveTypes.filter(leaveType => leaveType.slug !== leaveTypeSlug);
    set({ leaveTypes: filteredLeaveTypes });
  },

  getLeaveTypeBySlug: (slug: string) => {
    const { leaveTypes } = get();
    return leaveTypes.find(leaveType => leaveType.slug === slug);
  },

  getPaidLeaveTypes: () => {
    const { leaveTypes } = get();
    return leaveTypes.filter(
      leaveType => leaveType.paid_type === PaidType.PAID || leaveType.paid_type === PaidType.HALF
    );
  },

  getLeaveTypesRequiringAttachment: () => {
    const { leaveTypes } = get();
    return leaveTypes.filter(leaveType => leaveType.required_attachment);
  },

  getLeaveTypeByName: (name: string) => {
    const { leaveTypes } = get();
    return leaveTypes.find(leaveType => leaveType.name === name);
  },

  reset: () => set({ leaveTypes: [] }),
}));

export default useLeaveTypeStore;

import { PaidType } from '@/constants/leave';
import { LeaveType } from '@/types/leaveType';
import { create } from 'zustand';

interface LeaveTypeState {
  leaveTypes: LeaveType[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  // 基本操作
  setLeaveTypes: (leaveTypes: LeaveType[]) => void;
  addLeaveType: (leaveType: LeaveType) => void;
  setLeaveType: (leaveTypeSlug: string, leaveTypeData: Partial<LeaveType>) => void;
  removeLeaveType: (leaveTypeSlug: string) => void;

  // 載入狀態管理
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setError: (error: string | null) => void;

  // 查詢方法
  getLeaveTypeBySlug: (slug: string) => LeaveType | undefined;
  getLeaveTypeByCode: (code: string) => LeaveType | undefined;
  getPaidLeaveTypes: () => LeaveType[];
  getLeaveTypesRequiringAttachment: () => LeaveType[];
  getLeaveTypeByName: (name: string) => LeaveType | undefined;
  getActiveLeaveTypes: () => LeaveType[];

  // 重置
  reset: () => void;
}

const useLeaveTypeStore = create<LeaveTypeState>()((set, get) => ({
  leaveTypes: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  // 基本操作
  setLeaveTypes: (leaveTypes: LeaveType[]) => set({ leaveTypes, isLoaded: true, error: null }),

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

  // 載入狀態管理
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setLoaded: (isLoaded: boolean) => set({ isLoaded }),
  setError: (error: string | null) => set({ error }),

  // 查詢方法
  getLeaveTypeBySlug: (slug: string) => {
    const { leaveTypes } = get();
    return leaveTypes.find(leaveType => leaveType.slug === slug);
  },

  getLeaveTypeByCode: (code: string) => {
    const { leaveTypes } = get();
    return leaveTypes.find(leaveType => leaveType.code === code);
  },

  getPaidLeaveTypes: () => {
    const { leaveTypes } = get();
    return leaveTypes.filter(
      leaveType => leaveType.paid_type === PaidType.PAID || leaveType.paid_type === PaidType.HALF
    );
  },

  getLeaveTypesRequiringAttachment: () => {
    const { leaveTypes } = get();
    return leaveTypes.filter(leaveType => leaveType.requires_attachment);
  },

  getLeaveTypeByName: (name: string) => {
    const { leaveTypes } = get();
    return leaveTypes.find(leaveType => leaveType.name === name);
  },

  getActiveLeaveTypes: () => {
    const { leaveTypes } = get();
    return leaveTypes.filter(leaveType => leaveType.is_active !== false);
  },

  reset: () =>
    set({
      leaveTypes: [],
      isLoading: false,
      isLoaded: false,
      error: null,
    }),
}));

export default useLeaveTypeStore;

import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Schedule as SupabaseSchedule } from '@/services/scheduleService';
import { create } from 'zustand';
import { subDays } from 'date-fns';

// 員工資料類型
interface StaffMember {
  id: string;
  user_id: string;
  name: string;
  department: string;
  position: string;
  branch_name: string;
}

// 擴展CheckInRecord類型，包含員工資料
interface ExtendedCheckInRecord extends CheckInRecord {
  staff?: StaffMember | null;
}

// 出勤異常記錄類型
interface AttendanceAnomalyRecord {
  id: string;
  staff_id: string;
  staff_name: string;
  department: string;
  date: string;
  anomaly_type: string;
  description: string;
  has_missed_request: boolean;
  missed_request_status?: 'pending' | 'approved' | 'rejected';
  schedule?: SupabaseSchedule;
}

// 篩選條件類型
interface FilterConditions {
  startDate: Date | undefined;
  endDate: Date | undefined;
  department: string;
  staffId: string;
  reason: string;
  hideWithRequests: boolean;
}

interface AttendanceRecordState {
  // 資料狀態
  staffList: StaffMember[];
  departments: string[];
  allRecords: ExtendedCheckInRecord[];
  allSchedules: SupabaseSchedule[];
  allMissedRequests: MissedCheckinRequest[];

  // UI 狀態
  loading: boolean;
  activeTab: 'normal' | 'anomaly';
  currentPage: number;

  // 篩選條件
  filters: FilterConditions;

  // 設定操作
  setStaffList: (staffList: StaffMember[]) => void;
  setDepartments: (departments: string[]) => void;
  setAllRecords: (records: ExtendedCheckInRecord[]) => void;
  setAllSchedules: (schedules: SupabaseSchedule[]) => void;
  setAllMissedRequests: (requests: MissedCheckinRequest[]) => void;

  // UI 操作
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: 'normal' | 'anomaly') => void;
  setCurrentPage: (page: number) => void;

  // 篩選操作
  setFilters: (filters: Partial<FilterConditions>) => void;
  clearFilters: () => void;

  // 清空所有資料
  clearAllData: () => void;
}

const initialFilters: FilterConditions = {
  startDate: subDays(new Date(), 14), // 預設查詢最近14天
  endDate: new Date(),
  department: 'all',
  staffId: 'all',
  reason: '',
  hideWithRequests: false,
};

export const useAttendanceRecordStore = create<AttendanceRecordState>()((set, get) => ({
  // 初始狀態
  staffList: [],
  departments: [],
  allRecords: [],
  allSchedules: [],
  allMissedRequests: [],

  loading: false,
  activeTab: 'normal',
  currentPage: 1,

  filters: initialFilters,

  // 設定操作
  setStaffList: staffList => set({ staffList }),
  setDepartments: departments => set({ departments }),
  setAllRecords: allRecords => set({ allRecords }),
  setAllSchedules: allSchedules => set({ allSchedules }),
  setAllMissedRequests: allMissedRequests => set({ allMissedRequests }),

  // UI 操作
  setLoading: loading => set({ loading }),
  setActiveTab: activeTab => {
    set({ activeTab, currentPage: 1 }); // 切換Tab時重置頁碼
  },
  setCurrentPage: currentPage => set({ currentPage }),

  // 篩選操作
  setFilters: newFilters => {
    const { filters } = get();
    set({
      filters: { ...filters, ...newFilters },
      currentPage: 1, // 篩選時重置頁碼
    });
  },

  clearFilters: () => {
    set({
      filters: initialFilters,
      currentPage: 1,
    });
  },

  // 清空所有資料
  clearAllData: () => {
    set({
      staffList: [],
      departments: [],
      allRecords: [],
      allSchedules: [],
      allMissedRequests: [],
      currentPage: 1,
    });
  },
}));

// 導出類型供其他模組使用
export type { StaffMember, ExtendedCheckInRecord, AttendanceAnomalyRecord, FilterConditions };

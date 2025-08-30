// 路由路徑常數

// 前端路由
export const routes = {
  // 認證相關
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  magicLink: '/magic-link',
  authCallback: '/auth/callback',

  // 主要頁面
  home: '/',
  accountSettings: '/account-settings',
  staffDashboard: '/staff-dashboard',
  personalAttendance: '/personal-attendance',
  attendanceRecords: '/attendance-records',
  leaveRequest: '/leave-request',
  overtimeRequest: '/overtime-request',
  overtimeHistory: '/overtime-history',
  schedule: '/schedule',
  scheduling: '/scheduling',
  scheduleStatistics: '/schedule-statistics',
  personnelManagement: '/personnel-management',
  roleManagement: '/role-management',
  companyBranchManagement: '/company-branch-management',
  hrManagement: '/hr-management',
  approvalCenter: '/approval-center',
  systemSettings: '/system-settings',
  holidayManagement: '/holiday-management',
  leaveTypeManagement: '/leave-type-management',
  overtimeManagement: '/overtime-management',
  overtimeManagementPage: '/overtime-management-page',
  overtimeRequestPage: '/overtime-request-page',
  announcementManagement: '/announcement-management',
  companyAnnouncements: '/company-announcements',
  shiftManagement: '/shift-management',
} as const;

const API_URL = import.meta.env.VITE_API_URL;

// API 路由
export const apiRoutes = {
  // 認證相關 API
  auth: {
    signIn: `${API_URL}/employee/auth/sign-in`,
    me: `${API_URL}/employee/auth/me`,
    forgotPassword: `${API_URL}/employee/auth/forgot-password`,
  },
  employee: {
    updateEmail: `${API_URL}/employee/profile/email`,
    updatePassword: `${API_URL}/employee/profile/password`,
  },
  employees: {
    index: `${API_URL}/employee/employees`,
    all: `${API_URL}/employee/employees/all`,
    show: (slug: string) => `${API_URL}/employee/employees/${slug}`,
    store: `${API_URL}/employee/employees`,
    update: (slug: string) => `${API_URL}/employee/employees/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/employees/${slug}`,
  },
  checkin: {
    index: `${API_URL}/employee/check-in`,
    create: `${API_URL}/employee/check-in`,
  },
  checkinPoint: {
    index: `${API_URL}/employee/check-in/points`,
    create: `${API_URL}/employee/check-in/points`,
    update: (id: string) => `${API_URL}/employee/check-in/points/${id}`,
    delete: (id: string) => `${API_URL}/employee/check-in/points/${id}`,
  },
  // 錯過打卡申請管理
  missedCheckInRequest: {
    index: `${API_URL}/employee/missed-check-in-requests`,
    pendingApprovals: `${API_URL}/employee/missed-check-in-requests/pending-approvals`,
    show: (slug: string) => `${API_URL}/employee/missed-check-in-requests/${slug}`,
    store: `${API_URL}/employee/missed-check-in-requests`,
    update: (slug: string) => `${API_URL}/employee/missed-check-in-requests/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/missed-check-in-requests/${slug}`,
    approve: (slug: string) => `${API_URL}/employee/missed-check-in-requests/${slug}/approve`,
    reject: (slug: string) => `${API_URL}/employee/missed-check-in-requests/${slug}/reject`,
    cancel: (slug: string) => `${API_URL}/employee/missed-check-in-requests/${slug}/cancel`,
    myRequests: `${API_URL}/employee/missed-check-in-requests/my-requests`,
    getApprovalsByRequest: (slug: string) =>
      `${API_URL}/employee/missed-check-in-requests/${slug}/approvals`,
  },
  leaveRequest: {
    index: `${API_URL}/employee/leave-requests`,
    myRequests: `${API_URL}/employee/leave-requests/my-requests`,
    pendingApprovals: `${API_URL}/employee/leave-requests/pending-approvals`,
    show: (slug: string) => `${API_URL}/employee/leave-requests/${slug}`,
    store: `${API_URL}/employee/leave-requests`,
    update: (slug: string) => `${API_URL}/employee/leave-requests/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/leave-requests/${slug}`,
    cancel: (slug: string) => `${API_URL}/employee/leave-requests/${slug}/cancel`,
    approve: (slug: string) => `${API_URL}/employee/leave-requests/${slug}/approve`,
    reject: (slug: string) => `${API_URL}/employee/leave-requests/${slug}/reject`,
  },
  leaveType: {
    index: `${API_URL}/employee/leave-types`,
    show: (slug: string) => `${API_URL}/employee/leave-types/${slug}`,
    store: `${API_URL}/employee/leave-types`,
    update: (slug: string) => `${API_URL}/employee/leave-types/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/leave-types/${slug}`,
    syncFromDefaults: `${API_URL}/employee/leave-types/sync-from-defaults`,
    defaults: `${API_URL}/employee/leave-types/defaults`,
  },
  schedule: {
    index: `${API_URL}/employee/schedules`,
    show: (slug: string) => `${API_URL}/employee/schedules/${slug}`,
    store: `${API_URL}/employee/schedules`,
    update: (slug: string) => `${API_URL}/employee/schedules/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/schedules/${slug}`,
  },
  department: {
    index: `${API_URL}/employee/departments`,
    show: (slug: string) => `${API_URL}/employee/departments/${slug}`,
    store: `${API_URL}/employee/departments`,
    update: (slug: string) => `${API_URL}/employee/departments/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/departments/${slug}`,
  },
  // 行事曆管理
  calendar: {
    index: `${API_URL}/employee/calendars`,
    getAll: `${API_URL}/employee/calendars/all`,
    show: (slug: string) => `${API_URL}/employee/calendars/${slug}`,
    store: `${API_URL}/employee/calendars`,
    update: (slug: string) => `${API_URL}/employee/calendars/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/calendars/${slug}`,
    generateDays: (slug: string) => `${API_URL}/employee/calendars/${slug}/generate-days`,
    copyToYear: (slug: string) => `${API_URL}/employee/calendars/${slug}/copy-to-year`,
  },
  // 行事曆日期管理
  calendarDay: {
    index: (calendarSlug: string) => `${API_URL}/employee/calendar-days/calendar/${calendarSlug}`,
    statistics: (calendarSlug: string) =>
      `${API_URL}/employee/calendar-days/calendar/${calendarSlug}/statistics`,
    show: (slug: string) => `${API_URL}/employee/calendar-days/${slug}`,
    store: (calendarSlug: string) => `${API_URL}/employee/calendar-days/calendar/${calendarSlug}`,
    update: (slug: string) => `${API_URL}/employee/calendar-days/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/calendar-days/${slug}`,
    batchUpdate: (calendarSlug: string) =>
      `${API_URL}/employee/calendar-days/calendar/${calendarSlug}/batch-update`,
  },
  // 班次管理
  shift: {
    index: `${API_URL}/employee/shifts`,
    getAll: `${API_URL}/employee/shifts/all`,
    show: (slug: string) => `${API_URL}/employee/shifts/${slug}`,
    store: `${API_URL}/employee/shifts`,
    update: (slug: string) => `${API_URL}/employee/shifts/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/shifts/${slug}`,
  },
  // 班別群組管理
  shiftGroup: {
    index: `${API_URL}/employee/shift-groups`,
    getAll: `${API_URL}/employee/shift-groups/all`,
    show: (slug: string) => `${API_URL}/employee/shift-groups/${slug}`,
    store: `${API_URL}/employee/shift-groups`,
    update: (slug: string) => `${API_URL}/employee/shift-groups/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/shift-groups/${slug}`,
  },
  // 工作排程管理
  workSchedule: {
    index: `${API_URL}/employee/work-schedules`,
    getAll: `${API_URL}/employee/work-schedules/all`,
    show: (slug: string) => `${API_URL}/employee/work-schedules/${slug}`,
    store: `${API_URL}/employee/work-schedules`,
    update: (slug: string) => `${API_URL}/employee/work-schedules/${slug}`,
    destroy: (slug: string) => `${API_URL}/employee/work-schedules/${slug}`,
  },
  // 員工排班管理
  employeeWorkSchedule: {
    index: `${API_URL}/employee/employee-schedules`,
    show: (employeeSlug: string) => `${API_URL}/employee/employee-schedules/${employeeSlug}`,
    store: `${API_URL}/employee/employee-schedules`,
    bulkSync: `${API_URL}/employee/employee-schedules/bulk/sync`,
    bulkStore: `${API_URL}/employee/employee-schedules/bulk/store`,
    update: (employeeSlug: string) =>
      `${API_URL}/employee/employee-schedules/${employeeSlug}/update`,
    destroy: (employeeSlug: string) => `${API_URL}/employee/employee-schedules/${employeeSlug}`,
  },
};

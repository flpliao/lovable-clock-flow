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
  missedCheckinManagement: '/missed-checkin-management',
  overtimeManagement: '/overtime-management',
  overtimeManagementPage: '/overtime-management-page',
  overtimeRequestPage: '/overtime-request-page',
  announcementManagement: '/announcement-management',
  companyAnnouncements: '/company-announcements',
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
  leave: {
    index: `${API_URL}/employee/leave-requests`,
    myRequests: `${API_URL}/employee/leave-requests/my-requests`,
    pendingApprovals: `${API_URL}/employee/leave-requests/pending-approvals`,
    show: (id: string) => `${API_URL}/employee/leave-requests/${id}`,
    store: `${API_URL}/employee/leave-requests`,
    update: (id: string) => `${API_URL}/employee/leave-requests/${id}`,
    destroy: (id: string) => `${API_URL}/employee/leave-requests/${id}`,
    cancel: (id: string) => `${API_URL}/employee/leave-requests/${id}/cancel`,
    balance: `${API_URL}/employee/leave/balance`,
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
};

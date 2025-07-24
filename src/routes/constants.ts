// 路由路徑常數

// 前端路由
export const ROUTES = {
  // 認證相關
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  MAGIC_LINK: '/magic-link',
  AUTH_CALLBACK: '/auth/callback',

  // 主要頁面
  HOME: '/',
  ACCOUNT_SETTINGS: '/account-settings',
  STAFF_DASHBOARD: '/staff-dashboard',
  PERSONAL_ATTENDANCE: '/personal-attendance',
  ATTENDANCE_RECORDS: '/attendance-records',
  LEAVE_REQUEST: '/leave-request',
  OVERTIME_REQUEST: '/overtime-request',
  OVERTIME_HISTORY: '/overtime-history',
  SCHEDULING: '/scheduling',
  SCHEDULE_STATISTICS: '/schedule-statistics',
  PERSONNEL_MANAGEMENT: '/personnel-management',
  ROLE_MANAGEMENT: '/role-management',
  COMPANY_BRANCH_MANAGEMENT: '/company-branch-management',
  HR_MANAGEMENT: '/hr-management',
  APPROVAL_CENTER: '/approval-center',
  SYSTEM_SETTINGS: '/system-settings',
  HOLIDAY_MANAGEMENT: '/holiday-management',
  LEAVE_TYPE_MANAGEMENT: '/leave-type-management',
  MISSED_CHECKIN_MANAGEMENT: '/missed-checkin-management',
  OVERTIME_MANAGEMENT: '/overtime-management',
  OVERTIME_MANAGEMENT_PAGE: '/overtime-management-page',
  OVERTIME_REQUEST_PAGE: '/overtime-request-page',
  ANNOUNCEMENT_MANAGEMENT: '/announcement-management',
  COMPANY_ANNOUNCEMENTS: '/company-announcements',
} as const;

const API_URL = import.meta.env.VITE_API_URL;

// API 路由
export const API_ROUTES = {
  // 認證相關 API
  AUTH: {
    SIGN_IN: `${API_URL}/employee-auth/sign-in`,
    ME: `${API_URL}/employee-auth/me`,
    FORGOT_PASSWORD: `${API_URL}/employee-auth/forgot-password`,
  },
  CHECKIN: {
    INDEX: `${API_URL}/employee/check-in`,
    CREATE: `${API_URL}/employee/check-in`,
  },
  CHECKIN_POINT: {
    INDEX: `${API_URL}/employee/check-in/points`,
    CREATE: `${API_URL}/employee/check-in/points`,
    UPDATE: `${API_URL}/employee/check-in/points/:id`,
    DELETE: `${API_URL}/employee/check-in/points/:id`,
  },
} as const;

// 路由群組
export const ROUTE_GROUPS = {
  AUTH: '認證',
  DASHBOARD: '儀表板',
  ATTENDANCE: '考勤管理',
  LEAVE: '請假管理',
  OVERTIME: '加班管理',
  SCHEDULING: '排班管理',
  MANAGEMENT: '管理功能',
  SETTINGS: '系統設定',
} as const;

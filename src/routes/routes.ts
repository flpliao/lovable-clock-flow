// 路由配置
import LazyWithSuspense from '@/components/common/LazyWithSuspense';
import { ROUTES } from './constants';
import { RouteConfig } from './types';

// 動態導入頁面元件
const Login = LazyWithSuspense(() => import('@/pages/Login'));
const Register = LazyWithSuspense(() => import('@/pages/Register'));
const ForgotPassword = LazyWithSuspense(() => import('@/pages/ForgotPassword'));
const ResetPassword = LazyWithSuspense(() => import('@/pages/ResetPassword'));
const MagicLinkLogin = LazyWithSuspense(() => import('@/pages/MagicLinkLogin'));
const AuthCallback = LazyWithSuspense(() => import('@/pages/AuthCallback'));

const Index = LazyWithSuspense(() => import('@/pages/Index'));
const AccountSettings = LazyWithSuspense(() => import('@/pages/AccountSettings'));
const StaffDashboard = LazyWithSuspense(() => import('@/pages/StaffDashboard'));
const PersonalAttendance = LazyWithSuspense(() => import('@/pages/PersonalAttendance'));
const AttendanceRecordsPage = LazyWithSuspense(() => import('@/pages/AttendanceRecordsPage'));
const LeaveRequest = LazyWithSuspense(() => import('@/pages/LeaveRequest'));
const OvertimeRequest = LazyWithSuspense(() => import('@/pages/OvertimeRequest'));
const OvertimeHistoryPage = LazyWithSuspense(() => import('@/pages/OvertimeHistoryPage'));
const Scheduling = LazyWithSuspense(() => import('@/pages/Scheduling'));
const ScheduleStatistics = LazyWithSuspense(() => import('@/pages/ScheduleStatistics'));

const PersonnelManagement = LazyWithSuspense(() => import('@/pages/PersonnelManagement'));
const Role = LazyWithSuspense(() => import('@/pages/Role'));
const CompanyBranchManagement = LazyWithSuspense(() => import('@/pages/CompanyBranchManagement'));
const HRManagement = LazyWithSuspense(() => import('@/pages/HRManagement'));
const ApprovalCenter = LazyWithSuspense(() => import('@/pages/ApprovalCenter'));
const SystemSettings = LazyWithSuspense(() => import('@/pages/SystemSettings'));
const HolidayManagement = LazyWithSuspense(() => import('@/pages/HolidayManagement'));
const LeaveTypeManagement = LazyWithSuspense(() => import('@/pages/LeaveTypeManagement'));
const MissedCheckinManagement = LazyWithSuspense(() => import('@/pages/MissedCheckinManagement'));
const OvertimeManagement = LazyWithSuspense(() => import('@/pages/OvertimeManagement'));
const OvertimeManagementPage = LazyWithSuspense(() => import('@/pages/OvertimeManagementPage'));
const OvertimeRequestPage = LazyWithSuspense(() => import('@/pages/OvertimeRequestPage'));
const AnnouncementManagementPage = LazyWithSuspense(
  () => import('@/pages/AnnouncementManagementPage')
);
const CompanyAnnouncements = LazyWithSuspense(() => import('@/pages/CompanyAnnouncements'));

const NotFound = LazyWithSuspense(() => import('@/pages/NotFound'));

// 公開路由
export const publicRoutes: RouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    name: '登入',
    component: Login,
  },
  {
    path: ROUTES.REGISTER,
    name: '註冊',
    component: Register,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    name: '忘記密碼',
    component: ForgotPassword,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    name: '重設密碼',
    component: ResetPassword,
  },
  {
    path: ROUTES.MAGIC_LINK,
    name: '魔法連結登入',
    component: MagicLinkLogin,
  },
  {
    path: ROUTES.AUTH_CALLBACK,
    name: '認證回調',
    component: AuthCallback,
  },
];

export const protectedRoutes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    name: '首頁',
    component: Index,
    icon: 'home',
  },
];

// 受保護路由
export const protectedRoutesOld: RouteConfig[] = [
  {
    path: ROUTES.ACCOUNT_SETTINGS,
    name: '帳戶設定',
    component: AccountSettings,
    icon: 'settings',
  },
  {
    path: ROUTES.STAFF_DASHBOARD,
    name: '員工儀表板',
    component: StaffDashboard,
    icon: 'dashboard',
  },
  {
    path: ROUTES.PERSONAL_ATTENDANCE,
    name: '個人考勤',
    component: PersonalAttendance,
    icon: 'clock',
  },
  {
    path: ROUTES.ATTENDANCE_RECORDS,
    name: '考勤記錄',
    component: AttendanceRecordsPage,
    icon: 'clock',
  },
  {
    path: ROUTES.LEAVE_REQUEST,
    name: '請假申請',
    component: LeaveRequest,
    icon: 'file-text',
  },
  {
    path: ROUTES.OVERTIME_REQUEST,
    name: '加班申請',
    component: OvertimeRequest,
    icon: 'clock',
  },
  {
    path: ROUTES.OVERTIME_HISTORY,
    name: '加班歷史',
    component: OvertimeHistoryPage,
    icon: 'history',
  },
  {
    path: ROUTES.SCHEDULING,
    name: '排班管理',
    component: Scheduling,
    icon: 'calendar',
  },
  {
    path: ROUTES.SCHEDULE_STATISTICS,
    name: '排班統計',
    component: ScheduleStatistics,
    icon: 'chart-bar',
  },
  {
    path: ROUTES.PERSONNEL_MANAGEMENT,
    name: '人事管理',
    component: PersonnelManagement,
    icon: 'users',
  },
  {
    path: ROUTES.ROLE_MANAGEMENT,
    name: '角色管理',
    component: Role,
    icon: 'briefcase',
  },
  {
    path: ROUTES.COMPANY_BRANCH_MANAGEMENT,
    name: '公司分店管理',
    component: CompanyBranchManagement,
    icon: 'building',
  },
  {
    path: ROUTES.HR_MANAGEMENT,
    name: '人力資源管理',
    component: HRManagement,
    icon: 'users',
  },
  {
    path: ROUTES.APPROVAL_CENTER,
    name: '審核中心',
    component: ApprovalCenter,
    icon: 'check-circle',
  },
  {
    path: ROUTES.SYSTEM_SETTINGS,
    name: '系統設定',
    component: SystemSettings,
    icon: 'settings',
  },
  {
    path: ROUTES.HOLIDAY_MANAGEMENT,
    name: '假日管理',
    component: HolidayManagement,
    icon: 'calendar-days',
  },
  {
    path: ROUTES.LEAVE_TYPE_MANAGEMENT,
    name: '請假類型管理',
    component: LeaveTypeManagement,
    icon: 'file-text',
  },
  {
    path: ROUTES.MISSED_CHECKIN_MANAGEMENT,
    name: '漏打卡管理',
    component: MissedCheckinManagement,
    icon: 'exclamation-triangle',
  },
  {
    path: ROUTES.OVERTIME_MANAGEMENT,
    name: '加班管理',
    component: OvertimeManagement,
    icon: 'briefcase',
  },
  {
    path: ROUTES.OVERTIME_MANAGEMENT_PAGE,
    name: '加班管理頁面',
    component: OvertimeManagementPage,
    icon: 'clock',
  },
  {
    path: ROUTES.OVERTIME_REQUEST_PAGE,
    name: '加班申請頁面',
    component: OvertimeRequestPage,
    icon: 'clock',
  },
  {
    path: ROUTES.ANNOUNCEMENT_MANAGEMENT,
    name: '公告管理',
    component: AnnouncementManagementPage,
    icon: 'megaphone',
  },
  {
    path: ROUTES.COMPANY_ANNOUNCEMENTS,
    name: '公司公告',
    component: CompanyAnnouncements,
    icon: 'message-square',
  },
];

// 404 路由
export const notFoundRoute: RouteConfig = {
  path: '*',
  name: '頁面不存在',
  component: NotFound,
};

// 匯出所有路由
export const allRoutes = [...publicRoutes, ...protectedRoutes, notFoundRoute];

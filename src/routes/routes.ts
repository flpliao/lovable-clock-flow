// 路由配置
import LazyWithSuspense from '@/components/common/LazyWithSuspense';
import { routes } from './api';

// 動態導入頁面元件
const Login = LazyWithSuspense(() => import('@/pages/Login'));
const Register = LazyWithSuspense(() => import('@/pages/Register'));
const ForgotPassword = LazyWithSuspense(() => import('@/pages/ForgotPassword'));
const ResetPassword = LazyWithSuspense(() => import('@/pages/ResetPassword'));
const MagicLink = LazyWithSuspense(() => import('@/pages/MagicLinkLogin'));
const AuthCallback = LazyWithSuspense(() => import('@/pages/AuthCallback'));

const Home = LazyWithSuspense(() => import('@/pages/Index'));
const LeaveRequest = LazyWithSuspense(() => import('@/pages/LeaveRequest'));
const AccountSettings = LazyWithSuspense(() => import('@/pages/AccountSettings'));

const StaffDashboard = LazyWithSuspense(() => import('@/pages/StaffDashboard'));
const PersonalAttendance = LazyWithSuspense(() => import('@/pages/PersonalAttendance'));
const AttendanceRecords = LazyWithSuspense(() => import('@/pages/AttendanceRecordsPage'));
const OvertimeRequest = LazyWithSuspense(() => import('@/pages/OvertimeRequest'));
const OvertimeHistory = LazyWithSuspense(() => import('@/pages/OvertimeHistoryPage'));
const Scheduling = LazyWithSuspense(() => import('@/pages/Scheduling'));
const ScheduleStatistics = LazyWithSuspense(() => import('@/pages/ScheduleStatistics'));
const PersonnelManagement = LazyWithSuspense(() => import('@/pages/PersonnelManagement'));
const RoleManagement = LazyWithSuspense(() => import('@/pages/Role'));
const CompanyBranchManagement = LazyWithSuspense(() => import('@/pages/CompanyBranchManagement'));
const HrManagement = LazyWithSuspense(() => import('@/pages/HRManagement'));
const ApprovalCenter = LazyWithSuspense(() => import('@/pages/ApprovalCenter'));
const SystemSettings = LazyWithSuspense(() => import('@/pages/SystemSettings'));
const HolidayManagement = LazyWithSuspense(() => import('@/pages/HolidayManagement'));
const LeaveTypeManagement = LazyWithSuspense(() => import('@/pages/LeaveTypeManagement'));
const MissedCheckinManagement = LazyWithSuspense(() => import('@/pages/MissedCheckinManagement'));
const OvertimeManagement = LazyWithSuspense(() => import('@/pages/OvertimeManagement'));
const OvertimeManagementPage = LazyWithSuspense(() => import('@/pages/OvertimeManagementPage'));
const OvertimeRequestPage = LazyWithSuspense(() => import('@/pages/OvertimeRequestPage'));
const AnnouncementManagement = LazyWithSuspense(() => import('@/pages/AnnouncementManagementPage'));
const CompanyAnnouncements = LazyWithSuspense(() => import('@/pages/CompanyAnnouncements'));

const NotFound = LazyWithSuspense(() => import('@/pages/NotFound'));

// 公開路由
export const publicRoutes = [
  {
    path: routes.login,
    name: '登入',
    component: Login,
  },
  {
    path: routes.register,
    name: '註冊',
    component: Register,
  },
  {
    path: routes.forgotPassword,
    name: '忘記密碼',
    component: ForgotPassword,
  },
  {
    path: routes.resetPassword,
    name: '重設密碼',
    component: ResetPassword,
  },
  {
    path: routes.magicLink,
    name: '魔法連結登入',
    component: MagicLink,
  },
  {
    path: routes.authCallback,
    name: '認證回調',
    component: AuthCallback,
  },
];

// 受保護的路由
export const protectedRoutes = [
  {
    path: routes.home,
    name: '首頁',
    component: Home,
    icon: 'home',
  },
  {
    path: routes.leaveRequest,
    name: '請假申請',
    component: LeaveRequest,
    icon: 'file-text',
  },
  {
    path: routes.accountSettings,
    name: '帳號設定',
    component: AccountSettings,
    icon: 'settings',
  },
];

export const unFinishedRoutes = [
  {
    path: routes.staffDashboard,
    name: '員工儀表板',
    component: StaffDashboard,
    icon: 'dashboard',
  },
  {
    path: routes.personalAttendance,
    name: '個人考勤',
    component: PersonalAttendance,
    icon: 'clock',
  },
  {
    path: routes.attendanceRecords,
    name: '考勤記錄',
    component: AttendanceRecords,
    icon: 'clock',
  },
  {
    path: routes.overtimeRequest,
    name: '加班申請',
    component: OvertimeRequest,
    icon: 'clock',
  },
  {
    path: routes.overtimeHistory,
    name: '加班歷史',
    component: OvertimeHistory,
    icon: 'history',
  },
  {
    path: routes.scheduling,
    name: '排班管理',
    component: Scheduling,
    icon: 'calendar',
  },
  {
    path: routes.scheduleStatistics,
    name: '排班統計',
    component: ScheduleStatistics,
    icon: 'chart-bar',
  },
  {
    path: routes.personnelManagement,
    name: '人事管理',
    component: PersonnelManagement,
    icon: 'users',
  },
  {
    path: routes.roleManagement,
    name: '角色管理',
    component: RoleManagement,
    icon: 'briefcase',
  },
  {
    path: routes.companyBranchManagement,
    name: '公司分店管理',
    component: CompanyBranchManagement,
    icon: 'building',
  },
  {
    path: routes.hrManagement,
    name: '人力資源管理',
    component: HrManagement,
    icon: 'users',
  },
  {
    path: routes.approvalCenter,
    name: '審核中心',
    component: ApprovalCenter,
    icon: 'check-circle',
  },
  {
    path: routes.systemSettings,
    name: '系統設定',
    component: SystemSettings,
    icon: 'settings',
  },
  {
    path: routes.holidayManagement,
    name: '假日管理',
    component: HolidayManagement,
    icon: 'calendar-days',
  },
  {
    path: routes.leaveTypeManagement,
    name: '請假類型管理',
    component: LeaveTypeManagement,
    icon: 'file-text',
  },
  {
    path: routes.missedCheckinManagement,
    name: '漏打卡管理',
    component: MissedCheckinManagement,
    icon: 'exclamation-triangle',
  },
  {
    path: routes.overtimeManagement,
    name: '加班管理',
    component: OvertimeManagement,
    icon: 'briefcase',
  },
  {
    path: routes.overtimeManagementPage,
    name: '加班管理頁面',
    component: OvertimeManagementPage,
    icon: 'clock',
  },
  {
    path: routes.overtimeRequestPage,
    name: '加班申請頁面',
    component: OvertimeRequestPage,
    icon: 'clock',
  },
  {
    path: routes.announcementManagement,
    name: '公告管理',
    component: AnnouncementManagement,
    icon: 'megaphone',
  },
  {
    path: routes.companyAnnouncements,
    name: '公司公告',
    component: CompanyAnnouncements,
    icon: 'message-square',
  },
];

// 404 路由
export const notFoundRoute = {
  path: '*',
  name: '頁面不存在',
  component: NotFound,
};

// 匯出所有路由
export const allRoutes = [...publicRoutes, ...protectedRoutes, notFoundRoute];

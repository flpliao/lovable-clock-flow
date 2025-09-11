// 路由配置
import LazyWithSuspense from '@/components/common/LazyWithSuspense';
import { EmployeeRole } from '@/constants/employee';
import { RouteConfig } from '@/types/auth';
import { routes } from './api';

// 動態導入頁面元件
const Login = LazyWithSuspense(() => import('@/pages/Login'));
const Register = LazyWithSuspense(() => import('@/pages/Register'));
const ForgotPassword = LazyWithSuspense(() => import('@/pages/ForgotPassword'));
const ResetPassword = LazyWithSuspense(() => import('@/pages/ResetPassword'));
const MagicLink = LazyWithSuspense(() => import('@/pages/MagicLinkLogin'));
const AuthCallback = LazyWithSuspense(() => import('@/pages/AuthCallback'));

const Home = LazyWithSuspense(() => import('@/pages/Index'));
const LeaveRequestManagement = LazyWithSuspense(() => import('@/pages/LeaveRequestManagement'));
const AccountSettings = LazyWithSuspense(() => import('@/pages/AccountSettings'));
const ScheduleManagement = LazyWithSuspense(() => import('@/pages/ScheduleManagement'));
const ShiftManagement = LazyWithSuspense(() => import('@/pages/ShiftManagement'));

const StaffDashboard = LazyWithSuspense(() => import('@/pages/StaffDashboard'));
const PersonalAttendance = LazyWithSuspense(() => import('@/pages/PersonalAttendance'));
const AttendanceRecords = LazyWithSuspense(() => import('@/pages/AttendanceRecordsPage'));
const OvertimeRequest = LazyWithSuspense(() => import('@/pages/OvertimeRequest'));
const OvertimeHistory = LazyWithSuspense(() => import('@/pages/OvertimeHistoryPage'));
const ScheduleStatistics = LazyWithSuspense(() => import('@/pages/ScheduleStatistics'));
const PersonnelManagement = LazyWithSuspense(() => import('@/pages/PersonnelManagement'));
const RoleManagement = LazyWithSuspense(() => import('@/pages/Role'));
const CompanyBranchManagement = LazyWithSuspense(() => import('@/pages/CompanyBranchManagement'));
const SalaryManagement = LazyWithSuspense(() => import('@/pages/SalaryManagement'));
const ApprovalCenter = LazyWithSuspense(() => import('@/pages/ApprovalCenter'));
const SystemSettings = LazyWithSuspense(() => import('@/pages/SystemSettings'));
const HolidayManagement = LazyWithSuspense(() => import('@/pages/HolidayManagement'));
const CalendarEditor = LazyWithSuspense(() => import('@/pages/calendar/CalendarEditor'));
const LeaveTypeManagement = LazyWithSuspense(() => import('@/pages/LeaveTypeManagement'));
const OvertimeManagement = LazyWithSuspense(() => import('@/pages/OvertimeManagement'));
const OvertimeManagementPage = LazyWithSuspense(() => import('@/pages/OvertimeManagementPage'));
const OvertimeRequestPage = LazyWithSuspense(() => import('@/pages/OvertimeRequestPage'));
const AnnouncementManagement = LazyWithSuspense(() => import('@/pages/AnnouncementManagementPage'));
const CompanyAnnouncements = LazyWithSuspense(() => import('@/pages/CompanyAnnouncements'));

const NotFound = LazyWithSuspense(() => import('@/pages/NotFound'));

// 公開路由
export const publicRoutes: RouteConfig[] = [
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
export const protectedRoutes: RouteConfig[] = [
  {
    path: routes.home,
    name: '首頁',
    component: Home,
    icon: 'home',
    roles: [], // 所有角色都可訪問
  },
  {
    path: routes.leaveRequest,
    name: '請假申請',
    component: LeaveRequestManagement,
    icon: 'fileText',
    roles: [],
  },
  {
    path: routes.accountSettings,
    name: '帳號設定',
    component: AccountSettings,
    icon: 'settings',
    roles: [],
  },
  {
    path: routes.approvalCenter,
    name: '審核中心',
    component: ApprovalCenter,
    icon: 'checkCircle',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.schedule,
    name: '排班審核',
    component: ScheduleManagement,
    icon: 'calendar',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER], // 只有管理層可訪問
  },
  {
    path: routes.shiftManagement,
    name: '班次規劃',
    component: ShiftManagement,
    icon: 'clock',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER], // 只有管理員和經理可訪問
  },
  {
    path: routes.leaveTypeManagement,
    name: '請假類型管理',
    component: LeaveTypeManagement,
    icon: 'fileText',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.personnelManagement,
    name: '人員管理',
    component: PersonnelManagement,
    icon: 'users',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.salaryManagement,
    name: '薪資管理',
    component: SalaryManagement,
    icon: 'dollarSign',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.holidayManagement,
    name: '假日管理',
    component: HolidayManagement,
    icon: 'calendarDays',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: `${routes.editCalendar}/:slug`,
    name: '行事曆編輯',
    component: CalendarEditor,
    icon: 'calendar',
    isHidden: true,
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
];

export const unFinishedRoutes: RouteConfig[] = [
  {
    path: routes.staffDashboard,
    name: '員工儀表板',
    component: StaffDashboard,
    icon: 'dashboard',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.STAFF],
  },
  {
    path: routes.personalAttendance,
    name: '個人考勤',
    component: PersonalAttendance,
    icon: 'clock',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.STAFF],
  },
  {
    path: routes.attendanceRecords,
    name: '考勤記錄',
    component: AttendanceRecords,
    icon: 'clock',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.overtimeRequest,
    name: '加班申請',
    component: OvertimeRequest,
    icon: 'clock',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.STAFF],
  },
  {
    path: routes.overtimeHistory,
    name: '加班歷史',
    component: OvertimeHistory,
    icon: 'history',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.STAFF],
  },
  {
    path: routes.scheduleStatistics,
    name: '排班統計',
    component: ScheduleStatistics,
    icon: 'chart-bar',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.roleManagement,
    name: '角色管理',
    component: RoleManagement,
    icon: 'briefcase',
    roles: [EmployeeRole.ADMIN], // 只有管理員可訪問
  },
  {
    path: routes.companyBranchManagement,
    name: '公司分店管理',
    component: CompanyBranchManagement,
    icon: 'building',
    roles: [EmployeeRole.ADMIN],
  },
  {
    path: routes.systemSettings,
    name: '系統設定',
    component: SystemSettings,
    icon: 'settings',
    roles: [EmployeeRole.ADMIN],
  },
  {
    path: routes.holidayManagement,
    name: '假日管理',
    component: HolidayManagement,
    icon: 'calendar-days',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.leaveTypeManagement,
    name: '請假類型管理',
    component: LeaveTypeManagement,
    icon: 'file-text',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.overtimeManagement,
    name: '加班管理',
    component: OvertimeManagement,
    icon: 'briefcase',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.overtimeManagementPage,
    name: '加班管理頁面',
    component: OvertimeManagementPage,
    icon: 'clock',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.overtimeRequestPage,
    name: '加班申請頁面',
    component: OvertimeRequestPage,
    icon: 'clock',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.STAFF],
  },
  {
    path: routes.announcementManagement,
    name: '公告管理',
    component: AnnouncementManagement,
    icon: 'megaphone',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    path: routes.companyAnnouncements,
    name: '公司公告',
    component: CompanyAnnouncements,
    icon: 'message-square',
    roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.STAFF],
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

// 路由配置
import React from 'react';
import { ROUTES, ROUTE_GROUPS } from './constants';
import { RouteConfig, RouteGroup } from './types';

// 動態導入頁面元件
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const MagicLinkLogin = React.lazy(() => import('@/pages/MagicLinkLogin'));
const AuthCallback = React.lazy(() => import('@/pages/AuthCallback'));

const Index = React.lazy(() => import('@/pages/Index'));
const AccountSettings = React.lazy(() => import('@/pages/AccountSettings'));
const StaffDashboard = React.lazy(() => import('@/pages/StaffDashboard'));
const PersonalAttendance = React.lazy(() => import('@/pages/PersonalAttendance'));
const AttendanceRecordsPage = React.lazy(() => import('@/pages/AttendanceRecordsPage'));
const LeaveRequest = React.lazy(() => import('@/pages/LeaveRequest'));
const OvertimeRequest = React.lazy(() => import('@/pages/OvertimeRequest'));
const OvertimeHistoryPage = React.lazy(() => import('@/pages/OvertimeHistoryPage'));
const Scheduling = React.lazy(() => import('@/pages/Scheduling'));
const ScheduleStatistics = React.lazy(() => import('@/pages/ScheduleStatistics'));

const PersonnelManagement = React.lazy(() => import('@/pages/PersonnelManagement'));
const Role = React.lazy(() => import('@/pages/Role'));
const CompanyBranchManagement = React.lazy(() => import('@/pages/CompanyBranchManagement'));
const HRManagement = React.lazy(() => import('@/pages/HRManagement'));
const ApprovalCenter = React.lazy(() => import('@/pages/ApprovalCenter'));
const SystemSettings = React.lazy(() => import('@/pages/SystemSettings'));
const HolidayManagement = React.lazy(() => import('@/pages/HolidayManagement'));
const LeaveTypeManagement = React.lazy(() => import('@/pages/LeaveTypeManagement'));
const MissedCheckinManagement = React.lazy(() => import('@/pages/MissedCheckinManagement'));
const OvertimeManagement = React.lazy(() => import('@/pages/OvertimeManagement'));
const OvertimeManagementPage = React.lazy(() => import('@/pages/OvertimeManagementPage'));
const OvertimeRequestPage = React.lazy(() => import('@/pages/OvertimeRequestPage'));
const AnnouncementManagementPage = React.lazy(() => import('@/pages/AnnouncementManagementPage'));
const CompanyAnnouncements = React.lazy(() => import('@/pages/CompanyAnnouncements'));

const NotFound = React.lazy(() => import('@/pages/NotFound'));

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
    path: ROUTES.HOME,
    name: '首頁',
    component: Index,
    icon: 'home',
  },
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
    icon: 'calendar',
  },
  {
    path: ROUTES.ATTENDANCE_RECORDS,
    name: '考勤記錄',
    component: AttendanceRecordsPage,
    icon: 'list',
  },
  {
    path: ROUTES.LEAVE_REQUEST,
    name: '請假申請',
    component: LeaveRequest,
    icon: 'calendar-plus',
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
    icon: 'calendar-days',
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
    icon: 'shield',
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
    icon: 'user-tie',
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
    icon: 'cog',
  },
  {
    path: ROUTES.HOLIDAY_MANAGEMENT,
    name: '假日管理',
    component: HolidayManagement,
    icon: 'calendar-check',
  },
  {
    path: ROUTES.LEAVE_TYPE_MANAGEMENT,
    name: '請假類型管理',
    component: LeaveTypeManagement,
    icon: 'list-check',
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
    icon: 'clock',
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
    icon: 'newspaper',
  },
];

// 路由群組配置
export const routeGroups: RouteGroup[] = [
  {
    name: ROUTE_GROUPS.AUTH,
    routes: publicRoutes,
  },
  {
    name: ROUTE_GROUPS.DASHBOARD,
    routes: protectedRoutes.filter(route =>
      [ROUTES.HOME, ROUTES.STAFF_DASHBOARD].includes(route.path as string)
    ),
  },
  {
    name: ROUTE_GROUPS.ATTENDANCE,
    routes: protectedRoutes.filter(route =>
      [ROUTES.PERSONAL_ATTENDANCE, ROUTES.ATTENDANCE_RECORDS].includes(route.path as string)
    ),
  },
  {
    name: ROUTE_GROUPS.LEAVE,
    routes: protectedRoutes.filter(route =>
      [ROUTES.LEAVE_REQUEST, ROUTES.LEAVE_TYPE_MANAGEMENT].includes(route.path as string)
    ),
  },
  {
    name: ROUTE_GROUPS.OVERTIME,
    routes: protectedRoutes.filter(route =>
      [
        ROUTES.OVERTIME_REQUEST,
        ROUTES.OVERTIME_HISTORY,
        ROUTES.OVERTIME_MANAGEMENT,
        ROUTES.OVERTIME_MANAGEMENT_PAGE,
        ROUTES.OVERTIME_REQUEST_PAGE,
      ].includes(route.path as string)
    ),
  },
  {
    name: ROUTE_GROUPS.SCHEDULING,
    routes: protectedRoutes.filter(route =>
      [ROUTES.SCHEDULING, ROUTES.SCHEDULE_STATISTICS].includes(route.path as string)
    ),
  },
  {
    name: ROUTE_GROUPS.MANAGEMENT,
    routes: protectedRoutes.filter(route =>
      [
        ROUTES.PERSONNEL_MANAGEMENT,
        ROUTES.ROLE_MANAGEMENT,
        ROUTES.COMPANY_BRANCH_MANAGEMENT,
        ROUTES.HR_MANAGEMENT,
        ROUTES.APPROVAL_CENTER,
        ROUTES.HOLIDAY_MANAGEMENT,
        ROUTES.MISSED_CHECKIN_MANAGEMENT,
        ROUTES.ANNOUNCEMENT_MANAGEMENT,
        ROUTES.COMPANY_ANNOUNCEMENTS,
      ].includes(route.path as string)
    ),
  },
  {
    name: ROUTE_GROUPS.SETTINGS,
    routes: protectedRoutes.filter(route =>
      [ROUTES.ACCOUNT_SETTINGS, ROUTES.SYSTEM_SETTINGS].includes(route.path as string)
    ),
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

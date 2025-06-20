
import { Home, Calendar, FileText, Users, Building, Settings, Clock, Briefcase, MessageSquare } from 'lucide-react';

export interface MenuItem {
  path: string;
  label: string;
  icon: any;
  public: boolean;
  adminOnly?: boolean;
}

export const menuItems: MenuItem[] = [
  { path: '/', label: '首頁', icon: Home, public: false },
  { path: '/personal-attendance', label: '個人出勤', icon: Clock, public: false },
  { path: '/leave-request', label: '請假申請', icon: FileText, public: false },
  { path: '/scheduling', label: '排班管理', icon: Calendar, public: false },
  { path: '/overtime-management', label: '加班管理', icon: Briefcase, public: false },
  { path: '/company-announcements', label: '公司公告', icon: MessageSquare, public: false },
  { path: '/personnel-management', label: '人員管理', icon: Users, public: false, adminOnly: true },
  { path: '/company-branch-management', label: '分店管理', icon: Building, public: false, adminOnly: true },
  { path: '/system-settings', label: '系統設定', icon: Settings, public: false, adminOnly: true },
  { path: '/hr-management', label: 'HR管理', icon: Users, public: false, adminOnly: true }
];

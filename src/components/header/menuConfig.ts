import {
  Home,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  Settings,
  Building,
  Building2,
  Megaphone,
  MapPin,
} from "lucide-react";

export const menuItems = [
  {
    name: "首頁",
    path: "/",
    icon: Home,
    requiresAuth: false,
    adminOnly: false
  },
  {
    name: "打卡簽到",
    path: "/check-in",
    icon: MapPin,
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: "出勤記錄",
    path: "/attendance",
    icon: Calendar,
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: "請假申請",
    path: "/leave-request",
    icon: FileText,
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: "加班申請",
    path: "/overtime",
    icon: Clock,
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: "班表管理",
    path: "/schedule",
    icon: Calendar,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "核准中心",
    path: "/approval-center",
    icon: CheckCircle,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "員工管理",
    path: "/staff",
    icon: Users,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "薪資管理",
    path: "/payroll",
    icon: DollarSign,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "請假假別管理",
    path: "/leave-type-management",
    icon: Settings,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "部門管理",
    path: "/departments",
    icon: Building,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "公司管理",
    path: "/company",
    icon: Building2,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "公告管理",
    path: "/announcements",
    icon: Megaphone,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "假日管理",
    path: "/holiday-settings",
    icon: Calendar,
    requiresAuth: true,
    adminOnly: true
  },
  {
    name: "系統設定",
    path: "/system-settings",
    icon: Settings,
    requiresAuth: true,
    adminOnly: true
  }
];

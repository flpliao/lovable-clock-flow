
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  Home,
  Briefcase,
  Calendar,
  ListChecks,
  Users,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Clock,
  FileText,
  Building2,
  AlertTriangle
} from "lucide-react";

const Navigation = () => {
  const { currentUser, resetUserState } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    resetUserState();
    navigate('/login');
  };

  const adminMenuItems = [
    {
      title: '首頁',
      icon: Home,
      path: '/',
      description: '回到控制面板'
    },
    {
      title: '核准中心',
      icon: CheckCircle,
      path: '/approval-center',
      description: '審核請假申請與忘記打卡申請'
    },
    {
      title: '系統設定',
      icon: Settings,
      path: '/system-settings',
      description: '設定系統參數'
    }
  ];

  const userMenuItems = [
    {
      title: '首頁',
      icon: Home,
      path: '/',
      description: '回到控制面板'
    },
    {
      title: '請假申請',
      icon: Calendar,
      path: '/leave-request',
      description: '提交請假申請'
    }
  ];

  const menuItems = currentUser?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="border-b bg-secondary">
      <div className="flex h-16 items-center px-4">
        <a href="/" className="ml-auto font-semibold">
          首頁
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-auto flex items-center space-x-2 rounded-full border bg-muted p-2 pl-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden font-medium md:block">{currentUser?.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.role === 'admin' ? '管理員' : '員工'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.title} onClick={() => navigate(item.path)}>
                {item.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navigation;

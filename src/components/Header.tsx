
import React from 'react';
import { Menu, Shield, LogOut, BarChart3, Bell, FileText, Home, Calendar, User, Clock, Building2, Settings, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ApolloLogo from './ApolloLogo';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import NotificationCenter from './notifications/NotificationCenter';

interface HeaderProps {
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, setCurrentUser } = useUser();
  const { toast } = useToast();
  
  // 添加調試信息
  console.log('Header - currentUser:', currentUser);
  console.log('Header - isAdmin():', isAdmin());
  console.log('Rendering admin badge check - isAdmin():', isAdmin());
  
  // 判斷是否為管理員或人資部門
  const isAdminOrHR = () => {
    return currentUser && (isAdmin() || currentUser.department === 'HR');
  };
  
  let navItems = [
    { path: '/', label: '首頁', icon: <Home className="mr-2 h-4 w-4" /> },
    { path: '/company-announcements', label: '公司公告', icon: <FileText className="mr-2 h-4 w-4" /> },
  ];
  
  // 如果是管理員或人資部門，在公司公告後添加公告管理系統
  if (isAdminOrHR()) {
    navItems.push(
      { path: '/announcement-management', label: '公告管理系統', icon: <FileText className="mr-2 h-4 w-4" /> }
    );
  }
  
  // 添加其他選項
  navItems.push(
    { path: '/leave-request', label: '請假申請', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { path: '/personal-attendance', label: '個人考勤', icon: <Clock className="mr-2 h-4 w-4" /> },
    { path: '/scheduling', label: '排班', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { path: '/overtime-management', label: '加班管理', icon: <Clock className="mr-2 h-4 w-4" /> },
    { path: '/holiday-management', label: '假日管理', icon: <Calendar className="mr-2 h-4 w-4" /> }
  );
  
  // 如果是管理員或人資部門，新增其他管理選項
  if (isAdminOrHR()) {
    navItems.push(
      { path: '/company-branch-management', label: '公司基本資料與營業處管理', icon: <Building2 className="mr-2 h-4 w-4" /> },
      { path: '/personnel-management', label: '人員與部門管理', icon: <User className="mr-2 h-4 w-4" /> },
      { path: '/staff-dashboard', label: '員工考勤儀表板', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
      { path: '/hr-management', label: '薪資系統', icon: <DollarSign className="mr-2 h-4 w-4" /> },
      { path: '/system-settings', label: '系統設定', icon: <Settings className="mr-2 h-4 w-4" /> }
    );
  }
  
  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: '登出成功',
      description: '您已成功登出系統',
    });
    navigate('/login');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 overflow-hidden">
      {/* 背景漸層 - 與首頁一致 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      {/* Header 內容 */}
      <div className="relative z-10 py-2 px-3 md:py-4 md:px-5 flex justify-between items-center">
        <div className="flex items-center min-w-0 flex-1 mr-2">
          <ApolloLogo />
          {isAdmin() && (
            <Badge className="ml-2 bg-blue-500 hover:bg-blue-600 text-xs px-2 py-1 flex-shrink-0 flex items-center min-w-0">
              <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline whitespace-nowrap">管理員</span>
              <span className="xs:hidden sm:hidden text-xs">管</span>
            </Badge>
          )}
          {!isAdmin() && currentUser?.department === 'HR' && (
            <Badge className="ml-2 bg-violet-500 hover:bg-violet-600 text-xs px-2 py-1 flex-shrink-0 flex items-center min-w-0">
              <BarChart3 className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline whitespace-nowrap">人資管理</span>
              <span className="xs:hidden sm:hidden text-xs">人資</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {currentUser ? (
            <>
              <NotificationCenter />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400">
                    <Menu className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-60 bg-gray-900 text-white border-gray-700 z-50"
                  sideOffset={5}
                >
                  <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="p-1">
                      {navItems.map((item) => (
                        <DropdownMenuItem key={item.path} asChild className="py-2 px-4 focus:bg-gray-800 focus:text-white rounded-md mb-1">
                          <Link to={item.path} className="flex items-center">
                            {location.pathname === item.path && <Menu className="mr-2 h-4 w-4" />}
                            <span className={location.pathname === item.path ? "ml-0 flex items-center" : "ml-8 flex items-center"}>
                              {item.icon} {item.label}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <div className="border-t border-gray-700 my-2"></div>
                      <DropdownMenuItem 
                        className="py-2 px-4 focus:bg-gray-800 focus:text-white rounded-md"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center text-red-400 ml-8">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>登出</span>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Badge className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-xs px-2 py-1">
                登入
              </Badge>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

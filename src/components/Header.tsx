
import React from 'react';
import { Menu, Shield, LogOut, BarChart3, Bell, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    { path: '/', label: '首頁' },
    { path: '/announcements', label: '公司公告', icon: <FileText className="mr-2 h-4 w-4" /> },
    { path: '/leave-request', label: '請假申請' },
    { path: '/personal-attendance', label: '個人考勤' },
    { path: '/scheduling', label: '排班' },
  ];
  
  // 如果是管理員或人資部門，新增管理選項
  if (isAdminOrHR()) {
    navItems.push(
      { path: '/personnel-management', label: '人員與部門管理' },
      { path: '/staff-dashboard', label: '員工考勤儀表板' },
      { path: '/announcement-management', label: '公告管理系統', icon: <FileText className="mr-2 h-4 w-4" /> }
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
    <header className="w-full py-2 px-3 md:py-4 md:px-5 flex justify-between items-center">
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
              <DropdownMenuContent align="end" className="w-60 bg-gray-900 text-white">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild className="py-2 px-4 focus:bg-gray-800 focus:text-white">
                    <Link to={item.path} className="flex items-center">
                      {location.pathname === item.path && <Menu className="mr-2 h-4 w-4" />}
                      <span className={location.pathname === item.path ? "ml-0 flex items-center" : "ml-8 flex items-center"}>
                        {item.icon} {item.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                  className="py-2 px-4 focus:bg-gray-800 focus:text-white border-t border-gray-700"
                  onClick={handleLogout}
                >
                  <div className="flex items-center text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>登出</span>
                  </div>
                </DropdownMenuItem>
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
    </header>
  );
};

export default Header;

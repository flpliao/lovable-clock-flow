
import React from 'react';
import { Menu, Shield, LogOut, BarChart3 } from 'lucide-react';
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
  
  // 判斷是否為管理員或人資部門
  const isAdminOrHR = () => {
    return currentUser && (isAdmin() || currentUser.department === 'HR');
  };
  
  let navItems = [
    { path: '/', label: '首頁' },
    { path: '/leave-request', label: '請假申請' },
    { path: '/personal-attendance', label: '個人考勤' },
    { path: '/scheduling', label: '排班' },
  ];
  
  // 如果是管理員或人資部門，新增管理選項
  if (isAdminOrHR()) {
    navItems.push(
      { path: '/personnel-management', label: '人員與部門管理' },
      { path: '/staff-dashboard', label: '員工考勤儀表板' }
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
    <header className="w-full py-4 px-5 flex justify-between items-center">
      <div className="flex items-center">
        <ApolloLogo />
        {isAdmin() && (
          <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">
            <Shield className="w-3 h-3 mr-1" />
            管理員
          </Badge>
        )}
        {!isAdmin() && currentUser?.department === 'HR' && (
          <Badge className="ml-2 bg-violet-500 hover:bg-violet-600">
            <BarChart3 className="w-3 h-3 mr-1" />
            人資管理
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <NotificationCenter />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-400">
                  <Menu className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 bg-gray-900 text-white">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild className="py-2 px-4 focus:bg-gray-800 focus:text-white">
                    <Link to={item.path} className="flex items-center">
                      {location.pathname === item.path && <Menu className="mr-2 h-4 w-4" />}
                      <span className={location.pathname === item.path ? "ml-2" : "ml-8"}>
                        {item.label}
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
            <Badge className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              登入
            </Badge>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

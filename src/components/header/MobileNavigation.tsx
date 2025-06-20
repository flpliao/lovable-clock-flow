
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/contexts/UserContext';
import { MenuItem } from './menuConfig';

interface MobileNavigationProps {
  isOpen: boolean;
  currentUser: UserType | null;
  isAuthenticated: boolean;
  isLoginPage: boolean;
  visibleMenuItems: MenuItem[];
  onNavigation: (path: string) => void;
  onLogout: () => void;
  onLogin: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  currentUser,
  isAuthenticated,
  isLoginPage,
  visibleMenuItems,
  onNavigation,
  onLogout,
  onLogin
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-white/30 py-4">
      {isAuthenticated && currentUser ? (
        <div className="space-y-3">
          {/* 用戶資訊 */}
          <div className="flex items-center space-x-2 text-white/90 px-2 pb-3 border-b border-white/20">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">
              {currentUser.name}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {currentUser.role === 'admin' ? '管理員' : 
               currentUser.role === 'manager' ? '主管' : '員工'}
            </span>
          </div>
          
          {/* 導航選單 */}
          {visibleMenuItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => onNavigation(item.path)}
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-white/90 hover:text-white hover:bg-white/20 ${
                location.pathname === item.path ? 'bg-white/20' : ''
              }`}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
          
          {/* 登出按鈕 */}
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20 mt-4 pt-3 border-t border-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            登出
          </Button>
        </div>
      ) : (
        !isLoginPage && (
          <Button
            onClick={onLogin}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20"
          >
            <User className="h-4 w-4 mr-2" />
            登入
          </Button>
        )
      )}
    </div>
  );
};

export default MobileNavigation;

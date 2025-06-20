
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/contexts/UserContext';
import { MenuItem } from './menuConfig';
import { Separator } from '@/components/ui/separator';

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
    <div className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl">
      {isAuthenticated && currentUser ? (
        <div className="p-4 space-y-4">
          {/* 用戶資訊卡片 */}
          <div className="bg-white/20 rounded-lg p-4 mb-4 border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="bg-white/30 rounded-full p-2">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm drop-shadow-sm">
                  {currentUser.name}
                </div>
                <div className="text-white/90 text-xs font-medium">
                  {currentUser.role === 'admin' ? '管理員' : 
                   currentUser.role === 'manager' ? '主管' : '員工'}
                </div>
              </div>
            </div>
          </div>
          
          {/* 導航選單 */}
          <div className="space-y-1">
            {visibleMenuItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => onNavigation(item.path)}
                variant="ghost"
                className={`
                  w-full justify-start text-white font-semibold hover:text-white hover:bg-white/20 
                  transition-all duration-200 p-4 rounded-lg text-base
                  ${location.pathname === item.path ? 'bg-white/25 text-white shadow-sm' : 'text-white/95'}
                `}
              >
                <item.icon className="h-5 w-5 mr-3 text-white" />
                <span className="drop-shadow-sm">{item.label}</span>
              </Button>
            ))}
          </div>
          
          <Separator className="bg-white/30 my-4" />
          
          {/* 登出按鈕 */}
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-white font-semibold hover:text-white hover:bg-red-500/30 transition-all duration-200 p-4 rounded-lg text-base border border-white/20"
          >
            <LogOut className="h-5 w-5 mr-3 text-white" />
            <span className="drop-shadow-sm">登出</span>
          </Button>
        </div>
      ) : (
        !isLoginPage && (
          <div className="p-4">
            <Button
              onClick={onLogin}
              variant="ghost"
              className="w-full justify-start text-white font-semibold hover:text-white hover:bg-white/20 transition-all duration-200 p-4 rounded-lg text-base"
            >
              <User className="h-5 w-5 mr-3 text-white" />
              <span className="drop-shadow-sm">登入</span>
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default MobileNavigation;

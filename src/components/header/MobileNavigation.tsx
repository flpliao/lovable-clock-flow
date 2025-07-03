import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User as UserType } from '@/stores/userStore';
import { LogOut, Settings, User } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';
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
  onLogin,
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-white/20 bg-white/95 backdrop-blur-xl max-h-[70vh]">
      <ScrollArea className="h-full">
        {isAuthenticated && currentUser ? (
          <div className="p-4 space-y-4">
            {/* 用戶資訊卡片 */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold text-sm">{currentUser.name}</div>
                    <div className="text-gray-600 text-xs font-medium">
                      {currentUser.role_id === 'admin'
                        ? '管理員'
                        : currentUser.role_id === 'manager'
                          ? '主管'
                          : '員工'}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onNavigation('/account-settings')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 p-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 導航選單 - 可滑動區域 */}
            <div className="space-y-1 max-h-[40vh] overflow-y-auto">
              {visibleMenuItems.map(item => (
                <Button
                  key={item.path}
                  onClick={() => onNavigation(item.path)}
                  variant="ghost"
                  className={`
                    w-full justify-start text-gray-800 hover:text-gray-900 hover:bg-gray-100 
                    transition-all duration-200 p-4 rounded-lg text-base font-semibold
                    ${location.pathname === item.path ? 'bg-gray-200 text-gray-900 shadow-sm' : ''}
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3 text-gray-700" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>

            <Separator className="bg-gray-300 my-4" />

            {/* 登出按鈕 */}
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-red-700 font-semibold hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-4 rounded-lg text-base border border-red-200"
            >
              <LogOut className="h-5 w-5 mr-3 text-red-600" />
              <span>登出</span>
            </Button>
          </div>
        ) : (
          !isLoginPage && (
            <div className="p-4">
              <Button
                onClick={onLogin}
                variant="ghost"
                className="w-full justify-start text-gray-800 font-semibold hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 p-4 rounded-lg text-base"
              >
                <User className="h-5 w-5 mr-3 text-gray-700" />
                <span>登入</span>
              </Button>
            </div>
          )
        )}
      </ScrollArea>
    </div>
  );
};

export default MobileNavigation;

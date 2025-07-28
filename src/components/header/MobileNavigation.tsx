import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { routes } from '@/routes/api';
import { useLogout } from '@/services/authService';
import { MobileNavigationProps } from '@/types/navigation';
import { LogOut, Settings, User, X } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  employee,
  visibleMenuItems,
  onClose,
}) => {
  const location = useLocation();
  const logout = useLogout();

  return (
    <>
      {/* 遮罩層 */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 側邊選單 */}
      <div
        className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 lg:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* 頂部用戶資訊和關閉按鈕 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{employee.name}</div>
                  <div className="text-gray-600 text-xs">{employee.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* 個人設定齒輪圖示按鈕 */}
                <Link to={routes.accountSettings} onClick={onClose}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
                {/* 關閉按鈕 */}
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* 功能選單 - 格子佈局 */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {visibleMenuItems.map(item => (
                  <Link to={item.path} key={item.path} onClick={onClose}>
                    <button
                      key={item.path}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-lg w-full
                        transition-all duration-200 hover:bg-blue-50 hover:shadow-md
                        ${location.pathname === item.path ? 'bg-blue-100 shadow-md' : 'bg-gray-50'}
                      `}
                    >
                      <div
                        className={`
                        p-3 rounded-full mb-2 transition-colors duration-200
                        ${location.pathname === item.path ? 'bg-blue-500 text-white' : 'bg-white text-blue-600'}
                      `}
                      >
                        {item.iconComponent && <item.iconComponent className="h-6 w-6" />}
                      </div>
                      <span
                        className={`
                        text-xs font-medium text-center leading-tight
                        ${location.pathname === item.path ? 'text-blue-700' : 'text-gray-700'}
                      `}
                      >
                        {item.name}
                      </span>
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-300 my-6" />

            {/* 底部功能 */}
            <div className="space-y-3">
              {/* 登出按鈕 */}
              <Button
                onClick={() => {
                  logout();
                  onClose();
                }}
                variant="ghost"
                className="w-full justify-start text-red-700 font-medium hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-4 rounded-lg text-base border border-red-200"
              >
                <LogOut className="h-5 w-5 mr-3 text-red-600" />
                <span>登出</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default MobileNavigation;

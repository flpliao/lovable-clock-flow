import { Button } from '@/components/ui/button';
import { routes } from '@/routes/api';
import { useLogout } from '@/services/authService';
import { EmployeeInfoProps } from '@/types/employee';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ employee }) => {
  const logout = useLogout();

  return (
    <div className="relative group">
      <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{employee?.name}</span>
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </Button>

      {/* 下拉選單 - 滑鼠移過去就展開 */}
      <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[9999]">
        <div className="py-2">
          <Link to={routes.accountSettings}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 px-4 py-3 rounded-none font-medium text-sm transition-colors"
            >
              <Settings className="h-4 w-4 mr-3 text-gray-500" />
              帳號設定
            </Button>
          </Link>
          <div className="border-t border-gray-200/50 my-1"></div>
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-3 rounded-none font-medium text-sm transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            登出
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;

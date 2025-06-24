
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/contexts/UserContext';
import { Separator } from '@/components/ui/separator';

interface UserInfoProps {
  currentUser: UserType | null;
  isAuthenticated: boolean;
  isLoginPage: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  currentUser,
  isAuthenticated,
  isLoginPage,
  onLogout,
  onLogin
}) => {
  if (isAuthenticated && currentUser) {
    return (
      <div className="flex items-center space-x-4">
        {/* 分隔線 */}
        <Separator orientation="vertical" className="h-8 bg-gray-300/50" />
        
        {/* 用戶資訊 */}
        <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/40 shadow-sm">
          <div className="bg-gray-100/80 rounded-full p-2">
            <User className="h-4 w-4 text-gray-700" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 text-sm font-medium">
              {currentUser.name}
            </span>
            <span className="text-gray-600 text-xs">
              {currentUser.role === 'admin' ? '管理員' : 
               currentUser.role === 'manager' ? '主管' : '員工'}
            </span>
          </div>
        </div>
        
        {/* 登出按鈕 */}
        <Button
          onClick={onLogout}
          variant="ghost"
          className="text-gray-700 hover:text-red-700 hover:bg-red-50/80 transition-all duration-200 px-4 py-2 rounded-lg backdrop-blur-sm border border-transparent hover:border-red-200/50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          登出
        </Button>
      </div>
    );
  }

  if (!isLoginPage) {
    return (
      <Button
        onClick={onLogin}
        variant="ghost"
        className="text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 px-6 py-2 rounded-lg font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-sm"
      >
        <User className="h-4 w-4 mr-2" />
        登入
      </Button>
    );
  }

  return null;
};

export default UserInfo;

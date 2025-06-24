
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
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        {/* 用戶資訊 */}
        <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-4 py-2">
          <div className="bg-white/20 rounded-full p-2">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">
              {currentUser.name}
            </span>
            <span className="text-white/70 text-xs">
              {currentUser.role === 'admin' ? '管理員' : 
               currentUser.role === 'manager' ? '主管' : '員工'}
            </span>
          </div>
        </div>
        
        {/* 登出按鈕 */}
        <Button
          onClick={onLogout}
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-200 px-4 py-2 rounded-lg"
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
        className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 px-6 py-2 rounded-lg font-medium"
      >
        <User className="h-4 w-4 mr-2" />
        登入
      </Button>
    );
  }

  return null;
};

export default UserInfo;

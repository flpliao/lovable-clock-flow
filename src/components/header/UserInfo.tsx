
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/contexts/UserContext';

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
      <>
        <div className="flex items-center space-x-2 text-white/90">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium drop-shadow-sm">
            {currentUser.name}
          </span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {currentUser.role === 'admin' ? '管理員' : 
             currentUser.role === 'manager' ? '主管' : '員工'}
          </span>
        </div>
        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          className="text-white/90 hover:text-white hover:bg-white/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          登出
        </Button>
      </>
    );
  }

  if (!isLoginPage) {
    return (
      <Button
        onClick={onLogin}
        variant="ghost"
        size="sm"
        className="text-white/90 hover:text-white hover:bg-white/20"
      >
        <User className="h-4 w-4 mr-2" />
        登入
      </Button>
    );
  }

  return null;
};

export default UserInfo;

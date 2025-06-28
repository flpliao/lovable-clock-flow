
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { createAuthHandlers } from '@/contexts/user/authHandlers';

const UserInfo: React.FC = () => {
  const { currentUser, setCurrentUser, setIsAuthenticated, setUserError } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 創建 auth handlers
  const { handleUserLogout } = createAuthHandlers(
    setCurrentUser,
    setIsAuthenticated,
    setUserError
  );

  const handleLogout = async () => {
    handleUserLogout();
  };

  const handleAccountSettings = () => {
    navigate('/account-settings');
    setIsOpen(false);
  };

  if (!currentUser) {
    return (
      <Button 
        variant="ghost" 
        onClick={() => navigate('/login')}
        className="text-white hover:bg-white/20"
      >
        登入
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{currentUser.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleAccountSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>帳號設定</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import HeaderLogo from './header/HeaderLogo';
import UserInfo from './header/UserInfo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import { useMenuLogic } from './header/useMenuLogic';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, resetUserState, isAuthenticated, hasPermission } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login';
  
  const { visibleMenuItems } = useMenuLogic(currentUser, isAuthenticated, hasPermission);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    resetUserState();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600/50 via-blue-700/50 to-blue-800/50 shadow-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* 桌面版佈局 */}
        <div className="hidden lg:flex lg:justify-between lg:items-center lg:h-16">
          {/* Logo */}
          <HeaderLogo />
          
          {/* Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <DesktopNavigation 
              visibleMenuItems={visibleMenuItems}
              onNavigation={handleNavigation}
            />
          </div>
          
          {/* User Info */}
          <UserInfo
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            isLoginPage={isLoginPage}
            onLogout={handleLogout}
            onLogin={handleLogin}
          />
        </div>

        {/* 手機版佈局 */}
        <div className="lg:hidden">
          {/* 第一行：Logo 和選單按鈕 */}
          <div className="flex justify-between items-center h-14 py-2">
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>
            
            {isAuthenticated && (
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 h-10 w-10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* 第二行：用戶資訊（只在已登入時顯示） */}
          {isAuthenticated && currentUser && (
            <div className="pb-3 px-1">
              <div className="bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="bg-white/20 rounded-full p-1.5 flex-shrink-0">
                      <div className="h-3 w-3 bg-white rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-sm font-medium truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-white/70 text-xs">
                        {currentUser.role === 'admin' ? '管理員' : 
                         currentUser.role === 'manager' ? '主管' : '員工'}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-red-500/20 text-xs px-2 py-1 h-auto ml-2 flex-shrink-0"
                  >
                    登出
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 未登入時的登入按鈕 */}
          {!isAuthenticated && !isLoginPage && (
            <div className="pb-3 px-1">
              <Button
                onClick={handleLogin}
                variant="ghost"
                className="w-full text-white/80 hover:text-white hover:bg-white/10 bg-white/5 rounded-lg py-2"
              >
                登入
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        isLoginPage={isLoginPage}
        visibleMenuItems={visibleMenuItems}
        onNavigation={handleNavigation}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;

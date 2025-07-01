
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
  const { currentUser, isAuthenticated, resetUserState } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login';
  
  const { visibleMenuItems } = useMenuLogic(currentUser, isAuthenticated);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    console.log('🚪 Header: 執行登出');
    setIsMobileMenuOpen(false);
    await resetUserState();
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
          
          {/* User Info and Cache Clear Button */}
          <div className="flex items-center space-x-2">
            <UserInfo />
          </div>
        </div>

        {/* 平板和手機版佈局 */}
        <div className="lg:hidden">
          {/* 單一行：Logo 和選單按鈕 */}
          <div className="flex items-center justify-between h-14 py-2">
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>
            
            <div className="flex items-center space-x-2">
              {/* 選單按鈕 */}
              {isAuthenticated && (
                <Button
                  onClick={toggleMobileMenu}
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 h-10 w-10 flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

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

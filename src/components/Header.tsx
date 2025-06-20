
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import HeaderLogo from './header/HeaderLogo';
import DesktopNavigation from './header/DesktopNavigation';
import UserInfo from './header/UserInfo';
import MobileNavigation from './header/MobileNavigation';
import { useMenuLogic } from './header/useMenuLogic';

const Header = () => {
  const { currentUser, resetUserState, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login';
  const { visibleMenuItems } = useMenuLogic(currentUser, isAuthenticated);

  const handleLogout = () => {
    console.log('🚪 用戶登出');
    resetUserState();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/15 backdrop-blur-2xl border-b border-white/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <HeaderLogo />

          {/* Desktop Navigation - 極簡設計 */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* 導航選單 - 只在登入時顯示 */}
            {isAuthenticated && (
              <DesktopNavigation
                visibleMenuItems={visibleMenuItems}
                onNavigation={handleNavigation}
              />
            )}

            {/* 用戶資訊和登入/登出 */}
            <UserInfo
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              isLoginPage={isLoginPage}
              onLogout={handleLogout}
              onLogin={handleLogin}
            />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-3 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
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
      </div>
    </header>
  );
};

export default Header;

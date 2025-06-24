
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-white/80 via-white/70 to-white/80 border-b border-white/30 shadow-lg shadow-blue-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <HeaderLogo />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <DesktopNavigation 
              visibleMenuItems={visibleMenuItems}
              onNavigation={handleNavigation}
            />
          </div>
          
          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <UserInfo
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              isLoginPage={isLoginPage}
              onLogout={handleLogout}
              onLogin={handleLogin}
            />
            
            {/* Mobile menu button */}
            {isAuthenticated && (
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-200 p-2 rounded-lg backdrop-blur-sm"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
          </div>
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

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
                className="lg:hidden text-white/80 hover:text-white hover:bg-white/10 p-2"
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

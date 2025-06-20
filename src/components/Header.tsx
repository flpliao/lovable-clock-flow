
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { currentUser, resetUserState, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login';

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white drop-shadow-md">
              員工考勤系統
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && currentUser ? (
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
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  登出
                </Button>
              </>
            ) : (
              !isLoginPage && (
                <Button
                  onClick={handleLogin}
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-white hover:bg-white/20"
                >
                  <User className="h-4 w-4 mr-2" />
                  登入
                </Button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/30 py-4">
            {isAuthenticated && currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-white/90 px-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentUser.name}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {currentUser.role === 'admin' ? '管理員' : 
                     currentUser.role === 'manager' ? '主管' : '員工'}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  登出
                </Button>
              </div>
            ) : (
              !isLoginPage && (
                <Button
                  onClick={handleLogin}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20"
                >
                  <User className="h-4 w-4 mr-2" />
                  登入
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

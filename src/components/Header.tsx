
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, Home, Calendar, FileText, Users, Building, Settings, Clock, Briefcase, MessageSquare } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import ApolloLogo from '@/components/ApolloLogo';

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 定義選單項目
  const menuItems = [
    { path: '/', label: '首頁', icon: Home, public: false },
    { path: '/personal-attendance', label: '個人出勤', icon: Clock, public: false },
    { path: '/leave-request', label: '請假申請', icon: FileText, public: false },
    { path: '/scheduling', label: '排班管理', icon: Calendar, public: false },
    { path: '/overtime-management', label: '加班管理', icon: Briefcase, public: false },
    { path: '/company-announcements', label: '公司公告', icon: MessageSquare, public: false },
    { path: '/personnel-management', label: '人員管理', icon: Users, public: false, adminOnly: true },
    { path: '/company-branch-management', label: '分店管理', icon: Building, public: false, adminOnly: true },
    { path: '/system-settings', label: '系統設定', icon: Settings, public: false, adminOnly: true },
    { path: '/hr-management', label: 'HR管理', icon: Users, public: false, adminOnly: true }
  ];

  // 過濾選單項目
  const getVisibleMenuItems = () => {
    if (!isAuthenticated) return [];
    
    return menuItems.filter(item => {
      if (item.adminOnly && !currentUser?.role === 'admin') return false;
      return !item.public;
    });
  };

  const visibleMenuItems = getVisibleMenuItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <ApolloLogo />
            <h1 className="text-xl font-bold text-white drop-shadow-md">
              員工考勤系統
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 導航選單 - 只在登入時顯示 */}
            {isAuthenticated && visibleMenuItems.length > 0 && (
              <nav className="flex items-center space-x-2 mr-4">
                {visibleMenuItems.slice(0, 5).map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    variant="ghost"
                    size="sm"
                    className={`text-white/90 hover:text-white hover:bg-white/20 ${
                      location.pathname === item.path ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-1" />
                    {item.label}
                  </Button>
                ))}
                
                {/* 更多選單下拉 */}
                {visibleMenuItems.length > 5 && (
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/90 hover:text-white hover:bg-white/20"
                    >
                      <Menu className="h-4 w-4 mr-1" />
                      更多
                    </Button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {visibleMenuItems.slice(5).map((item) => (
                        <Button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-gray-800 hover:bg-white/50"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </nav>
            )}

            {/* 用戶資訊和登入/登出 */}
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
                {/* 用戶資訊 */}
                <div className="flex items-center space-x-2 text-white/90 px-2 pb-3 border-b border-white/20">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentUser.name}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {currentUser.role === 'admin' ? '管理員' : 
                     currentUser.role === 'manager' ? '主管' : '員工'}
                  </span>
                </div>
                
                {/* 導航選單 */}
                {visibleMenuItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-white/90 hover:text-white hover:bg-white/20 ${
                      location.pathname === item.path ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
                
                {/* 登出按鈕 */}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/20 mt-4 pt-3 border-t border-white/20"
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

import { Button } from '@/components/ui/button';
import useEmployeeStore from '@/stores/employeeStore';
import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopNavigation from './header/DesktopNavigation';
import EmployeeInfo from './header/EmployeeInfo';
import HeaderLogo from './header/HeaderLogo';
import MobileNavigation from './header/MobileNavigation';
import { useMenuLogic } from './header/useMenuLogic';
import NotificationCenter from './notifications/NotificationCenter';

const Header: React.FC = () => {
  const navigate = useNavigate();

  // 使用 employeeStore
  const { employee, isAuthenticated } = useEmployeeStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 直接以 employee 作為 user 物件
  const { visibleMenuItems } = useMenuLogic(employee, isAuthenticated);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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

          {/* 通知中心和用戶信息 */}
          <div className="flex items-center space-x-4">
            {/* 總是顯示通知中心進行測試 */}
            <div className="relative">
              <NotificationCenter />
            </div>
            <EmployeeInfo employee={employee} />
          </div>
        </div>

        {/* 平板和手機版佈局 */}
        <div className="lg:hidden">
          {/* 單一行：Logo、通知中心和選單按鈕 */}
          <div className="flex items-center justify-between h-14 py-2">
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>

            <div className="flex items-center space-x-3">
              {/* 通知中心 */}
              <div className="relative">{isAuthenticated && <NotificationCenter />}</div>

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
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        employee={employee}
        visibleMenuItems={visibleMenuItems}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;

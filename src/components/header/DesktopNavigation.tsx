
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from './menuConfig';

interface DesktopNavigationProps {
  visibleMenuItems: MenuItem[];
  onNavigation: (path: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  visibleMenuItems,
  onNavigation
}) => {
  const location = useLocation();

  if (visibleMenuItems.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 mr-4">
      {visibleMenuItems.slice(0, 5).map((item) => (
        <Button
          key={item.path}
          onClick={() => onNavigation(item.path)}
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
                onClick={() => onNavigation(item.path)}
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
  );
};

export default DesktopNavigation;

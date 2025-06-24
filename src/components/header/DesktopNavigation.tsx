
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
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
    <nav className="flex items-center space-x-6">
      {/* 主要選單項目 - 顯示前4個 */}
      {visibleMenuItems.slice(0, 4).map((item) => (
        <Button
          key={item.path}
          onClick={() => onNavigation(item.path)}
          variant="ghost"
          className={`
            text-gray-700 hover:text-gray-900 hover:bg-white/60 
            transition-all duration-200 px-4 py-2 rounded-lg
            font-medium text-sm backdrop-blur-sm border border-transparent
            hover:border-white/40 hover:shadow-sm
            ${location.pathname === item.path ? 'bg-white/70 text-gray-900 border-white/50 shadow-sm' : ''}
          `}
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.label}
        </Button>
      ))}
      
      {/* 更多選單下拉 - 當有超過4個項目時 */}
      {visibleMenuItems.length > 4 && (
        <div className="relative group">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-sm"
          >
            更多
            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-hover:rotate-180" />
          </Button>
          
          {/* 下拉選單 */}
          <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-white/40 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[99999]">
            <div className="py-2">
              {visibleMenuItems.slice(4).map((item) => (
                <Button
                  key={item.path}
                  onClick={() => onNavigation(item.path)}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-white/70 hover:text-gray-900 px-4 py-3 rounded-lg mx-2 font-medium text-sm transition-colors"
                >
                  <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DesktopNavigation;

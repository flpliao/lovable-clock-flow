import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/constants';
import { DesktopNavigationProps } from '@/types/navigation';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FIXED_PATHS = [
  ROUTES.HOME,
  ROUTES.PERSONAL_ATTENDANCE,
  ROUTES.LEAVE_REQUEST,
  ROUTES.OVERTIME_REQUEST,
] as string[];
const EXCLUDE_PATHS = [ROUTES.ACCOUNT_SETTINGS] as string[];

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ visibleMenuItems }) => {
  const location = useLocation();

  if (visibleMenuItems.length === 0) return null;

  // 先排除帳號設定
  const filteredMenuItems = visibleMenuItems.filter(item => !EXCLUDE_PATHS.includes(item.path));

  // 依照指定順序取得前4個固定選單
  const fixedItems = FIXED_PATHS.map(path =>
    filteredMenuItems.find(item => item.path === path)
  ).filter(Boolean) as typeof filteredMenuItems;
  // 其他項目
  const moreItems = filteredMenuItems.filter(item => !FIXED_PATHS.includes(item.path));

  return (
    <nav className="flex items-center space-x-6">
      {/* 主要選單項目 - 固定4個 */}
      {fixedItems.map(item => (
        <Link key={item.path} to={item.path}>
          <Button
            variant="ghost"
            className={`
              text-white/80 hover:text-white hover:bg-white/10 
              transition-all duration-200 px-4 py-2 rounded-lg
              font-medium text-sm
              ${location.pathname === item.path ? 'bg-white/15 text-white' : ''}
            `}
          >
            {item.iconComponent && <item.iconComponent className="h-4 w-4 mr-2" />}
            {item.name}
          </Button>
        </Link>
      ))}

      {/* 更多選單下拉 - 當有多餘項目時 */}
      {moreItems.length > 0 && (
        <div className="relative group">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 px-4 py-2 rounded-lg font-medium text-sm"
          >
            更多
            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-hover:rotate-180" />
          </Button>

          {/* 下拉選單 - 增加更高的 z-index */}
          <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[9999]">
            <div className="py-2">
              {moreItems.map(item => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 px-4 py-3 rounded-none font-medium text-sm transition-colors"
                  >
                    {item.iconComponent && (
                      <item.iconComponent className="h-4 w-4 mr-3 text-gray-500" />
                    )}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DesktopNavigation;

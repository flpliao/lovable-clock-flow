
import React, { useState } from 'react';
import { Bell, Menu, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ApolloLogo from './ApolloLogo';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PaginationControl from './PaginationControl';

interface HeaderProps {
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ notificationCount = 29 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // This should be dynamic based on your actual data
  const location = useLocation();
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // You would typically fetch data for the new page here
    console.log(`Navigating to page ${page}`);
  };
  
  const navItems = [
    { path: '/', label: 'Index' },
    { path: '/leave-request', label: 'LeaveRequest' },
    { path: '/personal-attendance', label: 'PersonalAttendance' },
    { path: '/scheduling', label: 'Scheduling' },
  ];
  
  return (
    <header className="w-full py-4 px-5 flex justify-between items-center">
      <div>
        <ApolloLogo />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-400" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[1.5rem] flex items-center justify-center rounded-full">
              {notificationCount}
            </Badge>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-gray-900 text-white">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild className="py-2 px-4 focus:bg-gray-800 focus:text-white">
                <Link to={item.path} className="flex items-center">
                  {location.pathname === item.path && <Check className="mr-2 h-4 w-4" />}
                  <span className={location.pathname === item.path ? "ml-2" : "ml-8"}>
                    {item.label}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {item.path === '/' ? '/' : item.path}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-gray-700" />
            <div className="px-2">
              <PaginationControl 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

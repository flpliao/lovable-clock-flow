
import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ApolloLogo from './ApolloLogo';

interface HeaderProps {
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ notificationCount = 29 }) => {
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
        <button className="text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;

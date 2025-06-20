import React from 'react';
import ApolloLogo from '@/components/ApolloLogo';
const HeaderLogo: React.FC = () => {
  return <div className="flex items-center space-x-4">
      <ApolloLogo />
      <h1 className="text-xl font-bold text-white drop-shadow-md">考勤系統</h1>
    </div>;
};
export default HeaderLogo;

import React, { ReactNode } from 'react';

interface CompanyBranchLayoutProps {
  children: ReactNode;
}

export const CompanyBranchLayout: React.FC<CompanyBranchLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-2 sm:p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

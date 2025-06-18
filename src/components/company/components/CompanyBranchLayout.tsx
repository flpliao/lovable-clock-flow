
import React, { ReactNode } from 'react';

interface CompanyBranchLayoutProps {
  children: ReactNode;
}

export const CompanyBranchLayout: React.FC<CompanyBranchLayoutProps> = ({ children }) => {
  return (
    <div className="relative z-10">
      <main className="p-2 sm:p-4 lg:p-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        {children}
      </main>
    </div>
  );
};

import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface CompanyBranchLayoutProps {
  children: ReactNode;
  isLoading?: boolean;
}

export const CompanyBranchLayout: React.FC<CompanyBranchLayoutProps> = ({
  children,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <main className="p-2 sm:p-4 lg:p-6 pt-12">{children}</main>
    </div>
  );
};

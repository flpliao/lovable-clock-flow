
import React from 'react';
import { Building2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const CompanyBranchHeader: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 sm:mb-6">
      <h1 className={`font-bold flex items-center ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
        <Building2 className={`mr-2 text-blue-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
        <span className={isMobile ? 'text-sm' : ''}>公司基本資料與營業處管理</span>
      </h1>
      {!isMobile && (
        <p className="text-gray-600 text-sm mt-1">管理公司基本資料與營業處資訊</p>
      )}
    </div>
  );
};

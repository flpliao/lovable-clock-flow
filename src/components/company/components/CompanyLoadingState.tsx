
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyInfoHeader } from './CompanyInfoHeader';

export const CompanyLoadingState: React.FC = () => {
  return (
    <Card>
      <CompanyInfoHeader company={null} loading={true} />
      <CardContent>
        <div className="text-center py-8">
          <Loader2 className="h-16 w-16 mx-auto text-blue-500 mb-4 animate-spin" />
          <p className="text-gray-500">正在從資料庫載入公司資料...</p>
          <p className="text-xs text-gray-400 mt-2">檢查前後台資料同步狀態...</p>
        </div>
      </CardContent>
    </Card>
  );
};

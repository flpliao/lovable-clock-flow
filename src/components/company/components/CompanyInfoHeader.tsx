
import React from 'react';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Company } from '@/types/company';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompanyInfoHeaderProps {
  company: Company | null;
  loading: boolean;
}

export const CompanyInfoHeader: React.FC<CompanyInfoHeaderProps> = ({ company, loading }) => {
  const isMobile = useIsMobile();
  
  const getStatusInfo = () => {
    if (loading) {
      return {
        icon: <Building2 className="h-3 w-3 mr-1 animate-pulse" />,
        text: "載入中",
        badge: "bg-blue-100 text-blue-800"
      };
    }

    if (!company) {
      return {
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
        text: "未找到",
        badge: "bg-red-100 text-red-800"
      };
    }

    return {
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      text: "已載入",
      badge: "bg-green-100 text-green-800"
    };
  };

  const status = getStatusInfo();

  return (
    <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-4' : 'pb-2'}`}>
      <CardTitle className={`flex items-center justify-between ${isMobile ? 'flex-col items-start space-y-1' : ''}`}>
        <div className="flex items-center">
          <Building2 className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          <span className={isMobile ? 'text-sm' : 'text-base'}>公司基本資料</span>
        </div>
        <span className={`${isMobile ? 'text-xs self-end' : 'text-xs'} px-2 py-0.5 rounded-full flex items-center ${status.badge}`}>
          {status.icon}
          {status.text}
        </span>
      </CardTitle>
      <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
        {company ? `${company.name}` : '載入公司基本資訊'}
      </CardDescription>
    </CardHeader>
  );
};

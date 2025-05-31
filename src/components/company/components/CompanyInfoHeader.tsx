
import React from 'react';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Company } from '@/types/company';

interface CompanyInfoHeaderProps {
  company: Company | null;
  loading: boolean;
}

export const CompanyInfoHeader: React.FC<CompanyInfoHeaderProps> = ({ company, loading }) => {
  const getStatusInfo = () => {
    if (loading) {
      return {
        icon: <Building2 className="h-4 w-4 mr-2 animate-pulse" />,
        text: "載入中",
        badge: "bg-blue-100 text-blue-800"
      };
    }

    if (!company) {
      return {
        icon: <AlertCircle className="h-4 w-4 mr-2" />,
        text: "未找到資料",
        badge: "bg-red-100 text-red-800"
      };
    }

    return {
      icon: <CheckCircle className="h-4 w-4 mr-2" />,
      text: "已載入",
      badge: "bg-green-100 text-green-800"
    };
  };

  const status = getStatusInfo();

  return (
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          公司基本資料
          <span className={`ml-3 text-xs px-2 py-1 rounded-full flex items-center ${status.badge}`}>
            {status.icon}
            {status.text}
          </span>
        </div>
      </CardTitle>
      <CardDescription>
        {company ? `${company.name} - 統一編號: ${company.registration_number}` : '載入公司基本資訊'}
      </CardDescription>
    </CardHeader>
  );
};


import React from 'react';
import { Building2, CheckCircle, AlertCircle, Database } from 'lucide-react';
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
        icon: <Database className="h-4 w-4 mr-2 animate-pulse" />,
        text: "載入中",
        color: "text-blue-600",
        badge: "bg-blue-100 text-blue-800"
      };
    }

    if (!company) {
      return {
        icon: <AlertCircle className="h-4 w-4 mr-2" />,
        text: "未同步",
        color: "text-red-600", 
        badge: "bg-red-100 text-red-800"
      };
    }

    return {
      icon: <CheckCircle className="h-4 w-4 mr-2" />,
      text: "已同步",
      color: "text-green-600",
      badge: "bg-green-100 text-green-800"
    };
  };

  const status = getStatusInfo();

  return (
    <CardHeader>
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
        <div className="space-y-1">
          <div>管理公司基本資訊與統一編號等法定資料</div>
          {loading && (
            <div className="text-blue-600 font-medium flex items-center">
              <Database className="h-4 w-4 mr-2" />
              正在從後台資料庫載入依美琦股份有限公司資料...
            </div>
          )}
          {!loading && !company && (
            <div className="text-red-600 font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              後台資料庫中沒有找到依美琦股份有限公司的資料
            </div>
          )}
          {!loading && company && (
            <div className="space-y-1">
              <div className="text-green-600 font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                已成功載入 {company.name}
              </div>
              <div className="text-xs text-gray-400">
                公司ID: {company.id} | 統一編號: {company.registration_number}
              </div>
            </div>
          )}
        </div>
      </CardDescription>
    </CardHeader>
  );
};

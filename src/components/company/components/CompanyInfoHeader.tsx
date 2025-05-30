
import React from 'react';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Company } from '@/types/company';
import { CompanyApiService } from '../services/companyApiService';

interface CompanyInfoHeaderProps {
  company: Company | null;
  loading: boolean;
}

export const CompanyInfoHeader: React.FC<CompanyInfoHeaderProps> = ({ company, loading }) => {
  const isDataSynced = CompanyApiService.isDataSynced(company);

  if (loading) {
    return (
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          公司基本資料
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            載入中
          </span>
        </CardTitle>
        <CardDescription>
          <div className="text-blue-600 font-medium flex items-center">
            正在載入依美琦股份有限公司資料...
          </div>
        </CardDescription>
      </CardHeader>
    );
  }

  if (!company) {
    return (
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          公司基本資料
          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            未同步
          </span>
        </CardTitle>
        <CardDescription>
          <div className="text-orange-600 font-medium flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            系統正在準備依美琦股份有限公司資料
          </div>
        </CardDescription>
      </CardHeader>
    );
  }

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          公司基本資料
          {isDataSynced ? (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              已同步
            </span>
          ) : (
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              未同步
            </span>
          )}
        </CardTitle>
        <CardDescription>
          <div>管理公司基本資訊與統一編號等法定資料</div>
          <div className="text-xs text-gray-400 mt-1">
            公司ID: {company.id}
            {isDataSynced ? (
              <span className="text-green-600 ml-2">✓ 與後台同步</span>
            ) : (
              <span className="text-red-600 ml-2">✗ 資料不同步</span>
            )}
          </div>
        </CardDescription>
      </div>
    </CardHeader>
  );
};

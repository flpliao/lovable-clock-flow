
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Company } from '@/types/company';
import { CompanyApiService } from '../services/companyApiService';

interface CompanyInfoContentProps {
  company: Company;
}

export const CompanyInfoContent: React.FC<CompanyInfoContentProps> = ({ company }) => {
  const isDataSynced = CompanyApiService.isDataSynced(company);

  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="font-medium w-20">統一編號:</span>
              <span>{company.registration_number}</span>
              {company.registration_number === '53907735' ? (
                <span className="ml-2 text-xs text-green-600">✓</span>
              ) : (
                <span className="ml-2 text-xs text-red-600">✗</span>
              )}
            </div>
            <div className="flex items-center">
              <span className="font-medium w-20">營業項目:</span>
              <span>{company.business_type}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-20">法定代表:</span>
              <span>{company.legal_representative}</span>
            </div>
            {company.established_date && (
              <div className="flex items-center">
                <span className="font-medium w-20">成立日期:</span>
                <span>{company.established_date}</span>
              </div>
            )}
            {company.capital && (
              <div className="flex items-center">
                <span className="font-medium w-20">資本額:</span>
                <span>{company.capital.toLocaleString()} 元</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{company.address}</span>
            {company.address.includes('台北市中山區建國北路') ? (
              <span className="ml-2 text-xs text-green-600">✓</span>
            ) : (
              <span className="ml-2 text-xs text-red-600">✗</span>
            )}
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{company.email}</span>
          </div>
          {company.website && (
            <div className="flex items-center">
              <span className="font-medium w-12">網站:</span>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500 flex justify-between">
          <span>最後更新: {company.updated_at ? new Date(company.updated_at).toLocaleString('zh-TW') : '未知'}</span>
          {isDataSynced ? (
            <span className="text-green-600">前後台資料已同步</span>
          ) : (
            <span className="text-red-600">前後台資料未同步</span>
          )}
        </div>
      </div>
    </CardContent>
  );
};

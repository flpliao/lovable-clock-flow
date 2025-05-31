
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Company } from '@/types/company';

interface CompanyInfoContentProps {
  company: Company;
}

export const CompanyInfoContent: React.FC<CompanyInfoContentProps> = ({ company }) => {
  return (
    <CardContent className="pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="text-xs">
            <span className="font-medium">營業項目:</span>
            <span className="ml-1">{company.business_type}</span>
          </div>
          <div className="text-xs">
            <span className="font-medium">負責人:</span>
            <span className="ml-1">{company.legal_representative}</span>
          </div>
          {company.capital && (
            <div className="text-xs">
              <span className="font-medium">資本額:</span>
              <span className="ml-1">{company.capital.toLocaleString()} 元</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-start text-xs">
            <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-gray-500" />
            <span>{company.address}</span>
          </div>
          <div className="flex items-center text-xs">
            <Phone className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center text-xs">
            <Mail className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
            <span>{company.email}</span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};


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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">營業項目:</span>
            <span className="ml-2">{company.business_type}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">負責人:</span>
            <span className="ml-2">{company.legal_representative}</span>
          </div>
          {company.capital && (
            <div className="text-sm">
              <span className="font-medium">資本額:</span>
              <span className="ml-2">{company.capital.toLocaleString()} 元</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start text-sm">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
            <span>{company.address}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
            <span>{company.email}</span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

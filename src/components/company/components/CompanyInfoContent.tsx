
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Company } from '@/types/company';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompanyInfoContentProps {
  company: Company;
}

export const CompanyInfoContent: React.FC<CompanyInfoContentProps> = ({ company }) => {
  const isMobile = useIsMobile();
  
  return (
    <CardContent className={`${isMobile ? 'pt-0 px-4 pb-4' : 'pt-0'}`}>
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        <div className="space-y-2">
          <div className={isMobile ? 'text-xs' : 'text-sm'}>
            <span className="font-medium">營業項目:</span>
            <span className="ml-1 break-words">{company.business_type}</span>
          </div>
          <div className={isMobile ? 'text-xs' : 'text-sm'}>
            <span className="font-medium">負責人:</span>
            <span className="ml-1">{company.legal_representative}</span>
          </div>
          {company.capital && (
            <div className={isMobile ? 'text-xs' : 'text-sm'}>
              <span className="font-medium">資本額:</span>
              <span className="ml-1">{company.capital.toLocaleString()} 元</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className={`flex items-start ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <MapPin className={`mr-1 mt-0.5 flex-shrink-0 text-gray-500 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className="break-words">{company.address}</span>
          </div>
          <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <Phone className={`mr-1 flex-shrink-0 text-gray-500 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span>{company.phone}</span>
          </div>
          <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <Mail className={`mr-1 flex-shrink-0 text-gray-500 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className="break-words">{company.email}</span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

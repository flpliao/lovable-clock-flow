
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit, MapPin, Phone, Mail } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';

const CompanyInfoCard = () => {
  const { company, setIsEditCompanyDialogOpen } = useCompanyManagementContext();
  const { isAdmin } = useUser();

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            公司基本資料
          </CardTitle>
          <CardDescription>載入中...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            公司基本資料
          </CardTitle>
          <CardDescription>管理公司基本資訊與統一編號等法定資料</CardDescription>
        </div>
        {isAdmin() && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditCompanyDialogOpen(true)}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            編輯
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="font-medium w-20">統一編號:</span>
                <span>{company.registration_number}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">營業項目:</span>
                <span>{company.business_type}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">法定代表:</span>
                <span>{company.legal_representative}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{company.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{company.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{company.email}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;

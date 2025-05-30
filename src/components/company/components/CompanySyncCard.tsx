
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCcw, 
  Building2,
  Edit,
  Loader2
} from 'lucide-react';
import { Company } from '@/types/company';

interface CompanySyncCardProps {
  company: Company | null;
  loading: boolean;
  onLoadCompany: () => void;
  onSyncCompany: () => void;
  onEditCompany: () => void;
  canEdit: boolean;
}

export const CompanySyncCard: React.FC<CompanySyncCardProps> = ({
  company,
  loading,
  onLoadCompany,
  onSyncCompany,
  onEditCompany,
  canEdit
}) => {
  const renderActions = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>處理中...</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onSyncCompany}
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          同步資料
        </Button>
        
        <Button
          onClick={onLoadCompany}
          variant="outline"
          size="sm"
        >
          重新載入
        </Button>

        {canEdit && company && (
          <Button
            onClick={onEditCompany}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            編輯資料
          </Button>
        )}
      </div>
    );
  };

  const renderCompanyInfo = () => {
    if (!company) {
      return (
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">尚未載入公司資料</h3>
          <p className="text-gray-500 mb-6">
            請點擊「同步資料」來載入依美琦股份有限公司的資料
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-3">{company.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">統一編號</span>
                <div className="text-sm">{company.registration_number}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">法定代表人</span>
                <div className="text-sm">{company.legal_representative}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">營業項目</span>
                <div className="text-sm">{company.business_type}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">聯絡電話</span>
                <div className="text-sm">{company.phone}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">電子郵件</span>
                <div className="text-sm">{company.email}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">公司地址</span>
                <div className="text-sm">{company.address}</div>
              </div>
            </div>
          </div>
        </div>
        
        {(company.website || company.established_date || company.capital) && (
          <div className="pt-3 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {company.website && (
                <div>
                  <span className="text-sm font-medium text-gray-600">網站</span>
                  <div className="text-sm">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              )}
              {company.established_date && (
                <div>
                  <span className="text-sm font-medium text-gray-600">成立日期</span>
                  <div className="text-sm">{company.established_date}</div>
                </div>
              )}
              {company.capital && (
                <div>
                  <span className="text-sm font-medium text-gray-600">資本額</span>
                  <div className="text-sm">{company.capital.toLocaleString()} 元</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500">
            最後更新：{company.updated_at ? new Date(company.updated_at).toLocaleString('zh-TW') : '未知'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          公司基本資料
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {renderCompanyInfo()}
        
        <div className="mt-6 pt-4 border-t">
          {renderActions()}
        </div>
      </CardContent>
    </Card>
  );
};

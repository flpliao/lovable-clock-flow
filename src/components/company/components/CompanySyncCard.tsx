
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCcw, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Building2,
  Plus,
  Edit
} from 'lucide-react';
import { Company } from '@/types/company';

interface CompanySyncCardProps {
  company: Company | null;
  loading: boolean;
  syncStatus: 'unknown' | 'synced' | 'not_synced';
  onLoadCompany: () => void;
  onForceSync: () => void;
  onCreateCompany: () => void;
  onEditCompany: () => void;
  canEdit: boolean;
}

export const CompanySyncCard: React.FC<CompanySyncCardProps> = ({
  company,
  loading,
  syncStatus,
  onLoadCompany,
  onForceSync,
  onCreateCompany,
  onEditCompany,
  canEdit
}) => {
  const getSyncStatusBadge = () => {
    switch (syncStatus) {
      case 'synced':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            已同步
          </Badge>
        );
      case 'not_synced':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            未同步
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Database className="h-3 w-3 mr-1" />
            檢查中
          </Badge>
        );
    }
  };

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
          onClick={onForceSync}
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          強制同步
        </Button>
        
        <Button
          onClick={onLoadCompany}
          variant="outline"
          size="sm"
        >
          <Database className="h-4 w-4 mr-2" />
          重新載入
        </Button>

        {canEdit && (
          <>
            {company ? (
              <Button
                onClick={onEditCompany}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                編輯資料
              </Button>
            ) : (
              <Button
                onClick={onCreateCompany}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                建立資料
              </Button>
            )}
          </>
        )}
      </div>
    );
  };

  const renderCompanyInfo = () => {
    if (!company) {
      return (
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">尚未找到公司資料</h3>
          <p className="text-gray-500 mb-6">
            後台資料庫中沒有找到依美琦股份有限公司的資料
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700">
              <strong>建議操作：</strong><br />
              1. 點擊「強制同步」嘗試從後台載入資料<br />
              2. 如果仍無資料，可以手動建立公司基本資料
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">統一編號：</span>
              <span>{company.registration_number}</span>
            </div>
            <div>
              <span className="font-medium">法定代表人：</span>
              <span>{company.legal_representative}</span>
            </div>
            <div>
              <span className="font-medium">營業項目：</span>
              <span>{company.business_type}</span>
            </div>
            <div>
              <span className="font-medium">聯絡電話：</span>
              <span>{company.phone}</span>
            </div>
          </div>
        </div>
        
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            公司基本資料
          </div>
          {getSyncStatusBadge()}
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

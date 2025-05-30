
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit, MapPin, Phone, Mail, Loader2, RefreshCw, AlertCircle, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useCompanyOperations } from './hooks/useCompanyOperations';
import { CompanyApiService } from './services/companyApiService';

const CompanyInfoCard = () => {
  const { setIsEditCompanyDialogOpen } = useCompanyManagementContext();
  const { company, loading, loadCompany } = useCompanyOperations();
  const { isAdmin, currentUser } = useUser();

  console.log('CompanyInfoCard - 當前用戶:', currentUser?.name);
  console.log('CompanyInfoCard - 公司資料載入狀態:', { company: company?.name, loading });

  // 允許廖俊雄和管理員編輯公司資料
  const canEdit = currentUser?.name === '廖俊雄' || isAdmin();

  // 檢查資料是否同步
  const isDataSynced = CompanyApiService.isDataSynced(company);

  // 強制重新初始化
  const handleForceReinitialize = async () => {
    console.log('🔄 強制重新初始化公司資料...');
    const result = await CompanyApiService.forceReinitialize();
    if (result) {
      await loadCompany();
    }
  };

  // 如果正在載入
  if (loading) {
    return (
      <Card>
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
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              正在載入依美琦股份有限公司資料...
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="h-16 w-16 mx-auto text-blue-500 mb-4 animate-spin" />
            <p className="text-gray-500">正在從資料庫載入公司資料...</p>
            <p className="text-xs text-gray-400 mt-2">檢查前後台資料同步狀態...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 如果沒有公司資料
  if (!company) {
    return (
      <Card>
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
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">前後台資料尚未同步</p>
            <p className="text-xs text-gray-400 mb-4">請重新載入或手動建立公司資料</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={loadCompany}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                重新載入
              </Button>
              <Button 
                onClick={handleForceReinitialize}
                variant="outline"
                size="sm"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                強制初始化
              </Button>
              {canEdit && (
                <Button 
                  onClick={() => setIsEditCompanyDialogOpen(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  手動建立公司資料
                </Button>
              )}
            </div>
          </div>
        </CardContent>
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadCompany}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            重新載入
          </Button>
          {!isDataSynced && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleForceReinitialize}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              修復同步
            </Button>
          )}
          {canEdit && (
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
        </div>
      </CardHeader>
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
    </Card>
  );
};

export default CompanyInfoCard;

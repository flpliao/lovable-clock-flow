import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { Building2, Calendar, Edit, Mail, MapPin, Phone, RefreshCw, Users } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { CompanyApiService } from './services/companyApiService';

const CompanyInfoCard = () => {
  const { setIsEditCompanyDialogOpen, company, loading, loadCompany, forceSyncFromBackend } = useCompanyManagementContext();
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();

  console.log('CompanyInfoCard - 當前用戶:', currentUser?.name);
  console.log('CompanyInfoCard - 公司資料載入狀態:', { company: company?.name, loading });

  const canEdit = isAdmin;

  // 強制重新載入
  const handleForceReload = async () => {
    console.log('🔄 強制重新載入公司資料...');
    const result = await CompanyApiService.forceReload();
    if (result) {
      await loadCompany();
    }
  };

  // 強制從後台同步
  const handleForceSyncFromBackend = async () => {
    console.log('🔄 強制從後台同步公司資料...');
    await forceSyncFromBackend();
  };

  const handleEdit = () => {
    console.log('🖊️ CompanyInfoCard: 開啟編輯公司資料對話框');
    
    if (!canEdit) {
      console.warn('⚠️ 用戶沒有編輯權限');
      return;
    }

    if (!company) {
      console.warn('⚠️ 沒有公司資料可以編輯');
      return;
    }

    if (typeof setIsEditCompanyDialogOpen !== 'function') {
      console.error('❌ setIsEditCompanyDialogOpen 不是一個函數');
      return;
    }
    
    console.log('✅ 正在開啟編輯對話框...');
    setIsEditCompanyDialogOpen(true);
  };

  // 如果正在載入
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="text-center py-8 text-white">載入中...</div>
      </div>
    );
  }

  // 如果沒有公司資料
  if (!company) {
    return (
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-red-400/50">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white drop-shadow-md">公司基本資料</h3>
            <p className="text-white/80 text-sm mt-1">未找到公司資料</p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={loadCompany}
              variant="outline"
              className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重新載入
            </Button>
            <Button
              onClick={handleForceReload}
              variant="outline"
              className="bg-blue-500/25 border-blue-400/40 text-white hover:bg-blue-500/35 rounded-xl"
            >
              強制重載
            </Button>
            <Button
              onClick={handleForceSyncFromBackend}
              variant="outline"
              className="bg-green-500/25 border-green-400/40 text-white hover:bg-green-500/35 rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              後台同步
            </Button>
          </div>
        )}
        
        <div className="text-center py-4 text-white/70">
          請使用上方按鈕載入或同步公司資料
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
      {/* 標題區域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white drop-shadow-md">公司基本資料</h3>
            <p className="text-white/80 text-sm mt-1">依美琦股份有限公司</p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              編輯
            </Button>
          </div>
        )}
      </div>

      {/* 公司資訊內容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-sm text-white/70">公司名稱</div>
              <div className="text-white font-medium">{company.name}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-sm text-white/70">統一編號</div>
              <div className="text-white font-medium">{company.registration_number}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-sm text-white/70">公司地址</div>
              <div className="text-white font-medium">{company.address}</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-sm text-white/70">聯絡電話</div>
              <div className="text-white font-medium">{company.phone}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-sm text-white/70">電子郵件</div>
              <div className="text-white font-medium">{company.email}</div>
            </div>
          </div>
          
          {company.established_date && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-white/70" />
              <div>
                <div className="text-sm text-white/70">成立日期</div>
                <div className="text-white font-medium">
                  {new Date(company.established_date).toLocaleDateString('zh-TW')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;

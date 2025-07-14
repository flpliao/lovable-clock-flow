import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser } from '@/hooks/useStores';
import { useCompanyStore } from '@/stores/companyStore';
import { Building2, Calendar, Edit, Mail, MapPin, Phone, RefreshCw, Users } from 'lucide-react';
import { useState } from 'react';
import EditCompanyDialog from './EditCompanyDialog';
import { CompanyApiService } from './services/companyApiService';

const CompanyInfoCard = () => {
  const { company, loading, loadCompany, forceSyncFromBackend } = useCompanyStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const currentUser = useCurrentUser();
  const isMobile = useIsMobile();

  console.log('CompanyInfoCard - 當前用戶:', currentUser?.name);
  console.log('CompanyInfoCard - 公司資料載入狀態:', { company: company?.name, loading });

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

    if (!company) {
      console.warn('⚠️ 沒有公司資料可以編輯');
      return;
    }

    console.log('✅ 正在開啟編輯對話框...');
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">正在載入公司資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white drop-shadow-md">{company.name}</h3>
            <p className="text-white/80 text-sm mt-1">公司基本資料</p>
          </div>
        </div>
        <Button
          onClick={handleEdit}
          className="bg-green-500/80 hover:bg-green-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
        >
          <Edit className="mr-2 h-4 w-4" />
          編輯
        </Button>
      </div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div className="space-y-3">
          <div className="flex items-center text-white/90">
            <Building2 className="h-4 w-4 mr-3 text-blue-300" />
            <div>
              <div className="text-sm text-white/70">統一編號</div>
              <div className="font-medium">{company.registration_number}</div>
            </div>
          </div>

          <div className="flex items-center text-white/90">
            <Users className="h-4 w-4 mr-3 text-green-300" />
            <div>
              <div className="text-sm text-white/70">負責人</div>
              <div className="font-medium">{company.legal_representative}</div>
            </div>
          </div>

          <div className="flex items-center text-white/90">
            <MapPin className="h-4 w-4 mr-3 text-red-300" />
            <div>
              <div className="text-sm text-white/70">地址</div>
              <div className="font-medium">{company.address}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-white/90">
            <Phone className="h-4 w-4 mr-3 text-yellow-300" />
            <div>
              <div className="text-sm text-white/70">電話</div>
              <div className="font-medium">{company.phone}</div>
            </div>
          </div>

          <div className="flex items-center text-white/90">
            <Mail className="h-4 w-4 mr-3 text-purple-300" />
            <div>
              <div className="text-sm text-white/70">電子信箱</div>
              <div className="font-medium">{company.email}</div>
            </div>
          </div>

          <div className="flex items-center text-white/90">
            <Calendar className="h-4 w-4 mr-3 text-pink-300" />
            <div>
              <div className="text-sm text-white/70">成立日期</div>
              <div className="font-medium">{company.established_date || '未設定'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleForceSyncFromBackend}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            強制同步
          </Button>
          <Button
            onClick={handleForceReload}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
          >
            重新載入
          </Button>
        </div>
      </div>

      {/* 編輯對話框 */}
      <EditCompanyDialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </div>
  );
};

export default CompanyInfoCard;

import CompanyManagement from '@/components/company/CompanyManagement';
import { CompanyBranchHeader } from '@/components/company/components/CompanyBranchHeader';
import { CompanyBranchLayout } from '@/components/company/components/CompanyBranchLayout';
import { useUserLoaded } from '@/hooks/useStores';
import { Loader2 } from 'lucide-react';

const CompanyBranchManagement = () => {
  const isUserLoaded = useUserLoaded();

  // 如果用戶資料還在載入中，顯示載入畫面
  if (!isUserLoaded) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen flex items-center justify-center">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">正在載入用戶資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse"
        style={{ animationDelay: '4s' }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse"
        style={{ animationDelay: '6s' }}
      ></div>

      <CompanyBranchLayout>
        <CompanyBranchHeader />
        <CompanyManagement />
      </CompanyBranchLayout>
    </div>
  );
};

export default CompanyBranchManagement;

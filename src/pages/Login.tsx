import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import CredentialManagement from '@/components/staff/CredentialManagement';
import LoginForm from '@/components/auth/LoginForm';
import ManageAccountPrompt from '@/components/auth/ManageAccountPrompt';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const {
    currentUser,
    isAuthenticated,
    isUserLoaded
  } = useUser();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // 檢查是否已登入，若已登入則重定向到主頁
  useEffect(() => {
    if (isUserLoaded && isAuthenticated && currentUser) {
      console.log('🔐 用戶已登入，重定向到主頁面');
      navigate('/');
    }
  }, [isUserLoaded, isAuthenticated, currentUser, navigate]);
  const handleCredentialUpdateSuccess = () => {
    toast({
      title: "帳號設定已更新",
      description: "請使用新的帳號設定登錄"
    });
  };

  // 在載入用戶狀態期間或已登入時顯示載入畫面
  if (!isUserLoaded || isAuthenticated && currentUser) {
    return <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>{isAuthenticated ? '正在跳轉...' : '載入中...'}</p>
        </div>
      </div>;
  }
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{
      animationDelay: '2s'
    }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{
      animationDelay: '4s'
    }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{
      animationDelay: '6s'
    }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm p-4 sm:p-8 space-y-6 sm:space-y-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
          <div className="text-center">
            
            
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="manage">
              {currentUser ? <div className="mt-4">
                  <CredentialManagement userId={currentUser.id} onSuccess={handleCredentialUpdateSuccess} />
                </div> : <ManageAccountPrompt onSwitchTab={() => setActiveTab('login')} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Login;
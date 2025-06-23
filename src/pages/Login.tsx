
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import LoginForm from '@/components/auth/LoginForm';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { currentUser, isAuthenticated, isUserLoaded } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 檢查已登入用戶並重定向
  useEffect(() => {
    if (isUserLoaded && isAuthenticated && currentUser && !isRedirecting) {
      console.log('🔐 用戶已登入，重定向到主頁面:', currentUser.name);
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  }, [isUserLoaded, isAuthenticated, currentUser, navigate, isRedirecting]);

  // 已登入用戶顯示跳轉中
  if (isRedirecting || (isAuthenticated && currentUser)) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>正在跳轉...</p>
        </div>
      </div>
    );
  }

  // 載入中狀態
  if (!isUserLoaded) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      {/* 表單置中容器 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm p-4 sm:p-8 space-y-6 sm:space-y-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
          {/* Logo 和標題 */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-xl border border-white/30 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              考勤系統
            </h2>
            <p className="text-white/80 mt-2">請登入您的帳號</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;

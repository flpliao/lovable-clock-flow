
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔄 處理認證回調...');
      
      try {
        // 獲取 URL 中的 hash 參數
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('📋 回調參數:', {
          type,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          fullHash: window.location.hash
        });

        // 檢查是否為 Magic Link 登入回調
        if (type === 'magiclink' && accessToken && refreshToken) {
          console.log('🪄 處理 Magic Link 登入回調');
          
          // 使用 access_token 和 refresh_token 設置會話
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Magic Link 設置會話失敗:', error);
            throw error;
          }

          if (data.session) {
            console.log('✅ Magic Link 登入成功');
            console.log('👤 用戶:', data.session.user.email);
            
            toast({
              title: 'Magic Link 登入成功',
              description: '歡迎回來！您已成功登入。',
            });
            
            // 等待一下讓 UserContext 處理認證狀態變化
            setTimeout(() => {
              console.log('🔄 重定向到主頁面');
              navigate('/', { replace: true });
            }, 1000);
          } else {
            throw new Error('無法建立會話');
          }
        } else if (type === 'recovery' && accessToken && refreshToken) {
          console.log('🔐 處理密碼重設回調');
          
          // 使用 access_token 和 refresh_token 設置會話
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ 設置會話失敗:', error);
            throw error;
          }

          if (data.session) {
            console.log('✅ 會話設置成功');
            console.log('👤 用戶:', data.session.user.email);
            
            toast({
              title: '驗證成功',
              description: '請設定您的新密碼',
            });
            
            navigate('/reset-password?verified=true', { replace: true });
          } else {
            throw new Error('無法建立會話');
          }
        } else if (type === 'signup') {
          console.log('📧 處理註冊確認回調');
          
          // 處理註冊確認
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ 獲取會話失敗:', error);
            throw error;
          }
          
          toast({
            title: '註冊確認成功',
            description: '您的帳號已成功啟用',
          });
          
          navigate('/', { replace: true });
        } else {
          console.log('⚠️ 未知的回調類型或缺少必要參數');
          console.log('🔄 嘗試直接檢查會話狀態');
          
          // 嘗試直接檢查當前會話狀態
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (session) {
            console.log('✅ 發現有效會話，直接重定向');
            toast({
              title: '登入成功',
              description: '歡迎回來！',
            });
            
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 500);
          } else {
            throw new Error('無效的認證回調或會話已過期');
          }
        }
      } catch (error) {
        console.error('🔥 認證回調處理失敗:', error);
        
        const errorMessage = error instanceof Error ? error.message : '認證失敗';
        setError(errorMessage);
        
        toast({
          variant: 'destructive',
          title: '認證失敗',
          description: errorMessage,
        });
        
        // 延遲重定向到登入頁面
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (isProcessing) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-lg font-medium">正在驗證您的身份...</p>
          <p className="text-sm text-white/80">請稍候，這可能需要幾秒鐘</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center space-y-4 max-w-md px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">認證失敗</h2>
          <p className="text-white/80">{error}</p>
          <p className="text-sm text-white/60">正在重定向到登入頁面...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;

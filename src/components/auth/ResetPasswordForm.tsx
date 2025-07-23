import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('🔐 檢查用戶驗證狀態');

      try {
        // 檢查 URL hash 中的參數
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        let accessToken = hashParams.get('access_token');
        let refreshToken = hashParams.get('refresh_token');
        let type = hashParams.get('type');

        // 如果 hash 中沒有，檢查查詢參數
        if (!accessToken) {
          accessToken = searchParams.get('access_token');
          refreshToken = searchParams.get('refresh_token');
          type = searchParams.get('type');
        }

        console.log('🔑 驗證參數:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
          source: hashParams.get('access_token') ? 'hash' : 'query',
        });

        // 如果有 recovery 類型的驗證參數，設置會話
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('🔐 發現 recovery 驗證參數，設置會話...');

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('❌ 設置會話失敗:', error);
            throw error;
          }

          if (data.session && data.user) {
            console.log('✅ 會話設置成功，用戶已登入:', data.user.email);
            setHasValidToken(true);

            toast({
              title: '驗證成功',
              description: '請設定您的新密碼。',
            });

            // 清理 URL
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }

        // 檢查當前用戶是否已登入
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('❌ 獲取用戶資訊失敗:', error);
          throw error;
        }

        if (user) {
          console.log('✅ 用戶已通過驗證並登入:', user.email);
          setHasValidToken(true);

          toast({
            title: '驗證成功',
            description: '請設定您的新密碼。',
          });
        } else {
          console.log('❌ 用戶未登入或驗證失敗');
          toast({
            variant: 'destructive',
            title: '驗證失敗',
            description: '重設密碼連結無效或已過期，請重新申請。',
          });
          setTimeout(() => navigate('/forgot-password'), 2000);
          setHasValidToken(false);
        }
      } catch (error) {
        console.error('🔥 檢查驗證狀態錯誤:', error);
        toast({
          variant: 'destructive',
          title: '驗證失敗',
          description: '驗證過程發生錯誤，請重新申請重設密碼。',
        });
        setTimeout(() => navigate('/forgot-password'), 2000);
        setHasValidToken(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    checkAuthStatus();
  }, [navigate, toast, searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基本驗證
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: '密碼不匹配',
        description: '請確認密碼輸入一致',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: '密碼太短',
        description: '密碼長度至少需要6個字符',
      });
      return;
    }

    setIsLoading(true);

    console.log('🔐 開始更新密碼');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('❌ 密碼更新失敗:', error);

        let errorMessage = '密碼更新失敗，請稍後再試';

        if (error.message.includes('New password should be different')) {
          errorMessage = '新密碼不能與舊密碼相同';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = '密碼長度至少需要6個字符';
        } else if (error.message.includes('session_not_found')) {
          errorMessage = '會話已過期，請重新申請重設密碼';
        }

        toast({
          variant: 'destructive',
          title: '更新失敗',
          description: errorMessage,
        });

        // 如果是會話過期，重定向到忘記密碼頁面
        if (error.message.includes('session_not_found')) {
          setTimeout(() => navigate('/forgot-password'), 2000);
        }
        return;
      }

      console.log('✅ 密碼更新成功');

      toast({
        title: '密碼更新成功',
        description: '您的密碼已成功更新，正在跳轉到登入頁面。',
      });

      // 登出用戶，讓他們使用新密碼登入
      await supabase.auth.signOut();

      setTimeout(() => {
        console.log('🔄 跳轉到登入頁面');
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('🔥 密碼重設錯誤:', error);
      toast({
        variant: 'destructive',
        title: '更新失敗',
        description: '發生錯誤，請稍後再試',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 驗證中狀態
  if (isValidatingToken) {
    return (
      <div className="text-center space-y-4">
        <div className="text-white/90 space-y-2">
          <p className="text-lg font-medium">正在驗證重設連結...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  // Token 無效狀態
  if (!hasValidToken) {
    return (
      <div className="text-center space-y-4">
        <div className="text-white/90 space-y-2">
          <p className="text-lg font-medium text-red-300">連結無效或已過期</p>
          <p className="text-sm">正在重定向到忘記密碼頁面...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          新密碼
        </label>
        <Input
          id="password"
          type="password"
          placeholder="請輸入新密碼 (至少6個字符)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
          確認新密碼
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="請再次輸入新密碼"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600/80 hover:bg-green-700/80 text-white"
        disabled={isLoading}
      >
        {isLoading ? '更新中...' : '更新密碼'}
      </Button>

      <div className="text-center text-sm text-white/80 space-y-2">
        <p className="text-xs text-white/60">更新成功後將自動登出，請使用新密碼重新登入</p>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

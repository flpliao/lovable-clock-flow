
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 檢查是否有有效的重設密碼 token
    const checkToken = async () => {
      const token = searchParams.get('token') || searchParams.get('access_token');
      const type = searchParams.get('type');
      
      if (token && type === 'recovery') {
        console.log('🔐 檢測到密碼重設 token');
        setHasValidToken(true);
        
        // 使用 token 驗證會話
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery'
        });
        
        if (error) {
          console.error('❌ Token 驗證失敗:', error);
          toast({
            variant: 'destructive',
            title: '連結無效',
            description: '重設密碼連結無效或已過期，請重新申請。',
          });
          setTimeout(() => navigate('/forgot-password'), 2000);
        }
      } else {
        console.log('❌ 無有效的重設密碼 token');
        toast({
          variant: 'destructive',
          title: '無效的重設連結',
          description: '請從電子郵件中的連結進入此頁面。',
        });
        setTimeout(() => navigate('/forgot-password'), 2000);
      }
    };

    checkToken();
  }, [searchParams, navigate, toast]);

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
    
    console.log('🔐 開始 Supabase Auth 密碼更新');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Supabase Auth 密碼更新失敗:', error);
        
        let errorMessage = '密碼更新失敗，請稍後再試';
        
        if (error.message.includes('New password should be different')) {
          errorMessage = '新密碼不能與舊密碼相同';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = '密碼長度至少需要6個字符';
        }
        
        toast({
          variant: 'destructive',
          title: '更新失敗',
          description: errorMessage,
        });
        return;
      }

      console.log('✅ Supabase Auth 密碼更新成功');
      
      toast({
        title: '密碼更新成功',
        description: '您的密碼已成功更新，正在跳轉到登入頁面。',
      });
      
      // 稍微延遲跳轉到登入頁面
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

  if (!hasValidToken) {
    return (
      <div className="text-center space-y-4">
        <div className="text-white/90 space-y-2">
          <p className="text-lg font-medium">正在驗證重設連結...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
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
          onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setConfirmPassword(e.target.value)}
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
      
      <div className="text-center text-sm text-white/80">
        使用 Supabase Auth 系統進行安全的密碼更新
      </div>
    </form>
  );
};

export default ResetPasswordForm;

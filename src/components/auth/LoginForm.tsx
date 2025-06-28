
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: '請填寫完整資訊',
        description: '請輸入電子郵件和密碼',
      });
      return;
    }
    
    setIsLoading(true);
    console.log('🔐 開始登入流程:', email);
    
    try {
      // 使用 Supabase Auth Service
      const authResult = await AuthService.authenticate(email, password);
      
      if (authResult.success && authResult.user && authResult.session) {
        console.log('✅ 登入成功:', authResult.user.name);
        
        toast({
          title: '登入成功',
          description: `歡迎回來，${authResult.user.name}！`,
        });
        
        // 立即重定向，不等待狀態更新
        console.log('🔄 立即跳轉到主頁面');
        navigate('/', { replace: true });
        
      } else {
        console.log('❌ 登入失敗:', authResult.error);
        
        // 根據錯誤類型顯示不同訊息
        let errorMessage = '登入失敗';
        if (authResult.error?.includes('Invalid login credentials')) {
          errorMessage = '帳號或密碼不正確';
        } else if (authResult.error?.includes('Email not confirmed')) {
          errorMessage = '請先確認您的電子郵件';
        } else if (authResult.error) {
          errorMessage = authResult.error;
        }
        
        toast({
          variant: 'destructive',
          title: '登入失敗',
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error('🔥 登入系統錯誤:', error);
      toast({
        variant: 'destructive',
        title: '登入失敗',
        description: '系統發生錯誤，請稍後再試',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          電子郵件
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60 disabled:opacity-50"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          密碼
        </label>
        <Input
          id="password"
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60 disabled:opacity-50"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-blue-600/80 hover:bg-blue-700/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>登入中...</span>
          </div>
        ) : (
          '登入'
        )}
      </Button>
      
      <div className="text-center text-sm text-white/80">
        使用 Supabase Auth 系統進行安全認證
      </div>
    </form>
  );
};

export default LoginForm;

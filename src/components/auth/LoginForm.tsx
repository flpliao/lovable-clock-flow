
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
    setIsLoading(true);
    
    console.log('🔐 開始 Supabase Auth 登入流程');
    
    try {
      // 使用新的 Supabase Auth Service
      const authResult = await AuthService.authenticate(email, password);
      
      if (authResult.success && authResult.user && authResult.session) {
        console.log('✅ Supabase Auth 登入成功');
        console.log('🎫 獲得 JWT Token:', authResult.session.access_token.substring(0, 20) + '...');
        console.log('👤 用戶資料:', authResult.user);
        
        // 將 JWT token 和會話資訊存儲到 localStorage（可選）
        localStorage.setItem('supabase_session', JSON.stringify(authResult.session));
        
        // 登入成功提醒
        toast({
          title: '登入成功',
          description: `歡迎回來，${authResult.user.name}！已獲取認證令牌。`,
        });
        
        // 稍微延遲跳轉，讓 UserContext 處理認證狀態
        setTimeout(() => {
          console.log('🔄 跳轉到主頁面');
          navigate('/');
        }, 1000);
      } else {
        console.log('❌ Supabase Auth 登入失敗:', authResult.error);
        toast({
          variant: 'destructive',
          title: '登錄失敗',
          description: authResult.error || '帳號或密碼不正確',
        });
      }
    } catch (error) {
      console.error('🔥 登入錯誤:', error);
      toast({
        variant: 'destructive',
        title: '登錄失敗',
        description: '發生錯誤，請稍後再試',
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
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
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
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-blue-600/80 hover:bg-blue-700/80 text-white"
        disabled={isLoading}
      >
        {isLoading ? '登入中...' : '登入'}
      </Button>
      
      <div className="text-center text-sm text-white/80">
        使用 Supabase Auth 系統進行安全認證
      </div>
    </form>
  );
};

export default LoginForm;

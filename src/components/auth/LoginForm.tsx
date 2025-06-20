
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { AuthService } from '@/services/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('🔐 登入嘗試，電子郵件:', email);
    
    try {
      // 使用新的 AuthService 進行驗證
      const authResult = await AuthService.authenticate(email, password);
      
      if (authResult.success && authResult.user) {
        console.log('✅ 登入成功，用戶資料:', authResult.user);
        
        // 構建用戶資料用於 UserContext
        const userData = {
          id: authResult.user.id,
          name: authResult.user.name,
          position: authResult.user.position,
          department: authResult.user.department,
          onboard_date: '2023-01-15', // 預設值
          role: authResult.user.role,
        };
        
        setCurrentUser(userData);
        
        // 登入成功提醒
        toast({
          title: '登入成功',
          description: `歡迎回來，${authResult.user.name}！`,
        });
        
        // 稍微延遲跳轉，讓用戶看到成功提醒
        setTimeout(() => {
          console.log('🔄 跳轉到主頁面');
          navigate('/');
        }, 1000);
      } else {
        console.log('❌ 登入失敗:', authResult.error);
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
    </form>
  );
};

export default LoginForm;

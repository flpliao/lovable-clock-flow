
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
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
    
    console.log('🔐 開始 Supabase Auth 註冊流程');
    
    try {
      // 使用 Supabase Auth 註冊
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name || email.split('@')[0], // 如果沒有輸入姓名，使用 email 前綴
          }
        }
      });

      if (error) {
        console.error('❌ Supabase Auth 註冊失敗:', error);
        
        let errorMessage = '註冊失敗，請稍後再試';
        
        if (error.message.includes('User already registered')) {
          errorMessage = '此電子郵件已經註冊過，請直接登入';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = '請輸入有效的電子郵件地址';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = '密碼長度至少需要6個字符';
        }
        
        toast({
          variant: 'destructive',
          title: '註冊失敗',
          description: errorMessage,
        });
        return;
      }

      if (data.user && data.session) {
        console.log('✅ Supabase Auth 註冊成功');
        console.log('🎫 獲得 JWT Token:', data.session.access_token.substring(0, 20) + '...');
        console.log('👤 用戶資料:', data.user);
        
        toast({
          title: '註冊成功',
          description: '歡迎加入！您的帳號已建立完成。',
        });
        
        // 稍微延遲跳轉到主頁面
        setTimeout(() => {
          console.log('🔄 跳轉到主頁面');
          navigate('/');
        }, 1000);
      } else if (data.user && !data.session) {
        // 用戶註冊成功但需要確認電子郵件
        console.log('📧 註冊成功，等待電子郵件確認');
        
        toast({
          title: '註冊成功',
          description: '請檢查您的電子郵件並點擊確認連結來啟用帳號。',
        });
        
        // 跳轉到登入頁面
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('🔥 註冊錯誤:', error);
      toast({
        variant: 'destructive',
        title: '註冊失敗',
        description: '發生錯誤，請稍後再試',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          姓名 (選填)
        </label>
        <Input
          id="name"
          type="text"
          placeholder="請輸入您的姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
      </div>

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
          placeholder="請輸入密碼 (至少6個字符)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
          確認密碼
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="請再次輸入密碼"
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
        {isLoading ? '註冊中...' : '註冊'}
      </Button>

      <div className="text-center">
        <Link 
          to="/login" 
          className="text-sm text-white/80 hover:text-white underline"
        >
          已有帳號？立即登入
        </Link>
      </div>
      
      <div className="text-center text-sm text-white/80">
        使用 Supabase Auth 系統進行安全註冊
      </div>
    </form>
  );
};

export default RegisterForm;

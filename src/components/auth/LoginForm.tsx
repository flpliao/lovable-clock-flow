import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/routes';
import { AutoLogin, login, me } from '@/services/authService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !companySlug) {
      toast({
        variant: 'destructive',
        title: '請填寫完整資訊',
        description: '請輸入公司代號、電子郵件和密碼',
      });
      return;
    }

    try {
      setIsLoading(true);
      const accessToken = await login(email, password, companySlug).catch(() => null);
      const employese = await me(accessToken).catch(() => null);
      if (employese) {
        navigate(ROUTES.HOME);
        return;
      } else {
        toast({
          variant: 'destructive',
          title: '登入失敗',
          description: '帳號或密碼錯誤',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '登入失敗',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AutoLogin />
      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="companySlug" className="block text-sm font-medium text-white">
            公司代號
          </label>
          <Input
            id="companySlug"
            type="text"
            placeholder="請輸入公司代號"
            value={companySlug}
            onChange={e => setCompanySlug(e.target.value)}
            required
            disabled={isLoading}
            className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60 disabled:opacity-50"
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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
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
      </form>
    </>
  );
};

export default LoginForm;

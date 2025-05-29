
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserIdValidationService } from '@/services/userIdValidationService';

interface LoginFormProps {
  findUserByEmail: (email: string) => { userId: string, credentials: { userId: string, email: string, password: string } } | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ findUserByEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Login attempt with email:', email);
    
    try {
      // Find user by email in our credentials store
      const userFound = findUserByEmail(email);
      console.log('User search result:', userFound);
      
      if (userFound && userFound.credentials.password === password) {
        // 使用統一的用戶ID驗證服務
        const validatedUserId = UserIdValidationService.validateUserId(userFound.userId);
        
        // Create user data based on the found credentials
        const emailLocalPart = userFound.credentials.email.split('@')[0];
        let displayName, position, department, role;
        
        if (emailLocalPart === 'admin') {
          displayName = '廖俊雄';
          position = '資深工程師';
          department = '技術部';
          role = 'admin' as const;
        } else if (emailLocalPart === 'flpliao') {
          displayName = '王小明';
          position = '一般員工';
          department = 'HR';
          role = 'user' as const;
        } else {
          displayName = `User ${validatedUserId}`;
          position = '一般員工';
          department = 'HR';
          role = 'user' as const;
        }
        
        const mockUserData = {
          id: validatedUserId, // 使用驗證過的 UUID
          name: displayName,
          position: position,
          department: department,
          onboard_date: '2023-01-15',
          role: role,
        };
        
        console.log('Setting current user with validated UUID:', mockUserData);
        setCurrentUser(mockUserData);
        
        toast({
          title: '登錄成功',
          description: `歡迎回來，${mockUserData.name}`,
        });
        
        navigate('/');
      } else {
        console.log('Login failed - invalid credentials');
        toast({
          variant: 'destructive',
          title: '登錄失敗',
          description: '電子郵件或密碼不正確',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          電子郵件
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          密碼
        </label>
        <Input
          id="password"
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p><strong>測試帳號：</strong></p>
        <p>管理員：admin@example.com / password</p>
        <p>一般用戶：flpliao@gmail.com / password</p>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? '登入中...' : '登入'}
      </Button>
    </form>
  );
};

export default LoginForm;

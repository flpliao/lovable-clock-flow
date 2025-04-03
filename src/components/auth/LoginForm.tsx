
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

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
    
    try {
      // Find user by email in our credentials store
      const userFound = findUserByEmail(email);
      
      if (userFound && userFound.credentials.password === password) {
        // Mock user data based on the found credentials
        const mockUserData = {
          id: userFound.userId,
          name: userFound.userId === '1' ? '廖俊雄' : `User ${userFound.userId}`,
          position: userFound.userId === '1' ? '資深工程師' : '一般員工',
          department: userFound.userId === '1' ? '技術部' : 'HR',
          onboard_date: '2023-01-15',
          // Explicitly type the role as 'admin' | 'user' instead of string
          role: userFound.userId === '1' ? 'admin' as const : 'user' as const,
        };
        
        setCurrentUser(mockUserData);
        
        toast({
          title: '登錄成功',
          description: `歡迎回來，${mockUserData.name}`,
        });
        
        navigate('/');
      } else {
        toast({
          variant: 'destructive',
          title: '登錄失敗',
          description: '電子郵件或密碼不正確',
        });
      }
    } catch (error) {
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
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

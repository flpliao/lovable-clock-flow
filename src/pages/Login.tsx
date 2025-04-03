
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, KeyRound } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import CredentialManagement from '@/components/staff/CredentialManagement';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, setCurrentUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 模擬登錄請求
      setTimeout(() => {
        // 簡單的驗證 - 實際應用中應使用更安全的方法
        if (email === 'admin@example.com' && password === 'password') {
          setCurrentUser({
            id: '1',
            name: '廖俊雄',
            position: '資深工程師',
            department: '技術部',
            onboard_date: '2023-01-15',
            role: 'admin',
          });
          
          toast({
            title: '登錄成功',
            description: '歡迎回來，廖俊雄',
          });
          
          navigate('/');
        } else {
          toast({
            variant: 'destructive',
            title: '登錄失敗',
            description: '電子郵件或密碼不正確',
          });
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '登錄失敗',
        description: '發生錯誤，請稍後再試',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">帳號管理</h1>
          <p className="mt-2 text-gray-600">
            登入或管理您的帳號設定
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              登入
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center" disabled={!currentUser}>
              <KeyRound className="mr-2 h-4 w-4" />
              帳號設定
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
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
          </TabsContent>
          
          <TabsContent value="manage">
            {currentUser ? (
              <div className="mt-4">
                <CredentialManagement />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">請先登入以管理您的帳號設定</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('login')}
                >
                  返回登入頁面
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;

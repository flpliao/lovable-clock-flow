
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

// Define a type for the global userCredentialsStore
declare global {
  interface Window {
    userCredentialsStore: {
      [key: string]: {
        userId: string;
        email: string;
        password: string;
      }
    }
  }
}

// Initialize the credentials store if it doesn't exist
if (!window.userCredentialsStore) {
  window.userCredentialsStore = {
    '1': { userId: '1', email: 'admin@example.com', password: 'password' }
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, setCurrentUser } = useUser();

  // Function to find a user by email
  const findUserByEmail = (email: string) => {
    // Convert to lowercase for case-insensitive comparison
    const lowerEmail = email.toLowerCase();
    
    // Search through the credentials store
    for (const userId in window.userCredentialsStore) {
      const creds = window.userCredentialsStore[userId];
      if (creds.email.toLowerCase() === lowerEmail) {
        return { userId, credentials: creds };
      }
    }
    
    return null;
  };

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
          role: userFound.userId === '1' ? 'admin' : 'user',
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
                <CredentialManagement 
                  userId={currentUser.id} 
                  onSuccess={() => {
                    toast({
                      title: "帳號設定已更新",
                      description: "請使用新的帳號設定登錄",
                    });
                  }}
                />
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

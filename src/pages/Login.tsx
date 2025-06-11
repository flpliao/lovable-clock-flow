
import React, { useState, useEffect } from 'react';
import { User, KeyRound } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import CredentialManagement from '@/components/staff/CredentialManagement';
import LoginForm from '@/components/auth/LoginForm';
import ManageAccountPrompt from '@/components/auth/ManageAccountPrompt';
import { initCredentialStore, findUserByEmail } from '@/utils/credentialStore';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { currentUser } = useUser();
  const { toast } = useToast();

  // Initialize the credential store
  useEffect(() => {
    console.log('Login page initializing credential store');
    initCredentialStore();
  }, []);

  const handleCredentialUpdateSuccess = () => {
    toast({
      title: "帳號設定已更新",
      description: "請使用新的帳號設定登錄",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 pt-16 md:pt-20">
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
            <LoginForm findUserByEmail={findUserByEmail} />
          </TabsContent>
          
          <TabsContent value="manage">
            {currentUser ? (
              <div className="mt-4">
                <CredentialManagement 
                  userId={currentUser.id} 
                  onSuccess={handleCredentialUpdateSuccess}
                />
              </div>
            ) : (
              <ManageAccountPrompt onSwitchTab={() => setActiveTab('login')} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;

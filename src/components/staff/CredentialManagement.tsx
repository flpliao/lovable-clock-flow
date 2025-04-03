
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Key, ShieldAlert } from 'lucide-react';

interface CredentialManagementProps {
  userId?: string; // Optional - if provided, admin is managing another user's credentials
  onSuccess?: () => void;
}

const CredentialManagement: React.FC<CredentialManagementProps> = ({ 
  userId,
  onSuccess 
}) => {
  const { toast } = useToast();
  const { currentUser, isAdmin, canManageUser } = useUser();
  
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if this is admin managing someone else or user managing own account
  const managingOwnAccount = !userId || userId === currentUser?.id;
  const targetUserId = userId || currentUser?.id;
  
  // Validate permissions
  const hasPermission = targetUserId && (
    managingOwnAccount || (isAdmin() && canManageUser(targetUserId))
  );
  
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission) {
      toast({
        title: "權限不足",
        description: "您沒有權限更改此帳號",
        variant: "destructive"
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "請輸入電子郵件",
        description: "電子郵件不能為空",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "電子郵件格式錯誤",
        description: "請輸入有效的電子郵件地址",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "電子郵件已更新",
        description: "帳號電子郵件地址已成功更新",
      });
      setEmail('');
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission) {
      toast({
        title: "權限不足",
        description: "您沒有權限更改此帳號密碼",
        variant: "destructive"
      });
      return;
    }
    
    // For own account, require current password
    if (managingOwnAccount && !currentPassword) {
      toast({
        title: "請輸入當前密碼",
        description: "更改密碼需要先驗證當前密碼",
        variant: "destructive"
      });
      return;
    }
    
    if (!newPassword) {
      toast({
        title: "請輸入新密碼",
        description: "新密碼不能為空",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "密碼太短",
        description: "新密碼至少需要8個字符",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "密碼不匹配",
        description: "新密碼與確認密碼不一致",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate password verification and update
    setTimeout(() => {
      // For demonstration, we'll assume the current password is 'password'
      if (managingOwnAccount && currentPassword !== 'password') {
        toast({
          title: "當前密碼錯誤",
          description: "請輸入正確的當前密碼",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: "密碼已更新",
        description: "帳號密碼已成功更新",
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  if (!targetUserId) {
    return <div className="text-center p-4">無法管理帳號：用戶未登入</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-gray-500" />
            <CardTitle>更改電子郵件</CardTitle>
          </div>
          <CardDescription>
            更新此帳號的登錄電子郵件地址
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailChange}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">新電子郵件地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="new-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? '處理中...' : '更新電子郵件'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-gray-500" />
            <CardTitle>更改密碼</CardTitle>
          </div>
          <CardDescription>
            更新此帳號的登錄密碼
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent>
            <div className="space-y-4">
              {managingOwnAccount && (
                <div className="space-y-2">
                  <Label htmlFor="current-password">當前密碼</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">新密碼</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">確認新密碼</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              {!managingOwnAccount && (
                <div className="flex items-center mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                  <ShieldAlert className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    注意：您正在以管理員身份更改其他用戶的密碼。該用戶不會收到密碼變更通知。
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? '處理中...' : '更新密碼'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CredentialManagement;

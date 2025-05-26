
import React, { useState } from 'react';
import { Key, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PasswordManagementCardProps {
  managingOwnAccount: boolean;
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>;
}

const PasswordManagementCard: React.FC<PasswordManagementCardProps> = ({
  managingOwnAccount,
  onPasswordChange
}) => {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast({
        title: "請輸入新密碼",
        description: "新密碼不能為空",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "密碼太短",
        description: "新密碼至少需要6個字符",
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
    
    try {
      // No current password required - pass empty string
      await onPasswordChange('', newPassword);
      
      // Reset form
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error handling is done in the hook
      console.error('Password update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <div className="space-y-2">
              <Label htmlFor="new-password">新密碼</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="請輸入新密碼（至少6個字符）"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">確認新密碼</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="請再次輸入新密碼"
              />
            </div>
            
            {!managingOwnAccount && (
              <div className="flex items-center mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
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
  );
};

export default PasswordManagementCard;

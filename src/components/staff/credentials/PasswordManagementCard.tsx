import React, { useState } from 'react';
import { Key, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PasswordValidationService } from '@/services/passwordValidationService';
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
  onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<void>;
}

const PasswordManagementCard: React.FC<PasswordManagementCardProps> = ({
  managingOwnAccount,
  onPasswordChange
}) => {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
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
      // 使用自定義的 onPasswordChange 或預設的 Supabase 更新方法
      if (onPasswordChange) {
        await onPasswordChange('', newPassword); // 不再傳 currentPassword
      } else {
        // 使用 Supabase Auth API 更新密碼
        const result = await PasswordValidationService.updatePassword(newPassword);
        if (!result.success) {
          throw new Error(result.error || '密碼更新失敗');
        }
      }

      // 重設表單
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast({
        title: "密碼更新成功",
        description: "您的密碼已成功更新",
      });

    } catch (error) {
      console.error('Password update failed:', error);
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "密碼更新失敗",
        variant: "destructive"
      });
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
          請輸入新密碼並確認
        </CardDescription>
      </CardHeader>
      <form onSubmit={handlePasswordChange}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">新密碼</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="請輸入新密碼（至少6個字符）"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isSubmitting}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">確認新密碼</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="請再次輸入新密碼"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <ShieldAlert className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                密碼更新後，您可能需要重新登入。請確保記住新密碼。
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting || !newPassword.trim() || !confirmPassword.trim()}
            className="w-full md:w-auto"
          >
            {isSubmitting ? '更新中...' : '更新密碼'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordManagementCard;

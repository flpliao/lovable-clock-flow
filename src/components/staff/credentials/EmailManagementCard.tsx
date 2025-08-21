import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { EmployeeService } from '@/services/employeeService';
import { Edit2, Mail, Save, X } from 'lucide-react';
import React, { useState } from 'react';

interface EmailManagementCardProps {
  currentEmail: string;
  onEmailChange?: (newEmail: string) => void;
}

const EmailManagementCard: React.FC<EmailManagementCardProps> = ({
  currentEmail,
  onEmailChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await EmployeeService.updateEmployeeEmail(currentEmail, newEmail);
      setIsEditing(false);

      // 通知外部更新電子郵件
      if (onEmailChange) {
        onEmailChange(newEmail);
      }

      toast({
        title: '電子郵件更新成功',
        description: '您的電子郵件地址已成功更新',
      });
    } catch (error) {
      setNewEmail(currentEmail); // 重置為原始值
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '無法更新電子郵件',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewEmail(currentEmail);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-gray-500" />
            <CardTitle>電子郵件地址</CardTitle>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-1" />
              修改
            </Button>
          )}
        </div>
        <CardDescription>此帳號的登錄電子郵件地址</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">電子郵件地址</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="current-email"
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="請輸入新的電子郵件地址"
                />
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="current-email"
                type="email"
                value={currentEmail || '未設定'}
                disabled
                className="bg-gray-50"
              />
            )}
          </div>

          {isEditing && (
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-1">注意事項:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>修改電子郵件後需要驗證新的電子郵件地址</li>
                <li>驗證完成前仍可使用舊的電子郵件登錄</li>
                <li>請確保您能夠收到新電子郵件地址的驗證信</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailManagementCard;

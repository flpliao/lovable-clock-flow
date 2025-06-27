import React from 'react';
import { Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailManagementCardProps {
  currentEmail: string;
}

const EmailManagementCard: React.FC<EmailManagementCardProps> = ({ 
  currentEmail
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Mail className="mr-2 h-5 w-5 text-gray-500" />
          <CardTitle>電子郵件地址</CardTitle>
        </div>
        <CardDescription>
          此帳號的登錄電子郵件地址
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="current-email">電子郵件地址</Label>
          <Input
            id="current-email"
            type="email"
            value={currentEmail || '未設定'}
            disabled
            className="bg-gray-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailManagementCard;

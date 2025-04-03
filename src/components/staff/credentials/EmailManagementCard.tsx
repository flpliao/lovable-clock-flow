
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
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

interface EmailManagementCardProps {
  currentEmail: string;
  onEmailChange: (email: string) => Promise<void>;
}

const EmailManagementCard: React.FC<EmailManagementCardProps> = ({ 
  currentEmail, 
  onEmailChange 
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    try {
      await onEmailChange(email);
      setEmail('');
    } catch (error) {
      toast({
        title: "更新失敗",
        description: "電子郵件更新失敗，請稍後再試",
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
                placeholder={currentEmail || "new-email@example.com"}
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
  );
};

export default EmailManagementCard;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: 'destructive',
        title: '請輸入電子郵件',
        description: '請提供有效的電子郵件地址',
      });
      return;
    }

    setIsLoading(true);
    
    console.log('🔐 開始 Supabase Auth 密碼重設流程');
    console.log('📧 目標郵件:', email);
    console.log('🔗 重定向 URL:', `${window.location.origin}/reset-password`);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Supabase Auth 密碼重設失敗:', error);
        console.error('錯誤詳情:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        let errorMessage = '發送重設郵件失敗，請稍後再試';
        
        if (error.message.includes('Invalid email')) {
          errorMessage = '請輸入有效的電子郵件地址';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '此電子郵件尚未確認，請先完成註冊流程';
        } else if (error.message.includes('For security purposes')) {
          errorMessage = '為了安全考量，請稍後再試';
        } else if (error.message.includes('rate limit')) {
          errorMessage = '請求過於頻繁，請稍後再試';
        }
        
        toast({
          variant: 'destructive',
          title: '發送失敗',
          description: errorMessage,
        });
        return;
      }

      console.log('✅ Supabase Auth 密碼重設郵件發送成功');
      
      setIsSuccess(true);
      
      toast({
        title: '郵件已發送',
        description: '請檢查您的電子郵件，點擊重設密碼連結來更新您的密碼。',
      });
      
    } catch (error) {
      console.error('🔥 密碼重設錯誤:', error);
      toast({
        variant: 'destructive',
        title: '發送失敗',
        description: '發生錯誤，請稍後再試',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="text-white/90 space-y-2">
          <p className="text-lg font-medium">郵件已發送！</p>
          <p className="text-sm">
            我們已將重設密碼的連結發送到：
          </p>
          <p className="text-white font-medium break-all">
            {email}
          </p>
          <p className="text-sm text-white/80 mt-4">
            請檢查您的郵箱（包括垃圾郵件資料夾），並點擊連結重設密碼。
          </p>
          <div className="mt-4 p-4 bg-white/10 rounded-lg text-xs text-white/70">
            <p className="font-medium mb-2">注意事項：</p>
            <ul className="text-left space-y-1">
              <li>• 郵件可能需要幾分鐘才會送達</li>
              <li>• 請檢查垃圾郵件資料夾</li>
              <li>• 重設連結有效期為 1 小時</li>
              <li>• 如未收到郵件，請聯繫系統管理員</li>
            </ul>
          </div>
        </div>
        
        <Button
          onClick={() => {
            setIsSuccess(false);
            setEmail('');
          }}
          className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          重新發送
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          電子郵件
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-purple-600/80 hover:bg-purple-700/80 text-white"
        disabled={isLoading}
      >
        {isLoading ? '發送中...' : '發送重設郵件'}
      </Button>
      
      <div className="text-center text-sm text-white/80 space-y-2">
        <p>使用 Supabase Auth 系統進行安全的密碼重設</p>
        <p className="text-xs text-white/60">
          如果您未收到郵件，請檢查垃圾郵件資料夾或聯繫系統管理員
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

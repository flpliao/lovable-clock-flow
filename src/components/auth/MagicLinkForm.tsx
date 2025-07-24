
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { Mail } from 'lucide-react';
import React, { useState } from 'react';

const MagicLinkForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { toast } = useToast();

  const handleMagicLink = async (e: React.FormEvent) => {
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
    
    console.log('🔐 開始 Magic Link 登入流程');
    console.log('📧 目標郵件:', email);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        console.error('❌ Magic Link 發送失敗:', error);
        
        let errorMessage = '發送登入連結失敗，請稍後再試';
        
        if (error.message.includes('Invalid email')) {
          errorMessage = '請輸入有效的電子郵件地址';
        } else if (error.message.includes('rate limit')) {
          errorMessage = '請求過於頻繁，請稍後再試';
        } else if (error.message.includes('User not found')) {
          errorMessage = '此電子郵件尚未註冊，請先註冊帳號';
        }
        
        toast({
          variant: 'destructive',
          title: '發送失敗',
          description: errorMessage,
        });
        return;
      }

      console.log('✅ Magic Link 發送成功');
      
      setIsSuccess(true);
      
      toast({
        title: '登入連結已發送',
        description: '請檢查您的電子郵件，點擊連結即可登入。',
      });
      
    } catch (error) {
      console.error('🔥 Magic Link 錯誤:', error);
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
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-300" />
        </div>
        <div className="text-white/90 space-y-2">
          <p className="text-lg font-medium">登入連結已發送！</p>
          <p className="text-sm">
            我們已將登入連結發送到：
          </p>
          <p className="text-white font-medium break-all">
            {email}
          </p>
          <p className="text-sm text-white/80 mt-4">
            請檢查您的郵箱（包括垃圾郵件資料夾），並點擊連結登入。
          </p>
          <div className="mt-4 p-4 bg-white/10 rounded-lg text-xs text-white/70">
            <p className="font-medium mb-2">注意事項：</p>
            <ul className="text-left space-y-1">
              <li>• 郵件可能需要幾分鐘才會送達</li>
              <li>• 請檢查垃圾郵件資料夾</li>
              <li>• 登入連結有效期為 1 小時</li>
              <li>• 連結只能使用一次</li>
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
    <form onSubmit={handleMagicLink} className="mt-8 space-y-6">
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
        {isLoading ? '發送中...' : '發送登入連結'}
      </Button>
      
      <div className="text-center text-sm text-white/80 space-y-2">
        <p>使用 Magic Link 安全登入，無需密碼</p>
        <p className="text-xs text-white/60">
          點擊按鈕後，我們會發送一次性登入連結到您的郵箱
        </p>
      </div>
    </form>
  );
};

export default MagicLinkForm;


import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface UseCredentialsProps {
  userId?: string;
  onSuccess?: () => void;
}

export const useCredentials = ({ userId, onSuccess }: UseCredentialsProps) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const { toast } = useToast();

  // 載入當前用戶的電子郵件
  useEffect(() => {
    const loadUserEmail = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('staff')
          .select('email')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('載入用戶資料失敗:', error);
          return;
        }

        if (data?.email) {
          setCurrentEmail(data.email);
        }
      } catch (error) {
        console.error('載入用戶資料時發生錯誤:', error);
      }
    };

    loadUserEmail();
  }, [userId]);

  const updateEmail = async (newEmail: string) => {
    if (!userId) {
      throw new Error('未指定用戶 ID');
    }

    try {
      console.log('🔄 更新用戶電子郵件:', { userId, newEmail });

      // 更新 Supabase Auth 用戶的 email
      const { error: authError } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (authError) {
        console.error('❌ 更新 Supabase Auth 電子郵件失敗:', authError);
        throw new Error(`更新失敗: ${authError.message}`);
      }

      // 同時更新 staff 表的 email
      const { error: staffError } = await supabase
        .from('staff')
        .update({ 
          email: newEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (staffError) {
        console.error('❌ 更新 staff 表電子郵件失敗:', staffError);
        // 這裡不拋出錯誤，因為主要的 Auth 更新已經成功
        console.log('⚠️ Staff 表更新失敗，但 Auth 更新成功');
      }

      console.log('✅ 電子郵件更新成功');
      setCurrentEmail(newEmail);
      
      toast({
        title: "電子郵件更新請求已發送",
        description: `請檢查新的電子郵件地址 ${newEmail} 以確認更改`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('🔥 更新電子郵件時發生錯誤:', error);
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "無法更新電子郵件",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      console.log('🔄 更新用戶密碼');

      // 使用 Supabase Auth 更新密碼
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ 更新密碼失敗:', error);
        throw new Error(`更新失敗: ${error.message}`);
      }

      console.log('✅ 密碼更新成功');
      
      toast({
        title: "密碼已更新",
        description: "您的登錄密碼已成功更新",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('🔥 更新密碼時發生錯誤:', error);
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "無法更新密碼",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    currentEmail,
    updateEmail,
    updatePassword
  };
};

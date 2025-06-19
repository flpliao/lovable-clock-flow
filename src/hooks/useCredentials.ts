
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

      const { error } = await supabase
        .from('staff')
        .update({ 
          email: newEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ 更新電子郵件失敗:', error);
        throw new Error(`更新失敗: ${error.message}`);
      }

      console.log('✅ 電子郵件更新成功');
      setCurrentEmail(newEmail);
      
      toast({
        title: "電子郵件已更新",
        description: `新的電子郵件地址：${newEmail}`,
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
    if (!userId) {
      throw new Error('未指定用戶 ID');
    }

    try {
      console.log('🔄 更新用戶密碼:', { userId });

      const { error } = await supabase
        .from('staff')
        .update({ 
          password: newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

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

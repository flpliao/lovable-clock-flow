
import { useState, useEffect } from 'react';
import { RLSSettingsService } from '../services/rlsSettingsService';
import { useToast } from '@/hooks/use-toast';

export const useRLSSettings = () => {
  const [isRLSEnabled, setIsRLSEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 載入 RLS 設定
  const loadRLSSettings = async () => {
    setLoading(true);
    try {
      const status = await RLSSettingsService.getRLSStatus();
      setIsRLSEnabled(status);
    } catch (error) {
      console.error('載入 RLS 設定失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入 RLS 安全設定",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 切換 RLS 設定
  const toggleRLS = async () => {
    const newStatus = !isRLSEnabled;
    
    try {
      const success = await RLSSettingsService.applyRLSSettings(newStatus);
      
      if (success) {
        setIsRLSEnabled(newStatus);
        toast({
          title: "設定更新成功",
          description: `RLS 安全政策已${newStatus ? '開啟' : '關閉'}`,
        });
      } else {
        toast({
          title: "設定更新失敗",
          description: "無法更新 RLS 安全設定",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('切換 RLS 設定失敗:', error);
      toast({
        title: "操作失敗",
        description: "切換 RLS 設定時發生錯誤",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadRLSSettings();
  }, []);

  return {
    isRLSEnabled,
    loading,
    toggleRLS,
    loadRLSSettings
  };
};

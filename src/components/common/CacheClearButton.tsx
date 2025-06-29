
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { permissionService } from '@/services/simplifiedPermissionService';
import { useUser } from '@/contexts/UserContext';

const CacheClearButton: React.FC = () => {
  const { toast } = useToast();
  const { resetUserState } = useUser();

  const handleClearCache = async () => {
    try {
      console.log('🔄 開始清除快取...');
      
      // 清除權限服務快取
      permissionService.forceRefresh();
      
      // 清除用戶狀態快取
      await resetUserState();
      
      // 顯示成功訊息
      toast({
        title: "快取已清除",
        description: "所有權限和用戶快取已清除，請重新整理頁面以確保完全生效",
        duration: 3000,
      });
      
      console.log('✅ 快取清除完成');
    } catch (error) {
      console.error('❌ 清除快取失敗:', error);
      toast({
        title: "清除快取失敗",
        description: "請稍後再試或聯繫系統管理員",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      onClick={handleClearCache}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      清除快取
    </Button>
  );
};

export default CacheClearButton;

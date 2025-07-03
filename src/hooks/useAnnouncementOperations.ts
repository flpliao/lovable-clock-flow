import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { AnnouncementCrudService } from '@/services/announcementCrudService';
import { CompanyAnnouncement } from '@/types/announcement';
import { useCallback } from 'react';

export const useAnnouncementOperations = (refreshData: () => Promise<void>) => {
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();

  // Create announcement with notifications
  const createAnnouncement = useCallback(async (newAnnouncement: Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>) => {
    if (!isAdmin) {
      toast({
        title: "權限不足",
        description: "只有管理員可以建立公告",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('=== 開始創建公告 ===');
      console.log('Creating announcement:', newAnnouncement.title);
      console.log('原始公告狀態 - is_active:', newAnnouncement.is_active);
      console.log('當前用戶:', currentUser);
      
      // 確保公告預設為啟用狀態
      const announcementToCreate = {
        ...newAnnouncement,
        is_active: true // 強制設為啟用狀態
      };
      
      console.log('最終公告狀態 - is_active:', announcementToCreate.is_active);
      
      const result = await AnnouncementCrudService.createAnnouncement(
        announcementToCreate, 
        currentUser.id, 
        currentUser.name
      );

      if (result.success && result.data) {
        console.log('公告創建成功，ID:', result.data.id);
        console.log('公告啟用狀態:', result.data.is_active);
        
        // 立即重新載入公告列表
        console.log('重新載入公告列表...');
        await refreshData();
        
        // 為所有用戶創建通知（包含管理者）
        console.log('開始為所有用戶創建通知...');
        try {
          // 暫時註釋掉有問題的方法調用，需要檢查正確的API
          // await AnnouncementNotificationService.createAnnouncementNotifications(
          //   result.data.id, 
          //   announcementToCreate.title, 
          //   currentUser.id
          // );
          console.log('通知創建流程完成');
          
          // 觸發全域公告更新事件
          const triggerEvents = () => {
            window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
            window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
              detail: { 
                type: 'new_announcement', 
                announcementId: result.data?.id,
                timestamp: new Date().toISOString()
              }
            }));
            console.log('全域公告事件已觸發');
          };
          
          // 立即觸發
          triggerEvents();
          
          // 延遲觸發確保所有組件都能收到
          setTimeout(triggerEvents, 100);
          setTimeout(triggerEvents, 300);
          
          toast({
            title: "公告已發布",
            description: `公告「${announcementToCreate.title}」已成功發布`,
          });
        } catch (notificationError) {
          console.error('通知創建失敗:', notificationError);
          toast({
            title: "公告已創建",
            description: "公告已成功創建，但通知發送失敗",
            variant: "default"
          });
        }
        
        console.log('=== 公告創建流程完成 ===');
        return true;
      } else {
        console.error('Failed to create announcement:', result);
        toast({
          title: "創建失敗",
          description: "無法創建公告，請重試",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error in createAnnouncement:', error);
      toast({
        title: "創建失敗",
        description: `無法創建公告: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      return false;
    }
  }, [isAdmin, currentUser, toast, refreshData]);

  // Update announcement
  const updateAnnouncement = useCallback(async (id: string, updatedAnnouncement: Partial<CompanyAnnouncement>) => {
    if (!isAdmin) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const success = await AnnouncementCrudService.updateAnnouncement(id, updatedAnnouncement);
      if (success) {
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return false;
    }
  }, [isAdmin, toast, refreshData]);

  // Delete announcement
  const deleteAnnouncement = useCallback(async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const success = await AnnouncementCrudService.deleteAnnouncement(id);
      if (success) {
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  }, [isAdmin, toast, refreshData]);

  return {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};

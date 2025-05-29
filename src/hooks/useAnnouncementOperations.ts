
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CompanyAnnouncement } from '@/types/announcement';
import { AnnouncementCrudService } from '@/services/announcementCrudService';
import { AnnouncementNotificationService } from '@/services/announcementNotificationService';

export const useAnnouncementOperations = (refreshData: () => Promise<void>) => {
  const { toast } = useToast();
  const { currentUser, isAdmin } = useUser();

  // Create announcement with notifications
  const createAnnouncement = async (newAnnouncement: Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>) => {
    if (!isAdmin()) {
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
      console.log('公告狀態 - is_active:', newAnnouncement.is_active);
      
      const result = await AnnouncementCrudService.createAnnouncement(
        newAnnouncement, 
        currentUser.id, 
        currentUser.name
      );

      if (result.success && result.data) {
        console.log('公告創建成功，ID:', result.data.id);
        
        // 重新載入公告列表
        await refreshData();
        
        // 如果公告是啟用狀態，創建通知
        if (newAnnouncement.is_active !== false) {
          console.log('公告為啟用狀態，開始創建通知...');
          try {
            await AnnouncementNotificationService.createAnnouncementNotifications(
              result.data.id, 
              newAnnouncement.title, 
              currentUser.id
            );
            console.log('通知創建流程完成');
            
            toast({
              title: "公告已發布",
              description: `公告「${newAnnouncement.title}」已成功發布並通知相關用戶`,
            });
          } catch (notificationError) {
            console.error('通知創建失敗:', notificationError);
            toast({
              title: "公告已創建",
              description: "公告已成功創建，但通知發送失敗",
              variant: "default"
            });
          }
        } else {
          console.log('公告為停用狀態，跳過通知創建');
          toast({
            title: "公告已創建",
            description: "公告已成功創建（未啟用狀態）",
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
  };

  // Update announcement
  const updateAnnouncement = async (id: string, updatedAnnouncement: Partial<CompanyAnnouncement>) => {
    if (!isAdmin()) {
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
  };

  // Delete announcement
  const deleteAnnouncement = async (id: string) => {
    if (!isAdmin()) {
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
  };

  return {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};


import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CompanyAnnouncement } from '@/types/announcement';
import { AnnouncementCrudService } from '@/services/announcementCrudService';
import { AnnouncementNotificationService } from '@/services/announcementNotificationService';
import { AnnouncementReadService } from '@/services/announcementReadService';

export const useSupabaseAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser, isAdmin } = useUser();

  // Load announcements
  const loadAnnouncements = async () => {
    try {
      console.log('Loading announcements...');
      const data = await AnnouncementCrudService.loadAnnouncements();
      console.log('Loaded announcements:', data.length);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

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
        await loadAnnouncements();
        
        // 如果公告是啟用狀態，創建通知
        if (newAnnouncement.is_active) {
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
        return false;
      }
    } catch (error) {
      console.error('Error in createAnnouncement:', error);
      toast({
        title: "創建失敗",
        description: "無法創建公告",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update announcement
  const updateAnnouncementData = async (id: string, updatedAnnouncement: Partial<CompanyAnnouncement>) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公告",
        variant: "destructive"
      });
      return false;
    }

    const success = await AnnouncementCrudService.updateAnnouncement(id, updatedAnnouncement);
    if (success) {
      await loadAnnouncements();
    }
    return success;
  };

  // Delete announcement
  const deleteAnnouncementData = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除公告",
        variant: "destructive"
      });
      return false;
    }

    const success = await AnnouncementCrudService.deleteAnnouncement(id);
    if (success) {
      await loadAnnouncements();
    }
    return success;
  };

  // Mark announcement as read
  const markAnnouncementAsRead = async (announcementId: string) => {
    if (!currentUser) return;
    await AnnouncementReadService.markAnnouncementAsRead(announcementId, currentUser.id);
  };

  // Check if announcement is read
  const checkAnnouncementRead = async (announcementId: string): Promise<boolean> => {
    if (!currentUser) return false;
    return await AnnouncementReadService.checkAnnouncementRead(announcementId, currentUser.id);
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAnnouncements();
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    announcements,
    loading,
    createAnnouncement,
    updateAnnouncement: updateAnnouncementData,
    deleteAnnouncement: deleteAnnouncementData,
    markAnnouncementAsRead,
    checkAnnouncementRead,
    refreshData: loadAnnouncements
  };
};

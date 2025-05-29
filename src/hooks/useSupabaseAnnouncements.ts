
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
    const data = await AnnouncementCrudService.loadAnnouncements();
    setAnnouncements(data);
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

    const result = await AnnouncementCrudService.createAnnouncement(
      newAnnouncement, 
      currentUser.id, 
      currentUser.name
    );

    if (result.success && newAnnouncement.is_active && result.data) {
      console.log('Creating notifications for active announcement with ID:', result.data.id);
      try {
        await AnnouncementNotificationService.createAnnouncementNotifications(
          result.data.id, 
          newAnnouncement.title, 
          currentUser.id
        );
      } catch (notificationError) {
        console.error('Failed to create notifications, but announcement was created:', notificationError);
        // Even if notification creation fails, show that announcement was created
      }
    }
    
    // Reload announcements list
    await loadAnnouncements();
    
    return result.success;
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


import { useUser } from '@/contexts/UserContext';
import { AnnouncementReadService } from '@/services/announcementReadService';

export const useAnnouncementReads = () => {
  const { currentUser } = useUser();

  // Mark announcement as read
  const markAnnouncementAsRead = async (announcementId: string): Promise<void> => {
    if (!currentUser) {
      console.warn('無法標記已讀：用戶未登入');
      return;
    }
    
    try {
      console.log('標記公告為已讀:', { announcementId, userId: currentUser.id });
      await AnnouncementReadService.markAnnouncementAsRead(announcementId, currentUser.id);
      console.log('公告已成功標記為已讀');
    } catch (error) {
      console.error('標記公告已讀時發生錯誤:', error);
      throw error;
    }
  };

  // Check if announcement is read - 確保返回 Promise<boolean>
  const checkAnnouncementRead = async (announcementId: string): Promise<boolean> => {
    if (!currentUser) {
      console.warn('無法檢查已讀狀態：用戶未登入');
      return false;
    }
    
    try {
      console.log('檢查公告已讀狀態:', { announcementId, userId: currentUser.id });
      const result = await AnnouncementReadService.checkAnnouncementRead(announcementId, currentUser.id);
      // 由於 AnnouncementReadService 確保返回 boolean，直接使用結果
      console.log('公告已讀狀態:', result);
      return result;
    } catch (error) {
      console.error('檢查公告已讀狀態時發生錯誤:', error);
      return false;
    }
  };

  return {
    markAnnouncementAsRead,
    checkAnnouncementRead
  };
};

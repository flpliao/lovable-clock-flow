
import { useUser } from '@/contexts/UserContext';
import { AnnouncementReadService } from '@/services/announcementReadService';

export const useAnnouncementReads = () => {
  const { currentUser } = useUser();

  // Mark announcement as read
  const markAnnouncementAsRead = async (announcementId: string) => {
    if (!currentUser) return;
    try {
      await AnnouncementReadService.markAnnouncementAsRead(announcementId, currentUser.id);
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  // Check if announcement is read - ensure boolean return type
  const checkAnnouncementRead = async (announcementId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const result = await AnnouncementReadService.checkAnnouncementRead(announcementId, currentUser.id);
      // Explicitly convert to boolean to ensure type safety
      return Boolean(result);
    } catch (error) {
      console.error('Error checking announcement read status:', error);
      return false;
    }
  };

  return {
    markAnnouncementAsRead,
    checkAnnouncementRead
  };
};

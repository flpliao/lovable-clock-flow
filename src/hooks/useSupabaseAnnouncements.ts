
import { useAnnouncementData } from './useAnnouncementData';
import { useAnnouncementOperations } from './useAnnouncementOperations';
import { useAnnouncementReads } from './useAnnouncementReads';

export const useSupabaseAnnouncements = () => {
  const { announcements, loading, refreshData, forceRefresh } = useAnnouncementData();
  const { createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncementOperations(refreshData);
  const { markAnnouncementAsRead, checkAnnouncementRead } = useAnnouncementReads();

  return {
    announcements,
    loading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    markAnnouncementAsRead,
    checkAnnouncementRead,
    refreshData,
    forceRefresh
  };
};

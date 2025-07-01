
import { useAnnouncementData } from './useAnnouncementData';
import { useAnnouncementOperations } from './useAnnouncementOperations';
import { useAnnouncementReads } from './useAnnouncementReads';

export const useSupabaseAnnouncements = (includeInactive: boolean = false) => {
  const { announcements, loading, refreshData, forceRefresh } = useAnnouncementData(includeInactive);
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

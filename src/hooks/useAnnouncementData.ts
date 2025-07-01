import { AnnouncementCrudService } from '@/services/announcementCrudService';
import { CompanyAnnouncement } from '@/types/announcement';
import { useCallback, useEffect, useState } from 'react';

export const useAnnouncementData = (includeInactive: boolean = false) => {
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load announcements
  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AnnouncementCrudService.loadAnnouncements(includeInactive);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  // 強制刷新函數
  const forceRefresh = useCallback(async () => {
    console.log('強制刷新公告列表...');
    await loadAnnouncements();
  }, [loadAnnouncements]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      console.log('收到公告刷新事件');
      loadAnnouncements();
    };

    window.addEventListener('refreshAnnouncements', handleRefresh);
    window.addEventListener('announcementDataUpdated', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshAnnouncements', handleRefresh);
      window.removeEventListener('announcementDataUpdated', handleRefresh);
    };
  }, [loadAnnouncements]);

  // Initial load
  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  return {
    announcements,
    loading,
    refreshData: loadAnnouncements,
    forceRefresh
  };
};

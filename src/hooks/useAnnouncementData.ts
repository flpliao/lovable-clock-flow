
import { useState, useEffect } from 'react';
import { CompanyAnnouncement } from '@/types/announcement';
import { AnnouncementCrudService } from '@/services/announcementCrudService';

export const useAnnouncementData = () => {
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load announcements
  const loadAnnouncements = async () => {
    try {
      console.log('Loading announcements...');
      setLoading(true);
      const data = await AnnouncementCrudService.loadAnnouncements();
      console.log('Loaded announcements:', data.length);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // 強制刷新函數
  const forceRefresh = async () => {
    console.log('強制刷新公告列表...');
    await loadAnnouncements();
  };

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
  }, []);

  // Initial load
  useEffect(() => {
    loadAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    refreshData: loadAnnouncements,
    forceRefresh
  };
};

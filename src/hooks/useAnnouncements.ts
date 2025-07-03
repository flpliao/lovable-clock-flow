import { useNotifications } from '@/hooks/useNotifications';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { AnnouncementCategory, CompanyAnnouncement } from '@/types/announcement';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useAnnouncements = (adminMode: boolean = false) => {
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { addNotification } = useNotifications();
  const {
    announcements: supabaseAnnouncements,
    loading: supabaseLoading,
    createAnnouncement: supabaseCreate,
    updateAnnouncement: supabaseUpdate,
    deleteAnnouncement: supabaseDelete,
    markAnnouncementAsRead: supabaseMark,
    checkAnnouncementRead: supabaseCheck,
    refreshData: supabaseRefresh
  } = useSupabaseAnnouncements();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CompanyAnnouncement | null>(null);
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});
  
  // Check if user has admin access
  const hasAdminAccess = useMemo(() => {
    return isAdmin || (currentUser?.department === 'HR');
  }, [currentUser, isAdmin]);

  // Load read status for announcements
  useEffect(() => {
    const loadReadStatus = async () => {
      if (!currentUser || supabaseAnnouncements.length === 0) return;
      
      const statusMap: Record<string, boolean> = {};
      for (const announcement of supabaseAnnouncements) {
        try {
          const isRead = await supabaseCheck(announcement.id);
          statusMap[announcement.id] = isRead;
        } catch (error) {
          console.error('Error checking read status:', error);
          statusMap[announcement.id] = false;
        }
      }
      setReadStatus(statusMap);
    };

    loadReadStatus();
  }, [supabaseAnnouncements, currentUser, supabaseCheck]);

  // Filtered and searched announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = supabaseAnnouncements;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(lowerQuery) || 
        a.content.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [supabaseAnnouncements, searchQuery, selectedCategory]);

  // Mark an announcement as read
  const markAsRead = async (announcementId: string) => {
    if (currentUser) {
      await supabaseMark(announcementId);
      setReadStatus(prev => ({ ...prev, [announcementId]: true }));
    }
  };

  // Check if announcement is read
  const checkIfRead = (announcementId: string): boolean => {
    return readStatus[announcementId] || false;
  };

  // Get a specific announcement
  const getAnnouncement = (id: string): CompanyAnnouncement | undefined => {
    return supabaseAnnouncements.find(a => a.id === id);
  };

  // Create a new announcement
  const createAnnouncement = async (announcement: Omit<CompanyAnnouncement, 'id'>) => {
    if (!currentUser) return null;
    
    console.log('Creating new announcement:', announcement.title);
    const success = await supabaseCreate(announcement);
    
    if (success) {
      // Add notification for new announcement
      console.log('Adding notification for new announcement');
      addNotification({
        title: '新公告發布',
        message: `${announcement.title}`,
        type: 'announcement',
        data: {
          announcementId: 'new' // Will be updated when we refresh
        }
      });
      
      return announcement as CompanyAnnouncement;
    }
    
    return null;
  };

  // Update an announcement
  const editAnnouncement = async (announcement: CompanyAnnouncement) => {
    if (!hasAdminAccess) return null;
    
    const success = await supabaseUpdate(announcement.id, announcement);
    return success ? announcement : null;
  };

  // Delete an announcement (set is_active to false)
  const removeAnnouncement = async (id: string): Promise<boolean> => {
    if (!hasAdminAccess) return false;
    
    return await supabaseDelete(id);
  };

  // Get available categories
  const categories: AnnouncementCategory[] = ['HR', 'Administration', 'Meeting', 'Official', 'General'];

  // Force refresh function
  const forceRefresh = useCallback(async () => {
    console.log('Forcing refresh of announcements');
    await supabaseRefresh();
  }, [supabaseRefresh]);

  return {
    announcements: filteredAnnouncements,
    isLoading: supabaseLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedAnnouncement,
    setSelectedAnnouncement,
    markAsRead,
    checkIfRead,
    getAnnouncement,
    createAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    categories,
    hasAdminAccess,
    forceRefresh
  };
};

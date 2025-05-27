
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/hooks/useNotifications';
import { CompanyAnnouncement, AnnouncementCategory } from '@/types/announcement';
import { 
  getActiveAnnouncements, 
  getAllAnnouncements, 
  searchAnnouncements, 
  filterAnnouncementsByCategory,
  markAnnouncementAsRead,
  isAnnouncementRead,
  getAnnouncementById,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementCategories
} from '@/utils/announcementUtils';

export const useAnnouncements = (adminMode: boolean = false) => {
  const { currentUser, isAdmin } = useUser();
  const { addNotification } = useNotifications();
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CompanyAnnouncement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Check if user has admin access
  const hasAdminAccess = useMemo(() => {
    return isAdmin() || (currentUser?.department === 'HR');
  }, [currentUser, isAdmin]);

  // Force refresh function
  const forceRefresh = useCallback(() => {
    console.log('Forcing refresh of announcements');
    setRefreshKey(prev => prev + 1);
  }, []);

  // Load announcements function
  const loadAnnouncements = useCallback(() => {
    console.log('Loading announcements for mode:', adminMode ? 'admin' : 'user');
    setIsLoading(true);
    
    // Get fresh data
    const newAnnouncements = adminMode && hasAdminAccess ? getAllAnnouncements() : getActiveAnnouncements();
    console.log('Loaded announcements:', newAnnouncements.length, 'items');
    
    setAnnouncements(newAnnouncements);
    setIsLoading(false);
  }, [adminMode, hasAdminAccess]);

  // Listen for custom refresh events and data updates
  useEffect(() => {
    const handleRefresh = () => {
      console.log('Received refresh event, reloading announcements');
      loadAnnouncements();
    };
    
    const handleDataUpdate = (event: CustomEvent) => {
      console.log('Received data update event:', event.detail);
      // Force immediate refresh
      loadAnnouncements();
    };
    
    window.addEventListener('refreshAnnouncements', handleRefresh);
    window.addEventListener('announcementDataUpdated', handleDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('refreshAnnouncements', handleRefresh);
      window.removeEventListener('announcementDataUpdated', handleDataUpdate as EventListener);
    };
  }, [loadAnnouncements]);

  // Load announcements on initial mount and when dependencies change
  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements, refreshKey]);

  // Filtered and searched announcements
  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery && selectedCategory === 'all') {
      return announcements;
    }
    
    let filtered = announcements;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filterAnnouncementsByCategory(selectedCategory, !adminMode);
    }
    
    // Apply search filter
    if (searchQuery) {
      const searchResults = searchAnnouncements(searchQuery, !adminMode);
      filtered = filtered.filter(a => searchResults.some(s => s.id === a.id));
    }
    
    return filtered;
  }, [announcements, searchQuery, selectedCategory, adminMode]);

  // Mark an announcement as read
  const markAsRead = (announcementId: string) => {
    if (currentUser) {
      markAnnouncementAsRead(currentUser.id, announcementId);
    }
  };

  // Check if announcement is read
  const checkIfRead = (announcementId: string): boolean => {
    return currentUser ? isAnnouncementRead(currentUser.id, announcementId) : false;
  };

  // Get a specific announcement
  const getAnnouncement = (id: string): CompanyAnnouncement | undefined => {
    return getAnnouncementById(id);
  };

  // Create a new announcement
  const createAnnouncement = (announcement: Omit<CompanyAnnouncement, 'id'>) => {
    if (!currentUser) return null;
    
    console.log('Creating new announcement:', announcement.title);
    const newAnnouncement = addAnnouncement(announcement);
    
    // Always create notification for new announcement
    console.log('Adding notification for new announcement with ID:', newAnnouncement.id);
    addNotification({
      title: '新公告發布',
      message: `${newAnnouncement.title}`,
      type: 'announcement',
      data: {
        announcementId: newAnnouncement.id
      }
    });
    
    // Immediately refresh local state
    console.log('Refreshing announcements after creation');
    
    // Use setTimeout to ensure the data is properly updated
    setTimeout(() => {
      loadAnnouncements();
      window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
      window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
        detail: { type: 'added', announcement: newAnnouncement }
      }));
    }, 50);
    
    return newAnnouncement;
  };

  // Update an announcement
  const editAnnouncement = (announcement: CompanyAnnouncement) => {
    if (!hasAdminAccess) return null;
    
    const updatedAnnouncement = updateAnnouncement(announcement);
    loadAnnouncements();
    return updatedAnnouncement;
  };

  // Delete an announcement (set is_active to false)
  const removeAnnouncement = (id: string): boolean => {
    if (!hasAdminAccess) return false;
    
    const result = deleteAnnouncement(id);
    if (result) {
      loadAnnouncements();
    }
    return result;
  };

  // Get available categories
  const categories = useMemo(() => {
    return getAnnouncementCategories();
  }, []);

  return {
    announcements: filteredAnnouncements,
    isLoading,
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

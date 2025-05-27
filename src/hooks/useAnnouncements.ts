import { useState, useEffect, useMemo } from 'react';
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
  const [lastAnnouncementCount, setLastAnnouncementCount] = useState(0);
  
  // Check if user has admin access
  const hasAdminAccess = useMemo(() => {
    return isAdmin() || (currentUser?.department === 'HR');
  }, [currentUser, isAdmin]);

  // Load announcements
  useEffect(() => {
    setIsLoading(true);
    // Small delay to simulate loading from an API
    setTimeout(() => {
      const newAnnouncements = adminMode && hasAdminAccess ? getAllAnnouncements() : getActiveAnnouncements();
      
      // Check for new announcements and create notifications
      if (currentUser && !adminMode && announcements.length > 0) {
        const newAnnouncementCount = newAnnouncements.length;
        if (newAnnouncementCount > lastAnnouncementCount) {
          // Find the newly added announcements
          const newerAnnouncements = newAnnouncements.slice(0, newAnnouncementCount - lastAnnouncementCount);
          
          newerAnnouncements.forEach(announcement => {
            // Only create notification if this announcement wasn't seen before
            const existingAnnouncement = announcements.find(a => a.id === announcement.id);
            if (!existingAnnouncement) {
              addNotification({
                title: '新公告發布',
                message: `${announcement.title}`,
                type: 'system',
                data: {
                  announcementId: announcement.id
                }
              });
            }
          });
        }
        setLastAnnouncementCount(newAnnouncementCount);
      } else if (currentUser && announcements.length === 0) {
        // First time loading - set the count without notifications
        setLastAnnouncementCount(newAnnouncements.length);
      }
      
      setAnnouncements(newAnnouncements);
      setIsLoading(false);
    }, 300);
  }, [adminMode, hasAdminAccess, currentUser, addNotification, lastAnnouncementCount]);

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
    
    const newAnnouncement = addAnnouncement(announcement);
    
    // Refresh announcements list
    const updatedAnnouncements = adminMode ? getAllAnnouncements() : getActiveAnnouncements();
    setAnnouncements(updatedAnnouncements);
    
    // Create notification for new announcement (will be picked up by the useEffect above)
    if (!adminMode) {
      addNotification({
        title: '新公告發布',
        message: `${newAnnouncement.title}`,
        type: 'system',
        data: {
          announcementId: newAnnouncement.id
        }
      });
    }
    
    return newAnnouncement;
  };

  // Update an announcement
  const editAnnouncement = (announcement: CompanyAnnouncement) => {
    if (!hasAdminAccess) return null;
    
    const updatedAnnouncement = updateAnnouncement(announcement);
    setAnnouncements(adminMode ? getAllAnnouncements() : getActiveAnnouncements());
    return updatedAnnouncement;
  };

  // Delete an announcement (set is_active to false)
  const removeAnnouncement = (id: string): boolean => {
    if (!hasAdminAccess) return false;
    
    const result = deleteAnnouncement(id);
    if (result) {
      setAnnouncements(adminMode ? getAllAnnouncements() : getActiveAnnouncements());
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
    hasAdminAccess
  };
};

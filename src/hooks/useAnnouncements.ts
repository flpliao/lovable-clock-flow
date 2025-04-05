
import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
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
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CompanyAnnouncement | null>(null);
  
  // Check if user has admin access
  const hasAdminAccess = useMemo(() => {
    return isAdmin() || (currentUser?.department === 'HR');
  }, [currentUser, isAdmin]);

  // Load announcements
  useEffect(() => {
    setIsLoading(true);
    // Small delay to simulate loading from an API
    setTimeout(() => {
      if (adminMode && hasAdminAccess) {
        setAnnouncements(getAllAnnouncements());
      } else {
        setAnnouncements(getActiveAnnouncements());
      }
      setIsLoading(false);
    }, 300);
  }, [adminMode, hasAdminAccess]);

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
    setAnnouncements(adminMode ? getAllAnnouncements() : getActiveAnnouncements());
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

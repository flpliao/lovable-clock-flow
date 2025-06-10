
import { useState, useMemo } from 'react';
import { CompanyAnnouncement } from '@/types/announcement';

export const useAnnouncementFilters = (announcements: CompanyAnnouncement[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['HR', 'Administration', 'Meeting', 'Official', 'General'];

  // Filter announcements based on search and category
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = !searchQuery || 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        announcement.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [announcements, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredAnnouncements,
    clearFilters,
    hasActiveFilters
  };
};

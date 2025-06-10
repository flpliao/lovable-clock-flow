
import React, { useState } from 'react';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementDetail from './AnnouncementDetail';
import AnnouncementSearchSection from './components/AnnouncementSearchSection';
import AnnouncementResultsSummary from './components/AnnouncementResultsSummary';
import AnnouncementLoadingState from './components/AnnouncementLoadingState';
import AnnouncementEmptyState from './components/AnnouncementEmptyState';
import { useAnnouncementFilters } from './hooks/useAnnouncementFilters';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { CompanyAnnouncement } from '@/types/announcement';

const AnnouncementList: React.FC = () => {
  const {
    announcements,
    loading,
    markAnnouncementAsRead,
    checkAnnouncementRead
  } = useSupabaseAnnouncements();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredAnnouncements,
    clearFilters,
    hasActiveFilters
  } = useAnnouncementFilters(announcements);

  const [openAnnouncement, setOpenAnnouncement] = useState<CompanyAnnouncement | null>(null);
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  const handleOpenAnnouncement = async (announcement: CompanyAnnouncement) => {
    setOpenAnnouncement(announcement);
    await markAnnouncementAsRead(announcement.id);
    setReadStatus(prev => ({ ...prev, [announcement.id]: true }));
  };

  // Check if announcement is read
  const checkIfRead = async (announcementId: string): Promise<boolean> => {
    if (readStatus[announcementId] !== undefined) {
      return readStatus[announcementId];
    }
    
    const isRead = await checkAnnouncementRead(announcementId);
    // Store the boolean result
    setReadStatus(prev => ({ ...prev, [announcementId]: isRead }));
    return isRead;
  };

  // Helper function to get read status with proper boolean type
  const getReadStatus = (announcementId: string): boolean => {
    const status = readStatus[announcementId];
    // Return boolean, defaulting to false if undefined
    return Boolean(status);
  };

  return (
    <div className="space-y-6">
      {/* Search and filter section */}
      <AnnouncementSearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        clearFilters={clearFilters}
      />

      {/* Results summary */}
      <AnnouncementResultsSummary
        totalCount={filteredAnnouncements.length}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        loading={loading}
      />

      {/* Announcements list */}
      {loading ? (
        <AnnouncementLoadingState />
      ) : filteredAnnouncements.length === 0 ? (
        <AnnouncementEmptyState
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isRead={getReadStatus(announcement.id)}
              onClick={handleOpenAnnouncement}
            />
          ))}
        </div>
      )}

      <AnnouncementDetail
        announcement={openAnnouncement}
        isOpen={!!openAnnouncement}
        onClose={() => setOpenAnnouncement(null)}
        onMarkAsRead={markAnnouncementAsRead}
      />
    </div>
  );
};

export default AnnouncementList;

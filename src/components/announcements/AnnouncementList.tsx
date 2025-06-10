
import React, { useState, useEffect } from 'react';
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
  // 明確定義 readStatus 為只包含布林值的記錄
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  // 初始化時載入所有公告的已讀狀態
  useEffect(() => {
    const loadAllReadStatus = async () => {
      if (announcements.length === 0) return;
      
      console.log('載入所有公告的已讀狀態...');
      const statusMap: Record<string, boolean> = {};
      
      for (const announcement of announcements) {
        try {
          const isRead = await checkAnnouncementRead(announcement.id);
          // 確保只儲存布林值
          statusMap[announcement.id] = Boolean(isRead);
        } catch (error) {
          console.error(`檢查公告 ${announcement.id} 已讀狀態失敗:`, error);
          statusMap[announcement.id] = false;
        }
      }
      
      console.log('已讀狀態載入完成:', statusMap);
      setReadStatus(statusMap);
    };

    loadAllReadStatus();
  }, [announcements, checkAnnouncementRead]);

  const handleOpenAnnouncement = async (announcement: CompanyAnnouncement) => {
    console.log('開啟公告:', announcement.title);
    setOpenAnnouncement(announcement);
    
    try {
      await markAnnouncementAsRead(announcement.id);
      setReadStatus(prev => ({ ...prev, [announcement.id]: true }));
      console.log('公告已標記為已讀:', announcement.id);
    } catch (error) {
      console.error('標記公告已讀失敗:', error);
    }
  };

  // 取得已讀狀態 - 確保返回布林值
  const getReadStatus = (announcementId: string): boolean => {
    const status = readStatus[announcementId];
    // 明確檢查是否為 true，其他情況都回傳 false
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

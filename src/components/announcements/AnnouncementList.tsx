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
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  // 初始化時載入所有公告的已讀狀態
  useEffect(() => {
    const loadAllReadStatus = async () => {
      if (announcements.length === 0) return;
      
      const statusMap: Record<string, boolean> = {};
      for (const announcement of announcements) {
        try {
          const raw = await checkAnnouncementRead(announcement.id);
          statusMap[announcement.id] = !!raw;  // 強制轉為 boolean
        } catch {
          statusMap[announcement.id] = false;
        }
      }
      setReadStatus(statusMap);
    };

    loadAllReadStatus();
  }, [announcements, checkAnnouncementRead]);

  const handleOpenAnnouncement = async (announcement: CompanyAnnouncement) => {
    setOpenAnnouncement(announcement);
    try {
      await markAnnouncementAsRead(announcement.id);
      setReadStatus(prev => ({ ...prev, [announcement.id]: true }));
    } catch {
      // 忽略標記失敗
    }
  };

  // 確保回傳純布林
  const getReadStatus = (id: string): boolean => {
    return !!readStatus[id];
  };

  // 確保 hasActiveFilters 也是純布林
  const hasFilters = !!hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* 搜索與篩選 */}
      <AnnouncementSearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        clearFilters={clearFilters}
      />

      {/* 結果摘要 */}
      <AnnouncementResultsSummary
        totalCount={filteredAnnouncements.length}
        hasActiveFilters={hasFilters}
        clearFilters={clearFilters}
        loading={!!loading}
      />

      {/* 列表內容 */}
      {loading ? (
        <AnnouncementLoadingState />
      ) : filteredAnnouncements.length === 0 ? (
        <AnnouncementEmptyState
          hasActiveFilters={hasFilters}
          clearFilters={clearFilters}
        />
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map(item => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              isRead={getReadStatus(item.id)}
              onClick={handleOpenAnnouncement}
            />
          ))}
        </div>
      )}

      {/* 詳細視窗 */}
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
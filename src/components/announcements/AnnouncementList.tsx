import React, { useState, useEffect } from 'react';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementDetail from './AnnouncementDetail';
import {
  AdvancedFilter,
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import AnnouncementResultsSummary from './components/AnnouncementResultsSummary';
import AnnouncementLoadingState from './components/AnnouncementLoadingState';
import AnnouncementEmptyState from './components/AnnouncementEmptyState';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { CompanyAnnouncement } from '@/types/announcement';

const AnnouncementList: React.FC = () => {
  const { announcements, loading, markAnnouncementAsRead, checkAnnouncementRead } =
    useSupabaseAnnouncements();

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'title', label: '標題' },
    { value: 'content', label: '內容' },
    { value: 'category', label: '分類' },
    { value: 'created_by_name', label: '發布者' },
  ];

  // 篩選函數
  const applyAnnouncementFilter = (
    announcement: CompanyAnnouncement,
    conditionGroups: FilterGroup[]
  ) => {
    return applyMultiConditionFilter(announcement, conditionGroups, (item, field) => {
      if (field === 'created_by_name') {
        return item.created_by?.name || '';
      }
      return (item[field as keyof CompanyAnnouncement] || '').toString();
    });
  };

  // 使用通用篩選 Hook
  const {
    conditionGroups,
    filteredData: filteredAnnouncements,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
  } = useAdvancedFilter({
    data: announcements,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: applyAnnouncementFilter,
  });

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
          statusMap[announcement.id] = !!raw; // 強制轉為 boolean
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
  const hasFilters = appliedConditionCount > 0;

  return (
    <div className="space-y-6">
      {/* 使用通用篩選組件 */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={announcements}
        filteredData={filteredAnnouncements}
        applyFilter={applyAnnouncementFilter}
        title="公告篩選"
        showAdvancedFilters={showAdvancedFilters}
        onShowAdvancedFiltersChange={setShowAdvancedFilters}
        onClearAll={clearAllConditions}
      />

      {/* 結果摘要 */}
      <AnnouncementResultsSummary
        totalCount={filteredAnnouncements.length}
        hasActiveFilters={hasFilters}
        clearFilters={clearAllConditions}
        loading={!!loading}
      />

      {/* 列表內容 */}
      {loading ? (
        <AnnouncementLoadingState />
      ) : filteredAnnouncements.length === 0 ? (
        <AnnouncementEmptyState hasActiveFilters={hasFilters} clearFilters={clearAllConditions} />
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

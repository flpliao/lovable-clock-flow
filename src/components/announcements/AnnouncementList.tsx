import React, { useState, useEffect, useMemo } from 'react';
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

// 公告列表 API 篩選服務
class AnnouncementListApiFilterService {
  async filter(request: {
    conditionGroups: FilterGroup[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: CompanyAnnouncement[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 這裡可以實作真正的 API 呼叫
      // 目前先使用本地篩選作為示範
      // 注意：實際實作時需要從 API 獲取資料

      // 暫時返回空資料，實際實作時需要從 API 獲取
      return {
        data: [],
        total: 0,
        totalPages: 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('篩選公告失敗:', error);
      throw error;
    }
  }

  // 獲取公告分類選項
  getCategoryOptions() {
    return [
      { value: 'general', label: '一般公告' },
      { value: 'important', label: '重要公告' },
      { value: 'urgent', label: '緊急公告' },
      { value: 'policy', label: '政策公告' },
      { value: 'event', label: '活動公告' },
      { value: 'maintenance', label: '系統維護' },
    ];
  }
}

const announcementListApiFilterService = new AnnouncementListApiFilterService();

const AnnouncementList: React.FC = () => {
  const { announcements, loading, markAnnouncementAsRead, checkAnnouncementRead } =
    useSupabaseAnnouncements();

  // 定義搜尋欄位（包含下拉選單配置）
  const SEARCH_FIELDS: SearchField[] = useMemo(
    () => [
      {
        value: 'title',
        label: '標題',
        type: 'input',
        placeholder: '請輸入公告標題',
      },
      {
        value: 'content',
        label: '內容',
        type: 'input',
        placeholder: '請輸入公告內容',
      },
      {
        value: 'category',
        label: '分類',
        type: 'select',
        options: announcementListApiFilterService.getCategoryOptions(),
        placeholder: '請選擇分類',
      },
      {
        value: 'created_by_name',
        label: '發布者',
        type: 'input',
        placeholder: '請輸入發布者姓名',
      },
    ],
    []
  );

  // 使用通用篩選 Hook（API 模式）
  const {
    conditionGroups,
    filteredData: filteredAnnouncements,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
    loading: filterLoading,
  } = useAdvancedFilter({
    data: announcements,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: () => true, // API 模式下不需要本地篩選
    apiService: announcementListApiFilterService,
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
      {/* 使用通用篩選組件（API 模式） */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={announcements}
        filteredData={filteredAnnouncements}
        apiService={announcementListApiFilterService}
        loading={filterLoading}
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

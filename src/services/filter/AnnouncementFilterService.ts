import { BaseFilterService, FilterOption, OptionsProvider } from './BaseFilterService';
import { ApiFilterRequest, ApiFilterResponse } from '@/components/common/AdvancedFilter/types';

// 公告類型定義
interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  [key: string]: string | number | boolean;
}

// 公告篩選服務
export class AnnouncementFilterService
  extends BaseFilterService<Announcement>
  implements OptionsProvider
{
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<Announcement>> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 模擬公告資料
      const allAnnouncements: Announcement[] = [
        {
          id: '1',
          title: '系統維護通知',
          content: '系統將於今晚進行維護',
          author: '系統管理員',
          category: 'system',
          priority: 'high',
          status: 'published',
          created_at: '2024-01-15',
        },
        {
          id: '2',
          title: '年度會議通知',
          content: '年度會議將於下週舉行',
          author: '總經理',
          category: 'meeting',
          priority: 'medium',
          status: 'draft',
          created_at: '2024-01-16',
        },
        {
          id: '3',
          title: '新政策發布',
          content: '新的員工政策已發布',
          author: '人力資源部',
          category: 'policy',
          priority: 'high',
          status: 'published',
          created_at: '2024-01-17',
        },
      ];

      // 應用篩選條件
      const filteredData = this.applyLocalFilter(
        allAnnouncements,
        conditionGroups,
        (item, field) => {
          return (item[field as keyof Announcement] || '').toString();
        }
      );

      // 分頁處理
      return this.applyPagination(filteredData, page, pageSize);
    } catch (error) {
      console.error('篩選公告失敗:', error);
      throw error;
    }
  }

  // 獲取分類選項
  getCategoryOptions(): FilterOption[] {
    return [
      { value: 'system', label: '系統公告' },
      { value: 'meeting', label: '會議通知' },
      { value: 'policy', label: '政策發布' },
      { value: 'event', label: '活動通知' },
      { value: 'general', label: '一般公告' },
    ];
  }

  // 獲取優先級選項
  getPriorityOptions(): FilterOption[] {
    return [
      { value: 'low', label: '低' },
      { value: 'medium', label: '中' },
      { value: 'high', label: '高' },
      { value: 'urgent', label: '緊急' },
    ];
  }

  // 獲取狀態選項
  getStatusOptions(): FilterOption[] {
    return [
      { value: 'draft', label: '草稿' },
      { value: 'published', label: '已發布' },
      { value: 'archived', label: '已封存' },
    ];
  }

  // 實作 OptionsProvider 介面
  getOptions(): FilterOption[] {
    return [];
  }
}

// 建立單例實例
export const announcementFilterService = new AnnouncementFilterService();

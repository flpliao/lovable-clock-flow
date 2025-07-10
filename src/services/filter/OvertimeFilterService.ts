import { BaseFilterService, FilterOption, OptionsProvider } from './BaseFilterService';
import { ApiFilterRequest, ApiFilterResponse } from '@/components/common/AdvancedFilter/types';

// 加班記錄類型定義
interface OvertimeRecord {
  id: string;
  staff_name: string;
  department: string;
  date: string;
  hours: number;
  status: string;
  reason: string;
  [key: string]: string | number | boolean;
}

// 加班篩選服務
export class OvertimeFilterService
  extends BaseFilterService<OvertimeRecord>
  implements OptionsProvider
{
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<OvertimeRecord>> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 模擬加班資料
      const allOvertime: OvertimeRecord[] = [
        {
          id: '1',
          staff_name: '張小明',
          department: 'IT',
          date: '2024-01-15',
          hours: 2,
          status: 'approved',
          reason: '專案趕工',
        },
        {
          id: '2',
          staff_name: '李小華',
          department: 'HR',
          date: '2024-01-16',
          hours: 1.5,
          status: 'pending',
          reason: '會議準備',
        },
        {
          id: '3',
          staff_name: '王小美',
          department: 'Finance',
          date: '2024-01-17',
          hours: 3,
          status: 'rejected',
          reason: '報表整理',
        },
      ];

      // 應用篩選條件
      const filteredData = this.applyLocalFilter(allOvertime, conditionGroups, (item, field) => {
        return (item[field as keyof OvertimeRecord] || '').toString();
      });

      // 分頁處理
      return this.applyPagination(filteredData, page, pageSize);
    } catch (error) {
      console.error('篩選加班記錄失敗:', error);
      throw error;
    }
  }

  // 獲取部門選項
  getDepartmentOptions(): FilterOption[] {
    return [
      { value: 'IT', label: '資訊技術部' },
      { value: 'HR', label: '人力資源部' },
      { value: 'Finance', label: '財務部' },
      { value: 'Marketing', label: '行銷部' },
      { value: 'Sales', label: '業務部' },
    ];
  }

  // 獲取狀態選項
  getStatusOptions(): FilterOption[] {
    return [
      { value: 'pending', label: '待審核' },
      { value: 'approved', label: '已核准' },
      { value: 'rejected', label: '已拒絕' },
    ];
  }

  // 實作 OptionsProvider 介面
  getOptions(): FilterOption[] {
    return [];
  }
}

// 建立單例實例
export const overtimeFilterService = new OvertimeFilterService();

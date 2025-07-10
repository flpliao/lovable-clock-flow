import { BaseFilterService, FilterOption, OptionsProvider } from './BaseFilterService';
import { ApiFilterRequest, ApiFilterResponse } from '@/components/common/AdvancedFilter/types';

// 職位類型定義
interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
  status: string;
  description: string;
  [key: string]: string | number | boolean;
}

// 職位篩選服務
export class PositionFilterService extends BaseFilterService<Position> implements OptionsProvider {
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<Position>> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 模擬職位資料
      const allPositions: Position[] = [
        {
          id: '1',
          title: '軟體工程師',
          department: 'IT',
          level: 'senior',
          status: 'active',
          description: '負責系統開發',
        },
        {
          id: '2',
          title: '人力資源專員',
          department: 'HR',
          level: 'specialist',
          status: 'active',
          description: '負責人員招募',
        },
        {
          id: '3',
          title: '財務經理',
          department: 'Finance',
          level: 'manager',
          status: 'active',
          description: '負責財務管理',
        },
      ];

      // 應用篩選條件
      const filteredData = this.applyLocalFilter(allPositions, conditionGroups, (item, field) => {
        return (item[field as keyof Position] || '').toString();
      });

      // 分頁處理
      return this.applyPagination(filteredData, page, pageSize);
    } catch (error) {
      console.error('篩選職位失敗:', error);
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

  // 獲取職級選項
  getLevelOptions(): FilterOption[] {
    return [
      { value: 'intern', label: '實習生' },
      { value: 'junior', label: '初級' },
      { value: 'specialist', label: '專員' },
      { value: 'senior', label: '資深' },
      { value: 'manager', label: '經理' },
      { value: 'director', label: '總監' },
    ];
  }

  // 獲取狀態選項
  getStatusOptions(): FilterOption[] {
    return [
      { value: 'active', label: '啟用' },
      { value: 'inactive', label: '停用' },
    ];
  }

  // 實作 OptionsProvider 介面
  getOptions(): FilterOption[] {
    return [];
  }
}

// 建立單例實例
export const positionFilterService = new PositionFilterService();

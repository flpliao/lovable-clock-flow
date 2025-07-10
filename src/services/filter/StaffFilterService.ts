import { BaseFilterService, FilterOption, OptionsProvider } from './BaseFilterService';
import { ApiFilterRequest, ApiFilterResponse } from '@/components/common/AdvancedFilter/types';

// 員工類型定義
interface Staff {
  id: string;
  name: string;
  email: string;
  role_id: string;
  department: string;
  position: string;
  status: string;
  [key: string]: string | number | boolean;
}

// 員工篩選服務
export class StaffFilterService extends BaseFilterService<Staff> implements OptionsProvider {
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<Staff>> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 這裡可以實作真正的 API 呼叫
      // 目前先使用模擬資料作為示範
      const allStaff: Staff[] = [
        {
          id: '1',
          name: '張小明',
          email: 'zhang@example.com',
          role_id: 'admin',
          department: 'IT',
          position: 'manager',
          status: 'active',
        },
        {
          id: '2',
          name: '李小華',
          email: 'li@example.com',
          role_id: 'staff',
          department: 'HR',
          position: 'specialist',
          status: 'active',
        },
        {
          id: '3',
          name: '王小美',
          email: 'wang@example.com',
          role_id: 'manager',
          department: 'Finance',
          position: 'senior',
          status: 'active',
        },
      ];

      // 應用篩選條件
      const filteredData = this.applyLocalFilter(allStaff, conditionGroups, (item, field) => {
        if (field === 'role_id') {
          return item.role_id || '';
        }
        if (field === 'department') {
          return item.department || '';
        }
        if (field === 'position') {
          return item.position || '';
        }
        return (item[field as keyof Staff] || '').toString();
      });

      // 分頁處理
      return this.applyPagination(filteredData, page, pageSize);
    } catch (error) {
      console.error('篩選員工失敗:', error);
      throw error;
    }
  }

  // 獲取角色選項
  getRoleOptions(): FilterOption[] {
    return [
      { value: 'admin', label: '系統管理員' },
      { value: 'manager', label: '部門經理' },
      { value: 'supervisor', label: '主管' },
      { value: 'staff', label: '一般員工' },
      { value: 'intern', label: '實習生' },
    ];
  }

  // 獲取部門選項
  getDepartmentOptions(): FilterOption[] {
    return [
      { value: 'IT', label: '資訊技術部' },
      { value: 'HR', label: '人力資源部' },
      { value: 'Finance', label: '財務部' },
      { value: 'Marketing', label: '行銷部' },
      { value: 'Sales', label: '業務部' },
      { value: 'Operations', label: '營運部' },
    ];
  }

  // 獲取職位選項
  getPositionOptions(): FilterOption[] {
    return [
      { value: 'manager', label: '經理' },
      { value: 'senior', label: '資深專員' },
      { value: 'specialist', label: '專員' },
      { value: 'assistant', label: '助理' },
      { value: 'intern', label: '實習生' },
    ];
  }

  // 實作 OptionsProvider 介面
  getOptions(): FilterOption[] {
    return [];
  }
}

// 建立單例實例
export const staffFilterService = new StaffFilterService();

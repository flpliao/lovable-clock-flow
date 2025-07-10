import {
  FilterGroup,
  ApiFilterRequest,
  ApiFilterResponse,
} from '@/components/common/AdvancedFilter/types';

// 基礎篩選服務類別
export abstract class BaseFilterService<T> {
  abstract filter(request: ApiFilterRequest): Promise<ApiFilterResponse<T>>;

  // 通用的本地篩選邏輯（用於開發階段或備用）
  protected applyLocalFilter(
    data: T[],
    conditionGroups: FilterGroup[],
    fieldMapper: (item: T, field: string) => string
  ): T[] {
    return data.filter(item => {
      return conditionGroups.every(group => {
        const groupConditions = group.conditions.filter(cond => cond.value.trim() !== '');
        if (groupConditions.length === 0) return true;

        const groupResults = groupConditions.map(condition => {
          const fieldValue = fieldMapper(item, condition.field);
          return this.evaluateCondition(fieldValue, condition.operator, condition.value);
        });

        return group.groupLogic === 'AND'
          ? groupResults.every(result => result)
          : groupResults.some(result => result);
      });
    });
  }

  // 評估單個條件
  private evaluateCondition(fieldValue: string, operator: string, conditionValue: string): boolean {
    const field = fieldValue.toLowerCase();
    const value = conditionValue.toLowerCase();

    switch (operator) {
      case 'equals':
        return field === value;
      case 'contains':
        return field.includes(value);
      case 'starts_with':
        return field.startsWith(value);
      case 'ends_with':
        return field.endsWith(value);
      case 'not_equals':
        return field !== value;
      case 'not_contains':
        return !field.includes(value);
      case 'is_empty':
        return field.trim() === '';
      case 'is_not_empty':
        return field.trim() !== '';
      default:
        return field.includes(value);
    }
  }

  // 分頁處理
  protected applyPagination<T>(
    data: T[],
    page: number = 1,
    pageSize: number = 10
  ): { data: T[]; total: number; totalPages: number; page: number; pageSize: number } {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize),
      page,
      pageSize,
    };
  }

  // 排序處理
  protected applySorting<T>(
    data: T[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
    sortMapper?: (item: T) => string | number
  ): T[] {
    if (!sortBy || !sortMapper) return data;

    return [...data].sort((a, b) => {
      const aValue = sortMapper(a);
      const bValue = sortMapper(b);

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}

// 通用的選項介面
export interface FilterOption {
  value: string;
  label: string;
}

// 選項提供者介面
export interface OptionsProvider {
  getOptions(): FilterOption[];
}

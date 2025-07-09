export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
  logic: 'AND' | 'OR';
}

export interface FilterGroup {
  id: string;
  groupLogic: 'AND' | 'OR';
  conditions: FilterCondition[];
}

export interface SearchField {
  value: string;
  label: string;
}

export interface Operator {
  value: string;
  label: string;
}

export interface AdvancedFilterProps<T> {
  // 篩選配置
  searchFields: SearchField[];
  operators: Operator[];

  // 篩選狀態
  conditionGroups: FilterGroup[];
  onConditionGroupsChange: (groups: FilterGroup[]) => void;

  // 資料相關
  data: T[];
  filteredData: T[];

  // 篩選函數
  applyFilter: (item: T, groups: FilterGroup[]) => boolean;

  // UI 配置
  title?: string;
  showAdvancedFilters: boolean;
  onShowAdvancedFiltersChange: (show: boolean) => void;

  // 可選的回調
  onClearAll?: () => void;
  onRefresh?: () => void;

  // 樣式配置
  className?: string;
}

export interface UseAdvancedFilterOptions<T> {
  data: T[];
  searchFields: SearchField[];
  operators: Operator[];
  applyFilter: (item: T, groups: FilterGroup[]) => boolean;
  onDataChange?: (filteredData: T[]) => void;
}

export interface UseAdvancedFilterReturn<T> {
  conditionGroups: FilterGroup[];
  filteredData: T[];
  appliedConditionCount: number;
  showAdvancedFilters: boolean;

  // 操作方法
  setConditionGroups: (groups: FilterGroup[]) => void;
  addConditionGroup: () => void;
  removeConditionGroup: (groupId: string) => void;
  addConditionToGroup: (groupId: string) => void;
  removeCondition: (groupId: string, conditionIdx: number) => void;
  updateCondition: (groupId: string, conditionIdx: number, key: string, value: string) => void;
  updateConditionLogic: (groupId: string, conditionIdx: number, logic: 'AND' | 'OR') => void;
  updateGroupLogic: (groupId: string, groupLogic: 'AND' | 'OR') => void;
  clearAllConditions: () => void;
  setShowAdvancedFilters: (show: boolean) => void;
}

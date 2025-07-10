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
  // 新增：下拉選單配置
  type?: 'input' | 'select' | 'mixed'; // 欄位類型：輸入框、下拉選單、或混合模式
  options?: Array<{ value: string; label: string }>; // 下拉選單選項
  placeholder?: string; // 自訂提示文字
  allowCustomInput?: boolean; // 是否允許自訂輸入（僅在 mixed 模式下有效）
  forceSelect?: boolean; // 是否強制只能選擇（不能自訂輸入）
}

export interface Operator {
  value: string;
  label: string;
}

// 新增：API篩選相關型別
export interface ApiFilterRequest {
  conditionGroups: FilterGroup[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiFilterResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 抽象API篩選服務介面
export interface FilterApiService<T> {
  filter(request: ApiFilterRequest): Promise<ApiFilterResponse<T>>;
}

// 分頁資訊
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdvancedFilterProps<T> {
  // 篩選配置
  searchFields: SearchField[];
  operators: Operator[];

  // 篩選狀態
  conditionGroups: FilterGroup[];
  onConditionGroupsChange: (groups: FilterGroup[]) => void;

  // 資料相關 - 改為可選，支援API模式
  data?: T[];
  filteredData?: T[];

  // 篩選函數 - 改為可選，API模式不需要
  applyFilter?: (item: T, groups: FilterGroup[]) => boolean;

  // 新增：API模式配置
  apiService?: FilterApiService<T>;
  loading?: boolean;
  pagination?: PaginationConfig;
  onPaginationChange?: (page: number, pageSize: number) => void;

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
  // 原有選項
  data?: T[];
  searchFields: SearchField[];
  operators: Operator[];
  applyFilter?: (item: T, groups: FilterGroup[]) => boolean;
  onDataChange?: (filteredData: T[]) => void;

  // 新增：API模式選項
  apiService?: FilterApiService<T>;
  serviceType?: 'staff' | 'overtime' | 'position' | 'announcement';
  initialPageSize?: number;
  enablePagination?: boolean;
}

export interface UseAdvancedFilterReturn<T> {
  conditionGroups: FilterGroup[];
  filteredData: T[];
  appliedConditionCount: number;
  showAdvancedFilters: boolean;

  // 新增：API模式返回值
  loading: boolean;
  pagination?: PaginationConfig;

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

  // 新增：API模式方法
  refreshData: () => Promise<void>;
  changePage: (page: number) => Promise<void>;
  changePageSize: (pageSize: number) => Promise<void>;
}

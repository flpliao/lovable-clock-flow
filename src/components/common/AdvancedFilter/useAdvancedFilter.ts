import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FilterGroup,
  FilterCondition,
  UseAdvancedFilterOptions,
  UseAdvancedFilterReturn,
  ApiFilterRequest,
  PaginationConfig,
} from './types';

export function useAdvancedFilter<T>({
  data = [],
  searchFields,
  operators,
  applyFilter,
  onDataChange,
  apiService,
  initialPageSize = 50,
  enablePagination = false,
}: UseAdvancedFilterOptions<T>): UseAdvancedFilterReturn<T> {
  // 篩選狀態
  const [conditionGroups, setConditionGroups] = useState<FilterGroup[]>([
    {
      id: 'group-1',
      groupLogic: 'AND',
      conditions: [
        {
          field: searchFields[0]?.value || '',
          operator: operators[0]?.value || '',
          value: '',
          logic: 'AND',
        },
      ],
    },
  ]);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // API模式狀態
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 0,
  });

  // 判斷是否為API模式
  const isApiMode = Boolean(apiService);

  // 計算已套用條件數
  const appliedConditionCount = useMemo(() => {
    return conditionGroups.reduce(
      (total, group) => total + group.conditions.filter(c => c.value.trim() !== '').length,
      0
    );
  }, [conditionGroups]);

  // API請求函數
  const fetchData = useCallback(
    async (groups?: FilterGroup[], page?: number, pageSize?: number) => {
      if (!isApiMode || !apiService) return;

      setLoading(true);
      try {
        const request: ApiFilterRequest = {
          conditionGroups: groups || conditionGroups,
          page: page || pagination.page,
          pageSize: pageSize || pagination.pageSize,
        };

        console.log('🔍 useAdvancedFilter: 執行API篩選請求', request);
        const response = await apiService.filter(request);

        setApiData(response.data);
        setPagination({
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        });

        console.log('✅ useAdvancedFilter: API篩選完成', {
          returned: response.data.length,
          total: response.total,
          page: response.page,
        });
      } catch (error) {
        console.error('❌ useAdvancedFilter: API篩選失敗:', error);
        setApiData([]);
        setPagination({
          page: 1,
          pageSize: initialPageSize,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [isApiMode, apiService, conditionGroups, pagination.page, pagination.pageSize, initialPageSize]
  );

  // 計算篩選後的資料
  const filteredData = useMemo(() => {
    if (isApiMode) {
      return apiData;
    } else {
      // 原有的前端篩選邏輯
      if (showAdvancedFilters && appliedConditionCount > 0 && applyFilter) {
        return data.filter(item => applyFilter(item, conditionGroups));
      }
      return data;
    }
  }, [
    isApiMode,
    apiData,
    data,
    conditionGroups,
    showAdvancedFilters,
    appliedConditionCount,
    applyFilter,
  ]);

  // 當條件變更時觸發API請求（僅在API模式且顯示篩選器時）
  useEffect(() => {
    if (isApiMode && showAdvancedFilters && appliedConditionCount > 0) {
      fetchData();
    }
  }, [conditionGroups, showAdvancedFilters, appliedConditionCount, fetchData, isApiMode]);

  // 初始載入資料（API模式）
  useEffect(() => {
    if (isApiMode && !showAdvancedFilters) {
      fetchData([]);
    }
  }, [isApiMode, showAdvancedFilters, fetchData]);

  // 通知父組件資料變更
  useEffect(() => {
    onDataChange?.(filteredData);
  }, [filteredData, onDataChange]);

  // 新增條件組
  const addConditionGroup = () => {
    const newGroupId = `group-${Date.now()}`;
    const newGroups = [
      ...conditionGroups,
      {
        id: newGroupId,
        groupLogic: 'AND' as const,
        conditions: [
          {
            field: searchFields[0]?.value || '',
            operator: operators[0]?.value || '',
            value: '',
            logic: 'AND' as const,
          },
        ],
      },
    ];
    setConditionGroups(newGroups);
  };

  // 刪除條件組
  const removeConditionGroup = (groupId: string) => {
    if (conditionGroups.length > 1) {
      const newGroups = conditionGroups.filter(g => g.id !== groupId);
      setConditionGroups(newGroups);
    }
  };

  // 新增條件到組
  const addConditionToGroup = (groupId: string) => {
    const newGroups = conditionGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            conditions: [
              ...group.conditions,
              {
                field: searchFields[0]?.value || '',
                operator: operators[0]?.value || '',
                value: '',
                logic: 'AND' as const,
              },
            ],
          }
        : group
    );
    setConditionGroups(newGroups);
  };

  // 刪除條件
  const removeCondition = (groupId: string, conditionIdx: number) => {
    const newGroups = conditionGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            conditions: group.conditions.filter((_, i) => i !== conditionIdx),
          }
        : group
    );
    setConditionGroups(newGroups);
  };

  // 更新條件
  const updateCondition = (groupId: string, conditionIdx: number, key: string, value: string) => {
    const newGroups = conditionGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            conditions: group.conditions.map((cond, i) =>
              i === conditionIdx ? { ...cond, [key]: value } : cond
            ),
          }
        : group
    );
    setConditionGroups(newGroups);
  };

  // 更新條件邏輯
  const updateConditionLogic = (groupId: string, conditionIdx: number, logic: 'AND' | 'OR') => {
    const newGroups = conditionGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            conditions: group.conditions.map((cond, i) =>
              i === conditionIdx ? { ...cond, logic } : cond
            ),
          }
        : group
    );
    setConditionGroups(newGroups);
  };

  // 更新組間邏輯
  const updateGroupLogic = (groupId: string, groupLogic: 'AND' | 'OR') => {
    const newGroups = conditionGroups.map(group =>
      group.id === groupId ? { ...group, groupLogic } : group
    );
    setConditionGroups(newGroups);
  };

  // 清除全部條件
  const clearAllConditions = () => {
    const resetGroups = [
      {
        id: 'group-1',
        groupLogic: 'AND' as const,
        conditions: [
          {
            field: searchFields[0]?.value || '',
            operator: operators[0]?.value || '',
            value: '',
            logic: 'AND' as const,
          },
        ],
      },
    ];
    setConditionGroups(resetGroups);

    // API模式下重新載入資料
    if (isApiMode) {
      fetchData([], 1, pagination.pageSize);
    }
  };

  // API模式專用方法
  const refreshData = async () => {
    if (isApiMode) {
      await fetchData();
    }
  };

  const changePage = async (page: number) => {
    if (isApiMode) {
      await fetchData(conditionGroups, page, pagination.pageSize);
    }
  };

  const changePageSize = async (pageSize: number) => {
    if (isApiMode) {
      await fetchData(conditionGroups, 1, pageSize);
    }
  };

  return {
    conditionGroups,
    filteredData,
    appliedConditionCount,
    showAdvancedFilters,
    loading,
    pagination: enablePagination ? pagination : undefined,

    // 操作方法
    setConditionGroups,
    addConditionGroup,
    removeConditionGroup,
    addConditionToGroup,
    removeCondition,
    updateCondition,
    updateConditionLogic,
    updateGroupLogic,
    clearAllConditions,
    setShowAdvancedFilters,

    // API模式方法
    refreshData,
    changePage,
    changePageSize,
  };
}

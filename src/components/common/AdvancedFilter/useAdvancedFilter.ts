import { useState, useEffect, useMemo } from 'react';
import {
  FilterGroup,
  FilterCondition,
  UseAdvancedFilterOptions,
  UseAdvancedFilterReturn,
} from './types';

export function useAdvancedFilter<T>({
  data,
  searchFields,
  operators,
  applyFilter,
  onDataChange,
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

  // 計算已套用條件數
  const appliedConditionCount = useMemo(() => {
    return conditionGroups.reduce(
      (total, group) => total + group.conditions.filter(c => c.value.trim() !== '').length,
      0
    );
  }, [conditionGroups]);

  // 篩選資料
  const filteredData = useMemo(() => {
    if (showAdvancedFilters && appliedConditionCount > 0) {
      return data.filter(item => applyFilter(item, conditionGroups));
    }
    return data;
  }, [data, conditionGroups, showAdvancedFilters, appliedConditionCount, applyFilter]);

  // 通知父組件資料變更
  useEffect(() => {
    onDataChange?.(filteredData);
  }, [filteredData, onDataChange]);

  // 新增條件組
  const addConditionGroup = () => {
    const newGroupId = `group-${Date.now()}`;
    setConditionGroups([
      ...conditionGroups,
      {
        id: newGroupId,
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
  };

  // 刪除條件組
  const removeConditionGroup = (groupId: string) => {
    if (conditionGroups.length > 1) {
      setConditionGroups(conditionGroups.filter(g => g.id !== groupId));
    }
  };

  // 新增條件到組
  const addConditionToGroup = (groupId: string) => {
    setConditionGroups(
      conditionGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: [
                ...group.conditions,
                {
                  field: searchFields[0]?.value || '',
                  operator: operators[0]?.value || '',
                  value: '',
                  logic: 'AND',
                },
              ],
            }
          : group
      )
    );
  };

  // 刪除條件
  const removeCondition = (groupId: string, conditionIdx: number) => {
    setConditionGroups(
      conditionGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter((_, i) => i !== conditionIdx),
            }
          : group
      )
    );
  };

  // 更新條件
  const updateCondition = (groupId: string, conditionIdx: number, key: string, value: string) => {
    setConditionGroups(
      conditionGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((cond, i) =>
                i === conditionIdx ? { ...cond, [key]: value } : cond
              ),
            }
          : group
      )
    );
  };

  // 更新條件邏輯
  const updateConditionLogic = (groupId: string, conditionIdx: number, logic: 'AND' | 'OR') => {
    setConditionGroups(
      conditionGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((cond, i) =>
                i === conditionIdx ? { ...cond, logic } : cond
              ),
            }
          : group
      )
    );
  };

  // 更新組間邏輯
  const updateGroupLogic = (groupId: string, groupLogic: 'AND' | 'OR') => {
    setConditionGroups(
      conditionGroups.map(group => (group.id === groupId ? { ...group, groupLogic } : group))
    );
  };

  // 清除全部條件
  const clearAllConditions = () => {
    setConditionGroups([
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
  };

  return {
    conditionGroups,
    filteredData,
    appliedConditionCount,
    showAdvancedFilters,

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
  };
}

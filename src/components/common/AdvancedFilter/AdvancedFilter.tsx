import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X, Search, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { AdvancedFilterProps } from './types';

export function AdvancedFilter<T>({
  searchFields,
  operators,
  conditionGroups,
  onConditionGroupsChange,
  data = [],
  filteredData = [],
  apiService,
  loading = false,
  pagination,
  onPaginationChange,
  title = '進階篩選',
  showAdvancedFilters,
  onShowAdvancedFiltersChange,
  onClearAll,
  onRefresh,
  className = '',
}: AdvancedFilterProps<T>) {
  // 混合模式狀態管理
  const [mixedModeStates, setMixedModeStates] = useState<Record<string, 'select' | 'input'>>({});
  // 新增條件組
  const addConditionGroup = () => {
    const newGroupId = `group-${Date.now()}`;
    onConditionGroupsChange([
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
      onConditionGroupsChange(conditionGroups.filter(g => g.id !== groupId));
    }
  };

  // 新增條件到組
  const addConditionToGroup = (groupId: string) => {
    onConditionGroupsChange(
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
    onConditionGroupsChange(
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
    onConditionGroupsChange(
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
    onConditionGroupsChange(
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
    onConditionGroupsChange(
      conditionGroups.map(group => (group.id === groupId ? { ...group, groupLogic } : group))
    );
  };

  // 清除全部條件
  const clearAllConditions = () => {
    onConditionGroupsChange([
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
    onClearAll?.();
  };

  // 計算已套用條件數
  const appliedConditionCount = conditionGroups.reduce(
    (total, group) => total + group.conditions.filter(c => c.value.trim() !== '').length,
    0
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 主要搜尋列 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜尋..."
            className="pl-10 bg-white/70 border-white/40 backdrop-blur-sm"
            disabled
          />
        </div>

        {/* 進階篩選按鈕 */}
        <Button
          variant="outline"
          onClick={() => onShowAdvancedFiltersChange(!showAdvancedFilters)}
          className={`bg-white/60 border-white/40 hover:bg-white/80 ${
            showAdvancedFilters ? 'bg-blue-100/80 border-blue-300/60' : ''
          }`}
        >
          <Filter className="h-4 w-4 mr-1" />
          篩選
        </Button>

        {/* 重新整理按鈕 */}
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="bg-white/60 border-white/40 hover:bg-white/80"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* 進階篩選區域 */}
      {showAdvancedFilters && (
        <div className="bg-white/40 rounded-lg p-4 border border-white/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              {title}
            </h3>
            {appliedConditionCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllConditions}
                className="text-gray-500 hover:text-gray-700 h-6 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                清除全部
              </Button>
            )}
          </div>

          {/* 多條件組合搜尋 UI */}
          <div className="space-y-3 mb-3">
            {conditionGroups.map((group, groupIdx) => (
              <div key={group.id} className="border border-gray-200/50 rounded-lg p-3 bg-white/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">條件組 {groupIdx + 1}</span>
                    {/* 組間邏輯選擇 */}
                    {groupIdx > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">與前組</span>
                        <Button
                          variant={group.groupLogic === 'AND' ? 'outline' : 'secondary'}
                          size="sm"
                          onClick={() =>
                            updateGroupLogic(group.id, group.groupLogic === 'AND' ? 'OR' : 'AND')
                          }
                          className="w-12 bg-white/70 border-white/40 hover:bg-white/80"
                        >
                          {group.groupLogic}
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* 移除組 */}
                  {conditionGroups.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConditionGroup(group.id)}
                      className="text-red-500 h-6 px-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      移除組
                    </Button>
                  )}
                </div>
                {/* 組內條件 */}
                <div className="space-y-2">
                  {group.conditions.map((cond, condIdx) => (
                    <div key={condIdx} className="flex items-center gap-2">
                      {/* 邏輯選擇（第一個條件顯示為 "-"） */}
                      {condIdx === 0 ? (
                        <div className="w-12 text-center text-xs text-gray-500 bg-gray-100/70 rounded-md py-2 px-1">
                          -
                        </div>
                      ) : (
                        <Button
                          variant={cond.logic === 'AND' ? 'outline' : 'secondary'}
                          size="sm"
                          onClick={() =>
                            updateConditionLogic(
                              group.id,
                              condIdx,
                              cond.logic === 'AND' ? 'OR' : 'AND'
                            )
                          }
                          className="w-12 bg-white/70 border-white/40 hover:bg-white/80"
                        >
                          {cond.logic}
                        </Button>
                      )}
                      {/* 欄位選擇 */}
                      <Select
                        value={cond.field}
                        onValueChange={val => updateCondition(group.id, condIdx, 'field', val)}
                      >
                        <SelectTrigger className="w-28 bg-white/70 border-white/40 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {searchFields.map(f => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* 運算子選擇 */}
                      <Select
                        value={cond.operator}
                        onValueChange={val => updateCondition(group.id, condIdx, 'operator', val)}
                      >
                        <SelectTrigger className="w-24 bg-white/70 border-white/40 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map(op => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* 值輸入 */}
                      {(() => {
                        const currentField = searchFields.find(f => f.value === cond.field);
                        const fieldType = currentField?.type || 'input';
                        const currentMode = mixedModeStates[`${group.id}-${condIdx}`] || 'select';

                        // 混合模式：用戶可以切換下拉選單和輸入框
                        if (fieldType === 'mixed' && currentField?.options) {
                          return (
                            <div className="flex items-center gap-1">
                              <div className="relative">
                                {currentMode === 'select' ? (
                                  <Select
                                    value={cond.value}
                                    onValueChange={val =>
                                      updateCondition(group.id, condIdx, 'value', val)
                                    }
                                  >
                                    <SelectTrigger className="w-36 bg-white/70 border-white/40 backdrop-blur-sm">
                                      <SelectValue
                                        placeholder={currentField?.placeholder || '請選擇'}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentField.options.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    value={cond.value}
                                    onChange={e =>
                                      updateCondition(group.id, condIdx, 'value', e.target.value)
                                    }
                                    className="w-36 bg-white/70 border-white/40 backdrop-blur-sm"
                                    placeholder={currentField?.placeholder || '請輸入內容'}
                                  />
                                )}
                              </div>

                              {/* 切換按鈕 */}
                              {currentField.allowCustomInput !== false && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newMode = currentMode === 'select' ? 'input' : 'select';
                                    setMixedModeStates(prev => ({
                                      ...prev,
                                      [`${group.id}-${condIdx}`]: newMode,
                                    }));
                                    // 切換模式時清空值
                                    updateCondition(group.id, condIdx, 'value', '');
                                  }}
                                  className="h-8 w-8 p-0 bg-white/50 border-white/30 hover:bg-white/70"
                                  title={
                                    currentMode === 'select' ? '切換為輸入模式' : '切換為選擇模式'
                                  }
                                >
                                  {currentMode === 'select' ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronUp className="h-3 w-3" />
                                  )}
                                </Button>
                              )}
                            </div>
                          );
                        }

                        // 純下拉選單模式
                        if (fieldType === 'select' && currentField?.options) {
                          return (
                            <Select
                              value={cond.value}
                              onValueChange={val =>
                                updateCondition(group.id, condIdx, 'value', val)
                              }
                            >
                              <SelectTrigger className="w-40 bg-white/70 border-white/40 backdrop-blur-sm">
                                <SelectValue placeholder={currentField?.placeholder || '請選擇'} />
                              </SelectTrigger>
                              <SelectContent>
                                {currentField.options.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }

                        // 純輸入框模式
                        return (
                          <Input
                            value={cond.value}
                            onChange={e =>
                              updateCondition(group.id, condIdx, 'value', e.target.value)
                            }
                            className="w-40 bg-white/70 border-white/40 backdrop-blur-sm"
                            placeholder={currentField?.placeholder || '請輸入內容'}
                          />
                        );
                      })()}
                      {/* 移除條件 */}
                      {group.conditions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCondition(group.id, condIdx)}
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* 新增條件到組 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addConditionToGroup(group.id)}
                    className="mt-2"
                  >
                    + 新增條件
                  </Button>
                </div>
              </div>
            ))}
            {/* 新增條件組 */}
            <Button variant="outline" size="sm" onClick={addConditionGroup} className="mt-2">
              + 新增條件組
            </Button>
          </div>

          {/* 篩選結果統計 */}
          <div className="mt-3 pt-3 border-t border-white/30">
            <div className="flex items-center justify-between text-xs text-gray-600">
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  <span>載入中...</span>
                </div>
              ) : pagination ? (
                <span>
                  搜尋結果：第 {pagination.page} 頁，共 {pagination.total} 筆資料
                  {pagination.totalPages > 1 && ` (共 ${pagination.totalPages} 頁)`}
                </span>
              ) : (
                <span>
                  搜尋結果：{filteredData.length} / {data.length} 筆資料
                </span>
              )}
              {appliedConditionCount > 0 && !loading && (
                <span className="text-blue-600 font-medium">
                  已套用 {appliedConditionCount} 個條件
                </span>
              )}
            </div>

            {/* 分頁控制 */}
            {pagination && pagination.totalPages > 1 && onPaginationChange && (
              <div className="flex items-center justify-center mt-3 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginationChange(pagination.page - 1, pagination.pageSize)}
                  disabled={pagination.page <= 1 || loading}
                  className="bg-white/70 border-white/40 hover:bg-white/80"
                >
                  上一頁
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const startPage = Math.max(1, pagination.page - 2);
                    const pageNumber = startPage + i;
                    if (pageNumber > pagination.totalPages) return null;

                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPaginationChange(pageNumber, pagination.pageSize)}
                        disabled={loading}
                        className="w-8 h-8 p-0 bg-white/70 border-white/40 hover:bg-white/80"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginationChange(pagination.page + 1, pagination.pageSize)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                  className="bg-white/70 border-white/40 hover:bg-white/80"
                >
                  下一頁
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 篩選狀態指示器 */}
      {appliedConditionCount > 0 && !showAdvancedFilters && (
        <div className="flex items-center justify-between bg-blue-50/60 rounded-lg p-2 border border-blue-200/40">
          <div className="flex items-center space-x-2">
            <Filter className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-700">已套用篩選條件</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllConditions}
            className="text-blue-600 hover:text-blue-800 h-6 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            清除
          </Button>
        </div>
      )}
    </div>
  );
}

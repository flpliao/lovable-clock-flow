import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { usePositionManagementContext } from './PositionManagementContext';
import {
  AdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import { Position } from './types';

const PositionFilters = () => {
  const {
    positions,
    filteredPositions,
    conditionGroups,
    setConditionGroups,
    showAdvancedFilters,
    setShowAdvancedFilters,
    clearAllConditions,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refreshPositions,
  } = usePositionManagementContext();

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'name', label: '職位名稱' },
    { value: 'description', label: '說明' },
    { value: 'level', label: '職級' },
  ];

  // 篩選函數
  const applyPositionFilter = (position: Position, conditionGroups: FilterGroup[]) => {
    return applyMultiConditionFilter(position, conditionGroups, (item, field) => {
      return (item[field as keyof Position] || '').toString();
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else {
      return <ArrowDown className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 使用通用篩選組件 */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={positions}
        filteredData={filteredPositions}
        applyFilter={applyPositionFilter}
        title="職位篩選"
        showAdvancedFilters={showAdvancedFilters}
        onShowAdvancedFiltersChange={setShowAdvancedFilters}
        onClearAll={clearAllConditions}
        onRefresh={refreshPositions}
      />

      {/* 排序控制 */}
      <Card className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">排序設定</span>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: 'name' | 'level') => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-white/60 border-white/40 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 border-white/60">
                <SelectItem value="name">按名稱</SelectItem>
                <SelectItem value="level">按職級</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="px-3 bg-white/60 border-white/40 text-gray-900 hover:bg-white/70"
            >
              {getSortIcon()}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PositionFilters;

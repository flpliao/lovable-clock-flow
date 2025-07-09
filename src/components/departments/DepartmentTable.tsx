import React from 'react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import DepartmentGrid from './DepartmentGrid';
import {
  AdvancedFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import { Department } from './types';
import { applyMultiConditionFilter } from '@/components/common/AdvancedFilter/filterUtils';

const DepartmentTable = () => {
  const {
    filteredDepartments,
    conditionGroups,
    setConditionGroups,
    showAdvancedFilters,
    setShowAdvancedFilters,
    clearAllConditions,
    openEditDialog,
    handleDeleteDepartment,
    canManage,
    loading,
  } = useDepartmentManagementContext();

  const { checkInDistanceLimit } = useSystemSettings();

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'name', label: '部門名稱' },
    { value: 'type', label: '部門類型' },
    { value: 'location', label: '地址' },
    { value: 'manager_name', label: '主管姓名' },
  ];

  // 篩選函數
  const applyDepartmentFilter = (department: Department, conditionGroups: FilterGroup[]) => {
    return applyMultiConditionFilter(department, conditionGroups, (item, field) => {
      return (item[field as keyof Department] || '').toString();
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-white">載入中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 使用通用篩選組件 */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={filteredDepartments}
        filteredData={filteredDepartments}
        applyFilter={applyDepartmentFilter}
        title="部門篩選"
        showAdvancedFilters={showAdvancedFilters}
        onShowAdvancedFiltersChange={setShowAdvancedFilters}
        onClearAll={clearAllConditions}
      />

      {/* 部門網格 */}
      <DepartmentGrid
        departments={filteredDepartments}
        canManage={canManage}
        onEdit={openEditDialog}
        onDelete={handleDeleteDepartment}
        checkInDistanceLimit={checkInDistanceLimit}
        searchFilter=""
      />
    </div>
  );
};

export default DepartmentTable;

import React, { useMemo } from 'react';
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

// 部門 API 篩選服務
class DepartmentApiFilterService {
  async filter(request: {
    conditionGroups: FilterGroup[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Department[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 這裡可以實作真正的 API 呼叫
      // 目前先使用本地篩選作為示範
      // 注意：實際實作時需要從 API 獲取資料

      // 暫時返回空資料，實際實作時需要從 API 獲取
      return {
        data: [],
        total: 0,
        totalPages: 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('篩選部門失敗:', error);
      throw error;
    }
  }

  // 獲取部門類型選項
  getDepartmentTypeOptions() {
    return [
      { value: 'main', label: '主要部門' },
      { value: 'sub', label: '子部門' },
      { value: 'project', label: '專案部門' },
      { value: 'temporary', label: '臨時部門' },
    ];
  }
}

const departmentApiFilterService = new DepartmentApiFilterService();

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

  // 定義搜尋欄位（包含下拉選單配置）
  const SEARCH_FIELDS: SearchField[] = useMemo(
    () => [
      {
        value: 'name',
        label: '部門名稱',
        type: 'input',
        placeholder: '請輸入部門名稱',
      },
      {
        value: 'type',
        label: '部門類型',
        type: 'select',
        options: departmentApiFilterService.getDepartmentTypeOptions(),
        placeholder: '請選擇部門類型',
      },
      {
        value: 'location',
        label: '地址',
        type: 'input',
        placeholder: '請輸入地址',
      },
      {
        value: 'manager_name',
        label: '主管姓名',
        type: 'input',
        placeholder: '請輸入主管姓名',
      },
    ],
    []
  );

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
      {/* 使用通用篩選組件（API 模式） */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={filteredDepartments}
        filteredData={filteredDepartments}
        apiService={departmentApiFilterService}
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

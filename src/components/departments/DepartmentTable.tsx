
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import DepartmentGrid from './DepartmentGrid';

const DepartmentTable = () => {
  const {
    filteredDepartments,
    searchFilter,
    setSearchFilter,
    openEditDialog,
    handleDeleteDepartment,
    canManage,
    loading
  } = useDepartmentManagementContext();

  const { checkInDistanceLimit } = useSystemSettings();

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
      {/* 搜尋區塊 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="搜尋部門名稱、類型或地址..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-10 bg-white/60 border-white/40 placeholder:text-gray-500"
        />
      </div>

      {/* 部門網格 */}
      <DepartmentGrid
        departments={filteredDepartments}
        canManage={canManage}
        onEdit={openEditDialog}
        onDelete={handleDeleteDepartment}
        checkInDistanceLimit={checkInDistanceLimit}
        searchFilter={searchFilter}
      />
    </div>
  );
};

export default DepartmentTable;

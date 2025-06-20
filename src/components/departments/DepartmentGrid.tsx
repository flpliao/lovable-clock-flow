
import React from 'react';
import { Department } from './types';
import DepartmentCard from './DepartmentCard';
import { Building } from 'lucide-react';

interface DepartmentGridProps {
  departments: Department[];
  canManage: boolean;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
  checkInDistanceLimit: number;
  searchFilter: string;
}

const DepartmentGrid: React.FC<DepartmentGridProps> = ({
  departments,
  canManage,
  onEdit,
  onDelete,
  checkInDistanceLimit,
  searchFilter
}) => {
  if (departments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <Building className="h-10 w-10 text-white/60" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          {searchFilter ? '找不到符合條件的部門' : '尚未建立部門'}
        </h3>
        <p className="text-white/70 text-sm">
          {searchFilter ? '請嘗試其他搜尋條件' : '請新增第一個部門'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {departments.map((department) => (
        <DepartmentCard
          key={department.id}
          department={department}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
          checkInDistanceLimit={checkInDistanceLimit}
        />
      ))}
    </div>
  );
};

export default DepartmentGrid;

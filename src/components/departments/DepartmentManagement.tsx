
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import { Building } from 'lucide-react';

const DepartmentManagement = () => {
  const { isAdmin, currentUser } = useUser();

  // 檢查權限：管理員或廖俊雄可以管理部門
  const canManageDepartments = isAdmin() || currentUser?.name === '廖俊雄';

  console.log('🔍 部門管理權限檢查:', {
    currentUser: currentUser?.name,
    isAdmin: isAdmin(),
    canManageDepartments
  });

  return (
    <div className="space-y-6">
      {/* 部門管理區塊 - 半透明設計 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">部門門市管理</h2>
              <p className="text-gray-700 text-sm mt-1">管理組織架構與部門資訊</p>
            </div>
          </div>
          {canManageDepartments && (
            <AddDepartmentDialog />
          )}
        </div>
        
        <DepartmentTable />
      </div>

      <EditDepartmentDialog />
    </div>
  );
};

export default DepartmentManagement;

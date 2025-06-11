
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { DepartmentManagementProvider } from './DepartmentManagementContext';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import { Building, Plus, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DepartmentManagement = () => {
  const { isAdmin } = useUser();

  return (
    <DepartmentManagementProvider>
      <div className="space-y-6 mt-6">
        {/* 部門管理區塊 */}
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white drop-shadow-md">
                  部門門市管理
                </h3>
                <p className="text-white/80 text-sm mt-1">管理組織架構與部門資訊</p>
              </div>
            </div>
            {isAdmin() && (
              <AddDepartmentDialog />
            )}
          </div>
          
          <DepartmentTable />
        </div>

        <EditDepartmentDialog />
      </div>
    </DepartmentManagementProvider>
  );
};

export default DepartmentManagement;

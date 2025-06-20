
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Search, Users, Edit, Trash, Navigation } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import DepartmentGPSStatus from './DepartmentGPSStatus';
import DepartmentGPSConverter from './DepartmentGPSConverter';

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
      <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-700">載入中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 搜尋區塊 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="搜尋部門名稱、類型、地址或負責人..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10 bg-white/60 border-white/40"
          />
        </div>
      </div>

      {/* 部門列表 */}
      <div className="grid gap-4">
        {filteredDepartments.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg">
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">尚無部門資料</h3>
              <p className="text-gray-600">
                {searchFilter ? '找不到符合條件的部門' : '請新增第一個部門'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDepartments.map((department) => (
            <Card key={department.id} className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/90 rounded-lg shadow-sm">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 text-lg">{department.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-blue-100/60 text-blue-800 text-xs rounded-full font-medium">
                          {department.type}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 text-sm">
                          <Users className="h-3 w-3" />
                          {department.staff_count} 人
                        </span>
                      </div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(department)}
                        className="bg-white/40 border-white/30 text-gray-700 hover:bg-white/60"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="bg-red-50/40 border-red-200/30 text-red-700 hover:bg-red-100/60"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* 地址資訊 */}
                  {department.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{department.location}</span>
                    </div>
                  )}

                  {/* 負責人資訊 */}
                  {department.manager_name && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        負責人：{department.manager_name}
                        {department.manager_contact && ` (${department.manager_contact})`}
                      </span>
                    </div>
                  )}

                  {/* GPS 狀態和允許範圍 */}
                  <div className="flex items-center justify-between bg-white/40 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <DepartmentGPSStatus department={department} />
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-700">
                          允許範圍：{checkInDistanceLimit}公尺
                        </span>
                      </div>
                    </div>
                    {canManage && (
                      <DepartmentGPSConverter
                        department={department}
                      />
                    )}
                  </div>

                  {/* GPS 座標資訊 */}
                  {department.latitude && department.longitude && (
                    <div className="text-xs text-gray-600 bg-white/20 rounded p-2">
                      GPS座標：({department.latitude.toFixed(6)}, {department.longitude.toFixed(6)})
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentTable;

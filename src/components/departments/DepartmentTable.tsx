
import React from 'react';
import { Pencil, Trash2, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import DepartmentGPSConverter from './DepartmentGPSConverter';

const DepartmentTable = () => {
  const {
    filteredDepartments,
    loading,
    canManage,
    openEditDialog,
    handleDeleteDepartment,
    searchFilter,
    setSearchFilter
  } = useDepartmentManagementContext();

  const getDepartmentTypeLabel = (type: string) => {
    const typeMap = {
      'headquarters': '總公司',
      'branch': '分公司',
      'store': '門市',
      'department': '部門'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getDepartmentTypeBadge = (type: string) => {
    const colorMap = {
      'headquarters': 'bg-blue-500',
      'branch': 'bg-green-500',
      'store': 'bg-purple-500',
      'department': 'bg-orange-500'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜尋欄位 */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="搜尋部門名稱、類型、位置或主管..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full px-4 py-2 border border-white/30 rounded-xl bg-white/20 backdrop-blur-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="text-sm text-gray-700">
          共 {filteredDepartments.length} 個部門
        </div>
      </div>

      {/* 部門卡片列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((dept) => (
          <Card key={dept.id} className="backdrop-blur-xl bg-white/30 border border-white/30 shadow-lg">
            <CardContent className="p-4 space-y-4">
              {/* 部門基本資訊 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    <Badge className={`${getDepartmentTypeBadge(dept.type)} text-white text-xs`}>
                      {getDepartmentTypeLabel(dept.type)}
                    </Badge>
                  </div>
                  
                  {dept.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>{dept.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{dept.staff_count} 人</span>
                  </div>
                </div>

                {canManage && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(dept)}
                      className="h-8 w-8 p-0 hover:bg-white/20"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* 主管資訊 */}
              {dept.manager_name && (
                <div className="text-sm">
                  <span className="text-gray-600">主管：</span>
                  <span className="text-gray-900">{dept.manager_name}</span>
                  {dept.manager_contact && (
                    <span className="text-gray-600 ml-2">({dept.manager_contact})</span>
                  )}
                </div>
              )}

              {/* GPS 轉換器 */}
              {canManage && (
                <div className="border-t border-white/20 pt-3">
                  <DepartmentGPSConverter department={dept} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          {searchFilter ? '沒有找到符合條件的部門' : '尚未新增任何部門'}
        </div>
      )}
    </div>
  );
};

export default DepartmentTable;

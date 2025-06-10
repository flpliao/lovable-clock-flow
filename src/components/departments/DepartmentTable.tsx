
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Building, MapPin, User, Users, Phone } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

const DepartmentTable = () => {
  const { 
    filteredDepartments, 
    openEditDialog, 
    handleDeleteDepartment 
  } = useDepartmentManagementContext();
  
  const { isAdmin } = useUser();
  const isMobile = useIsMobile();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'headquarters':
        return '總部';
      case 'branch':
        return '分部';
      case 'store':
        return '門市';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'headquarters':
        return 'bg-blue-500/70 text-white';
      case 'branch':
        return 'bg-green-500/70 text-white';
      case 'store':
        return 'bg-orange-500/70 text-white';
      default:
        return 'bg-gray-500/70 text-white';
    }
  };

  // 如果沒有部門資料
  if (filteredDepartments.length === 0) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 mx-auto text-white/50 mb-4" />
        <p className="text-white/70">尚未建立部門資料</p>
      </div>
    );
  }

  // 手機版卡片視圖
  if (isMobile) {
    return (
      <div className="space-y-4">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/70 rounded-lg">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{department.name}</h4>
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs ${getTypeColor(department.type)}`}>
                    {getTypeLabel(department.type)}
                  </div>
                </div>
              </div>
              {isAdmin() && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg h-8 w-8 p-0"
                    onClick={() => openEditDialog(department)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg h-8 w-8 p-0"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              {department.location && (
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-3 w-3" />
                  {department.location}
                </div>
              )}
              {department.manager_name && (
                <div className="flex items-center gap-2 text-white/80">
                  <User className="h-3 w-3" />
                  {department.manager_name}
                  {department.manager_contact && (
                    <span className="text-white/60">({department.manager_contact})</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-white/80">
                <Users className="h-3 w-3" />
                {department.staff_count || 0} 人
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 桌面版表格視圖
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                部門名稱
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4" />
                類型
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                地點
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                負責人
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                人數
              </div>
            </th>
            {isAdmin() && (
              <th className="text-left py-3 px-4 text-white/80 font-medium">操作</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((department) => (
            <tr key={department.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/70 rounded-lg">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <div className="font-medium text-white">{department.name}</div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className={`inline-block px-3 py-1 rounded-lg text-sm ${getTypeColor(department.type)}`}>
                  {getTypeLabel(department.type)}
                </div>
              </td>
              <td className="py-3 px-4 text-white/80">
                {department.location ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-white/60" />
                    {department.location}
                  </div>
                ) : (
                  <span className="text-white/50">未設定</span>
                )}
              </td>
              <td className="py-3 px-4 text-white/80">
                {department.manager_name ? (
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <User className="h-3 w-3 text-white/60" />
                      {department.manager_name}
                    </div>
                    {department.manager_contact && (
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                        <Phone className="h-3 w-3" />
                        {department.manager_contact}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-white/50">未設定</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="h-3 w-3 text-white/60" />
                  <span className="font-medium">{department.staff_count || 0}</span>
                </div>
              </td>
              {isAdmin() && (
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg"
                      onClick={() => openEditDialog(department)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;

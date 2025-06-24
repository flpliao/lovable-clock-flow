
import React from 'react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { Staff } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, ChevronDown, Users } from 'lucide-react';

const OrganizationChart: React.FC = () => {
  const {
    staffList,
    getSubordinates,
    getSupervisorName
  } = useStaffManagementContext();

  // Find top-level managers (those without supervisors)
  const topLevelManagers = staffList.filter(staff => !staff.supervisor_id);

  // Recursive function to render organization tree
  const renderOrganizationTree = (staff: Staff, level: number = 0) => {
    const subordinates = getSubordinates(staff.id);
    const hasSubordinates = subordinates.length > 0;
    
    return (
      <div key={staff.id} className="relative">
        {/* Staff node */}
        <div className={`
            bg-white/90 border border-gray-200/80 rounded-lg p-4 mb-3 shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm min-w-max
            ${level === 0 ? 'bg-blue-50/90 border-blue-200/80 shadow-lg' : 'ml-8'}
          `}>
          <div className="flex items-center whitespace-nowrap">
            <div className={`
              h-12 w-12 rounded-full flex items-center justify-center mr-4 shadow-sm flex-shrink-0
              ${staff.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}
            `}>
              <UserRound className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-lg whitespace-nowrap">{staff.name}</div>
              <div className="text-sm text-gray-600 mt-1 whitespace-nowrap">{staff.position}</div>
            </div>
            <div className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium border whitespace-nowrap ml-4 flex-shrink-0">
              {staff.department}
            </div>
          </div>
        </div>
        
        {/* Vertical line connecting to subordinates */}
        {hasSubordinates && (
          <div className="flex items-center ml-6 mb-2">
            <ChevronDown className="h-4 w-4 text-gray-600" />
            <div className="text-sm text-gray-700 ml-2 font-medium whitespace-nowrap">管理 {subordinates.length} 人</div>
          </div>
        )}
        
        {/* Subordinates */}
        {hasSubordinates && (
          <div className="pl-4 border-l-2 border-gray-300/60 ml-6">
            {subordinates.map(sub => renderOrganizationTree(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (topLevelManagers.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/95 border border-gray-200/80 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">公司組織圖</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">未找到組織結構數據，請先設置人員上下級關係</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/95 border border-gray-200/80 rounded-2xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900">公司組織圖</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 添加水平滾動容器 */}
        <div className="w-full overflow-x-auto">
          <div className="p-4 max-h-[600px] overflow-y-auto min-w-max">
            {topLevelManagers.map(manager => renderOrganizationTree(manager))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationChart;

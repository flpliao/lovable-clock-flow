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
    return <div key={staff.id} className="relative">
        {/* Staff node */}
        <div className={`
            bg-white/20 border border-white/30 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm
            ${level === 0 ? 'bg-blue-50/30 border-blue-200/50' : 'ml-8'}
          `}>
          <div className="flex items-center">
            <div className={`
              h-10 w-10 rounded-full flex items-center justify-center mr-3
              ${staff.role === 'admin' ? 'bg-blue-100/30 text-blue-200' : 'bg-gray-100/30 text-gray-200'}
            `}>
              <UserRound className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">{staff.name}</div>
              <div className="text-xs text-white/70">{staff.position}</div>
            </div>
            <div className="text-xs bg-white/20 text-white px-2 py-1 rounded">
              {staff.department}
            </div>
          </div>
        </div>
        
        {/* Vertical line connecting to subordinates */}
        {hasSubordinates && <div className="flex items-center ml-5 mb-1">
            <ChevronDown className="h-4 w-4 text-white/60" />
            <div className="text-xs text-white/70 ml-1">管理 {subordinates.length} 人</div>
          </div>}
        
        {/* Subordinates */}
        {hasSubordinates && <div className="pl-4 border-l border-white/30 ml-5">
            {subordinates.map(sub => renderOrganizationTree(sub, level + 1))}
          </div>}
      </div>;
  };
  if (topLevelManagers.length === 0) {
    return <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">公司組織圖</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users className="h-16 w-16 mx-auto text-white/40 mb-4" />
          <p className="text-white/70">未找到組織結構數據，請先設置人員上下級關係</p>
        </CardContent>
      </Card>;
  }
  return <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-600">公司組織圖</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 overflow-auto max-h-[600px]">
          {topLevelManagers.map(manager => renderOrganizationTree(manager))}
        </div>
      </CardContent>
    </Card>;
};
export default OrganizationChart;
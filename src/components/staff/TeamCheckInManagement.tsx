
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamCheckInData } from './hooks/useTeamCheckInData';
import TeamCheckInTable from './TeamCheckInTable';
import DepartmentFilter from './DepartmentFilter';

const TeamCheckInManagement: React.FC = () => {
  const {
    filter,
    setFilter,
    departmentFilter,
    setDepartmentFilter,
    departments,
    teamCheckInData,
    hasPermission
  } = useTeamCheckInData();
  
  if (!hasPermission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>團隊打卡管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            您沒有權限查看此頁面
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          團隊打卡管理
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <DepartmentFilter 
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departments={departments}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'today' | 'week' | 'month')}>
          <TabsList className="mb-4">
            <TabsTrigger value="today">今日</TabsTrigger>
            <TabsTrigger value="week">本週</TabsTrigger>
            <TabsTrigger value="month">本月</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-0">
            <TeamCheckInTable teamCheckInData={teamCheckInData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCheckInManagement;

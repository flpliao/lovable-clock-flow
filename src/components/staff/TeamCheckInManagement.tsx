
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { getCheckInRecords, CheckInRecord } from '@/components/LocationCheckIn';

const TeamCheckInManagement: React.FC = () => {
  const { currentUser, isAdmin } = useUser();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  // Get all check-in records
  const allCheckInRecords = getCheckInRecords();
  
  // Get departments from staff list
  const departments = Array.from(new Set(staffList.map(staff => staff.department)));
  
  // Get team members based on user role
  const teamMembers = isAdmin() 
    ? staffList // Admin can see all staff
    : currentUser?.id 
      ? getSubordinates(currentUser.id) // Manager can see their subordinates
      : [];
  
  // Filter records by date
  const getFilteredByDate = (records: CheckInRecord[]): CheckInRecord[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = today - 30 * 24 * 60 * 60 * 1000;
    
    return records.filter(record => {
      const recordTime = new Date(record.timestamp).getTime();
      switch (filter) {
        case 'today':
          return recordTime >= today;
        case 'week':
          return recordTime >= weekAgo;
        case 'month':
          return recordTime >= monthAgo;
        default:
          return true;
      }
    });
  };
  
  // Filter team members by department
  const filteredTeamMembers = departmentFilter === 'all'
    ? teamMembers
    : teamMembers.filter(member => member.department === departmentFilter);
  
  // Get check-in data for the filtered team members
  const teamCheckInData = filteredTeamMembers.map(member => {
    const userRecords = allCheckInRecords.filter(record => record.userId === member.id);
    const filteredRecords = getFilteredByDate(userRecords);
    
    const latestRecord = filteredRecords.length > 0
      ? filteredRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null;
    
    return {
      staff: member,
      totalRecords: filteredRecords.length,
      successRecords: filteredRecords.filter(r => r.status === 'success').length,
      failedRecords: filteredRecords.filter(r => r.status === 'failed').length,
      latestRecord
    };
  });
  
  // Check if user has permission to view this component
  const hasPermission = isAdmin() || (currentUser && getSubordinates(currentUser.id).length > 0);
  
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
          <Select 
            value={departmentFilter} 
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="選擇部門" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部門</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>員工姓名</TableHead>
                  <TableHead>部門</TableHead>
                  <TableHead>打卡次數</TableHead>
                  <TableHead>成功率</TableHead>
                  <TableHead>最近打卡</TableHead>
                  <TableHead>狀態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamCheckInData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      沒有找到任何打卡記錄
                    </TableCell>
                  </TableRow>
                ) : (
                  teamCheckInData.map(data => (
                    <TableRow key={data.staff.id}>
                      <TableCell className="font-medium">{data.staff.name}</TableCell>
                      <TableCell>{data.staff.department}</TableCell>
                      <TableCell>{data.totalRecords}</TableCell>
                      <TableCell>
                        {data.totalRecords === 0 
                          ? '-' 
                          : `${Math.round((data.successRecords / data.totalRecords) * 100)}%`
                        }
                      </TableCell>
                      <TableCell>
                        {data.latestRecord ? (
                          <div className="flex items-center">
                            {data.latestRecord.type === 'location' ? (
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Wifi className="h-3.5 w-3.5 mr-1" />
                            )}
                            <span>
                              {format(new Date(data.latestRecord.timestamp), 'MM/dd HH:mm')}
                            </span>
                          </div>
                        ) : (
                          '尚未打卡'
                        )}
                      </TableCell>
                      <TableCell>
                        {data.latestRecord ? (
                          data.latestRecord.status === 'success' ? (
                            <Badge className="bg-green-500">正常</Badge>
                          ) : (
                            <Badge className="bg-red-500">失敗</Badge>
                          )
                        ) : (
                          <Badge className="bg-gray-400">無記錄</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCheckInManagement;

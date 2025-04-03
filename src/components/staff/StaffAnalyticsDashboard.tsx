
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Clock, AlertCircle, CalendarDays, Users } from 'lucide-react';
import StaffAttendanceTable from './StaffAttendanceTable';

// Mock data for charts and tables
const mockStaffAttendanceData = [
  { id: '1', name: '王小明', workHours: 160, leaveHours: 8, abnormalCheckIns: 2, tardyCount: 1 },
  { id: '2', name: '李小華', workHours: 152, leaveHours: 16, abnormalCheckIns: 0, tardyCount: 0 },
  { id: '3', name: '張小美', workHours: 144, leaveHours: 24, abnormalCheckIns: 1, tardyCount: 3 },
  { id: '4', name: '陳小強', workHours: 156, leaveHours: 12, abnormalCheckIns: 0, tardyCount: 2 },
  { id: '5', name: '林小玲', workHours: 140, leaveHours: 28, abnormalCheckIns: 3, tardyCount: 4 },
  { id: '6', name: '吳小龍', workHours: 164, leaveHours: 4, abnormalCheckIns: 0, tardyCount: 0 },
];

const monthlyWorkHoursData = [
  { month: '1月', 正常工時: 3600, 加班時數: 120 },
  { month: '2月', 正常工時: 3400, 加班時數: 140 },
  { month: '3月', 正常工時: 3560, 加班時數: 180 },
  { month: '4月', 正常工時: 3480, 加班時數: 200 },
  { month: '5月', 正常工時: 3520, 加班時數: 160 },
  { month: '6月', 正常工時: 3450, 加班時數: 150 },
];

const leaveTypeData = [
  { name: '年假', value: 45 },
  { name: '病假', value: 18 },
  { name: '事假', value: 22 },
  { name: '其他', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const departmentAttendanceData = [
  { department: '人資部', 正常考勤: 92, 異常考勤: 8 },
  { department: '技術部', 正常考勤: 95, 異常考勤: 5 },
  { department: '行銷部', 正常考勤: 88, 異常考勤: 12 },
  { department: '業務部', 正常考勤: 90, 異常考勤: 10 },
  { department: '設計部', 正常考勤: 93, 異常考勤: 7 },
];

const StaffAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate summary metrics
  const totalStaff = mockStaffAttendanceData.length;
  const totalWorkHours = mockStaffAttendanceData.reduce((sum, staff) => sum + staff.workHours, 0);
  const totalLeaveHours = mockStaffAttendanceData.reduce((sum, staff) => sum + staff.leaveHours, 0);
  const totalAbnormalCheckIns = mockStaffAttendanceData.reduce((sum, staff) => sum + staff.abnormalCheckIns, 0);
  const totalTardyCounts = mockStaffAttendanceData.reduce((sum, staff) => sum + staff.tardyCount, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">總員工數</p>
              <h3 className="text-2xl font-bold">{totalStaff}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">總工時</p>
              <h3 className="text-2xl font-bold">{totalWorkHours}小時</h3>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">總請假時數</p>
              <h3 className="text-2xl font-bold">{totalLeaveHours}小時</h3>
            </div>
            <CalendarDays className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">異常打卡</p>
              <h3 className="text-2xl font-bold">{totalAbnormalCheckIns}次</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">遲到次數</p>
              <h3 className="text-2xl font-bold">{totalTardyCounts}次</h3>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">概覽</TabsTrigger>
          <TabsTrigger value="workHours">工時分析</TabsTrigger>
          <TabsTrigger value="leaveAnalysis">請假分析</TabsTrigger>
          <TabsTrigger value="attendance">考勤分析</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>全體員工考勤數據</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffAttendanceTable data={mockStaffAttendanceData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>請假類型分布</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Work Hours Tab */}
        <TabsContent value="workHours">
          <Card>
            <CardHeader>
              <CardTitle>月度工時統計</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyWorkHoursData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="正常工時" fill="#8884d8" />
                  <Bar dataKey="加班時數" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Leave Analysis Tab */}
        <TabsContent value="leaveAnalysis">
          <Card>
            <CardHeader>
              <CardTitle>請假時數明細</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>員工姓名</TableHead>
                    <TableHead>請假時數</TableHead>
                    <TableHead>年假剩餘</TableHead>
                    <TableHead>病假使用</TableHead>
                    <TableHead>事假使用</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaffAttendanceData.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.leaveHours}</TableCell>
                      <TableCell>{Math.floor(Math.random() * 40)}小時</TableCell>
                      <TableCell>{Math.floor(Math.random() * 16)}小時</TableCell>
                      <TableCell>{Math.floor(Math.random() * 24)}小時</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>部門考勤數據</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentAttendanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="department" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="正常考勤" fill="#82ca9d" stackId="a" />
                    <Bar dataKey="異常考勤" fill="#ff8042" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>異常考勤明細</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>員工姓名</TableHead>
                      <TableHead>異常打卡次數</TableHead>
                      <TableHead>遲到次數</TableHead>
                      <TableHead>異常原因</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStaffAttendanceData
                      .filter(staff => staff.abnormalCheckIns > 0 || staff.tardyCount > 0)
                      .map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>{staff.abnormalCheckIns}</TableCell>
                          <TableCell>{staff.tardyCount}</TableCell>
                          <TableCell>
                            {staff.abnormalCheckIns > staff.tardyCount ? '未打卡/地點異常' : '遲到'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffAnalyticsDashboard;

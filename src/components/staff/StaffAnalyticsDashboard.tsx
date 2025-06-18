import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Clock, AlertCircle, CalendarDays, Users, TrendingUp, FileText, Target, PieChart as PieChartIcon } from 'lucide-react';
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">總員工數</p>
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-md">{totalStaff}</h3>
            </div>
            <div className="p-2 bg-blue-500/70 rounded-xl shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">總工時</p>
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-md">{totalWorkHours}h</h3>
            </div>
            <div className="p-2 bg-green-500/70 rounded-xl shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">總請假</p>
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-md">{totalLeaveHours}h</h3>
            </div>
            <div className="p-2 bg-amber-500/70 rounded-xl shadow-lg">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">異常打卡</p>
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-md">{totalAbnormalCheckIns}</h3>
            </div>
            <div className="p-2 bg-red-500/70 rounded-xl shadow-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">遲到次數</p>
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-md">{totalTardyCounts}</h3>
            </div>
            <div className="p-2 bg-purple-500/70 rounded-xl shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/30 backdrop-blur-xl rounded-2xl h-14 border border-white/30 p-1">
          <TabsTrigger 
            value="overview" 
            className="text-gray-900 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-300"
          >
            <Target className="h-4 w-4" />
            概覽
          </TabsTrigger>
          <TabsTrigger 
            value="workHours" 
            className="text-gray-900 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-300"
          >
            <TrendingUp className="h-4 w-4" />
            工時
          </TabsTrigger>
          <TabsTrigger 
            value="leaveAnalysis" 
            className="text-gray-900 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-300"
          >
            <CalendarDays className="h-4 w-4" />
            請假
          </TabsTrigger>
          <TabsTrigger 
            value="attendance" 
            className="text-gray-900 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-300"
          >
            <FileText className="h-4 w-4" />
            考勤
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/70 rounded-xl shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 drop-shadow-md">員工考勤數據</h3>
              </div>
              <StaffAttendanceTable data={mockStaffAttendanceData} />
            </div>
            
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/70 rounded-xl shadow-lg">
                  <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 drop-shadow-md">請假類型分布</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Work Hours Tab */}
        <TabsContent value="workHours" className="mt-6">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/70 rounded-xl shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 drop-shadow-md">月度工時統計</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyWorkHoursData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="正常工時" fill="#8884d8" />
                  <Bar dataKey="加班時數" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
        
        {/* Leave Analysis Tab */}
        <TabsContent value="leaveAnalysis" className="mt-6">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/70 rounded-xl shadow-lg">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 drop-shadow-md">請假時數明細</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 text-sm font-semibold">員工</TableHead>
                  <TableHead className="text-gray-900 text-sm font-semibold">請假</TableHead>
                  <TableHead className="text-gray-900 text-sm font-semibold">年假剩餘</TableHead>
                  <TableHead className="text-gray-900 text-sm font-semibold">病假</TableHead>
                  <TableHead className="text-gray-900 text-sm font-semibold">事假</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStaffAttendanceData.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="text-gray-900 font-medium text-sm">{staff.name}</TableCell>
                    <TableCell className="text-gray-800 text-sm">{staff.leaveHours}h</TableCell>
                    <TableCell className="text-gray-800 text-sm">{Math.floor(Math.random() * 40)}h</TableCell>
                    <TableCell className="text-gray-800 text-sm">{Math.floor(Math.random() * 16)}h</TableCell>
                    <TableCell className="text-gray-800 text-sm">{Math.floor(Math.random() * 24)}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-500/70 rounded-xl shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 drop-shadow-md">部門考勤數據</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentAttendanceData} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="department" />
                    <Bar dataKey="正常考勤" fill="#82ca9d" stackId="a" />
                    <Bar dataKey="異常考勤" fill="#ff8042" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/70 rounded-xl shadow-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 drop-shadow-md">異常考勤明細</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900 text-sm font-semibold">員工</TableHead>
                    <TableHead className="text-gray-900 text-sm font-semibold">異常</TableHead>
                    <TableHead className="text-gray-900 text-sm font-semibold">遲到</TableHead>
                    <TableHead className="text-gray-900 text-sm font-semibold">原因</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaffAttendanceData
                    .filter(staff => staff.abnormalCheckIns > 0 || staff.tardyCount > 0)
                    .map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="text-gray-900 font-medium text-sm">{staff.name}</TableCell>
                        <TableCell className="text-gray-800 text-sm">{staff.abnormalCheckIns}</TableCell>
                        <TableCell className="text-gray-800 text-sm">{staff.tardyCount}</TableCell>
                        <TableCell className="text-gray-800 text-sm">
                          {staff.abnormalCheckIns > staff.tardyCount ? '未打卡' : '遲到'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffAnalyticsDashboard;

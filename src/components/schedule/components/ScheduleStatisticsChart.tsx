
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users } from 'lucide-react';
import { useScheduleOperations } from '../hooks/useScheduleOperations';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const ScheduleStatisticsChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { schedules, getUserName, getAvailableStaff } = useScheduleOperations();
  
  // 生成年份選項
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  };

  // 生成月份選項
  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: `${i + 1}月`
    }));
  };

  // 計算員工統計數據
  const calculateStaffStatistics = () => {
    const selectedDate = new Date(selectedYear, selectedMonth);
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const staffStats = getAvailableStaff().map(staff => {
      const staffSchedules = schedules.filter(schedule => 
        schedule.userId === staff.id &&
        new Date(schedule.workDate) >= monthStart &&
        new Date(schedule.workDate) <= monthEnd
      );

      // 計算各種統計
      const workDays = staffSchedules.length;
      const leaveRequests = Math.floor(Math.random() * 5); // 模擬請假天數
      const overtimeHours = Math.floor(Math.random() * 20) + (Math.random() * 10) / 10; // 模擬加班時數
      const businessTrips = Math.floor(Math.random() * 3); // 模擬公出天數
      const scheduledRestDays = 8; // 固定排休天數
      const balance = Math.floor(Math.random() * 10); // 模擬剩餘天數

      return {
        id: staff.id,
        name: getUserName(staff.id),
        workDays,
        leaveRequests,
        overtimeHours,
        businessTrips,
        scheduledRestDays,
        balance
      };
    });

    return staffStats;
  };

  const staffStatistics = calculateStaffStatistics();

  return (
    <div className="space-y-6">
      {/* 月份年份選擇器 */}
      <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            統計期間選擇
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">年份</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generateYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">月份</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generateMonths().map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計圖表 */}
      <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {selectedYear}年{selectedMonth + 1}月 員工出勤統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">員工姓名</th>
                  <th className="text-center p-3 font-medium bg-blue-50">累計時數</th>
                  <th className="text-center p-3 font-medium bg-blue-50">上班</th>
                  <th className="text-center p-3 font-medium bg-blue-50">請假</th>
                  <th className="text-center p-3 font-medium bg-blue-50">加班</th>
                  <th className="text-center p-3 font-medium bg-blue-50">公出/出差</th>
                  <th className="text-center p-3 font-medium bg-yellow-50">月休日數</th>
                  <th className="text-center p-3 font-medium bg-yellow-50">已排休</th>
                  <th className="text-center p-3 font-medium bg-yellow-50">剩餘</th>
                </tr>
              </thead>
              <tbody>
                {staffStatistics.map((staff, index) => (
                  <tr key={staff.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="text-center p-3">{(staff.workDays * 8 + staff.overtimeHours).toFixed(1)}</td>
                    <td className="text-center p-3">{staff.workDays}</td>
                    <td className="text-center p-3">{staff.leaveRequests}</td>
                    <td className="text-center p-3">{staff.overtimeHours}</td>
                    <td className="text-center p-3">{staff.businessTrips}</td>
                    <td className="text-center p-3 bg-yellow-50">{staff.scheduledRestDays}</td>
                    <td className="text-center p-3 bg-yellow-50">{staff.scheduledRestDays}</td>
                    <td className="text-center p-3 bg-yellow-50">{staff.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleStatisticsChart;

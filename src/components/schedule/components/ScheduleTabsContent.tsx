
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, List, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalendarViewSection from './CalendarViewSection';
import ListViewSection from './ListViewSection';
import MonthlyScheduleView from './MonthlyScheduleView';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useToast } from '@/hooks/use-toast';

interface ScheduleTabsContentProps {
  viewType: string;
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
  selectedYear: number;
  selectedMonth: number;
  selectedDateNav: Date;
  daysInMonth: any[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDateClick: (day: any) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
  shiftsForSelectedDate: any[];
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (id: string) => void;
  currentUser: any;
  setSelectedDateNav: (date: Date) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const ScheduleTabsContent = (props: ScheduleTabsContentProps) => {
  const { updateSchedule, removeSchedule } = useScheduling();
  const { toast } = useToast();

  // 模擬時間段數據，實際應該從 context 或 API 獲取
  const mockTimeSlots = [
    { id: '1', name: '早班', start_time: '08:00', end_time: '16:00' },
    { id: '2', name: '中班', start_time: '16:00', end_time: '24:00' },
    { id: '3', name: '晚班', start_time: '00:00', end_time: '08:00' },
  ];

  const handleUpdateSchedule = async (id: string, updates: any) => {
    try {
      await updateSchedule(id, updates);
      toast({
        title: "更新成功",
        description: "排班已更新",
      });
    } catch (error) {
      toast({
        title: "更新失敗",
        description: "無法更新排班，請稍後再試",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await removeSchedule(id);
      toast({
        title: "刪除成功",
        description: "排班已刪除",
      });
    } catch (error) {
      toast({
        title: "刪除失敗",
        description: "無法刪除排班，請稍後再試",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <TabsContent value="monthly" className="mt-0">
        <div className="space-y-6">
          {/* 員工選擇器 */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>選擇查看員工</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={props.selectedStaffId || "all"} 
                onValueChange={(value) => props.onStaffChange(value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇員工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有員工</SelectItem>
                  {props.availableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} {props.getUserRelation(staff.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* 月份選擇器 */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>選擇月份</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select value={props.selectedYear.toString()} onValueChange={(value) => props.onYearChange(parseInt(value))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {props.generateYears().map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}年
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={props.selectedMonth.toString()} onValueChange={(value) => props.onMonthChange(parseInt(value))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {props.generateMonths().map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 月度排班視圖 */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl overflow-hidden">
            <MonthlyScheduleView
              selectedDate={props.selectedDate}
              schedules={props.schedules}
              getUserName={props.getUserName}
              selectedStaffId={props.selectedStaffId}
              onUpdateSchedule={handleUpdateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              timeSlots={mockTimeSlots}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="daily" className="mt-0">
        <div className="space-y-6">
          {/* 選擇員工 Card */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>選擇員工</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={props.selectedStaffId || "all"}
                onValueChange={(value) => props.onStaffChange(value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇員工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有員工</SelectItem>
                  {props.availableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} {props.getUserRelation(staff.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* 選擇日期 Card */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>選擇日期</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarViewSection
                selectedDate={props.selectedDate}
                onDateChange={props.onDateChange}
                selectedYear={props.selectedYear}
                selectedMonth={props.selectedMonth}
                onYearChange={props.onYearChange}
                onMonthChange={props.onMonthChange}
                generateYears={props.generateYears}
                generateMonths={props.generateMonths}
              />
            </CardContent>
          </Card>

          {/* 排班表 Card */}
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
                <List className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>排班表</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ListViewSection
                availableStaff={props.availableStaff}
                selectedStaffId={props.selectedStaffId || 'all'}
                selectedDate={props.selectedDate}
                onStaffChange={(staffId) => props.onStaffChange(staffId === 'all' ? undefined : staffId)}
                onDateChange={props.onDateChange}
                getUserRelation={props.getUserRelation}
                schedules={props.schedules}
                getUserName={props.getUserName}
                viewableStaffIds={props.viewableStaffIds}
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
};

export default ScheduleTabsContent;

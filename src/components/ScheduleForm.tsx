
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { UserPlus } from 'lucide-react';
import { useScheduleFormLogic } from './schedule/hooks/useScheduleFormLogic';
import StaffSelector from './schedule/StaffSelector';
import ScheduleCalendar from './schedule/ScheduleCalendar';
import TimeSlotSelector from './schedule/TimeSlotSelector';
import SchedulePreview from './schedule/SchedulePreview';
import YearMonthSelector from './schedule/YearMonthSelector';
import ScheduleFormActions from './schedule/ScheduleFormActions';

const ScheduleForm = () => {
  const {
    form,
    selectedYear,
    selectedMonth,
    selectedDates,
    selectedTimeSlots,
    loading,
    error,
    setSelectedYear,
    setSelectedMonth,
    handleDateToggle,
    handleTimeSlotToggle,
    onSubmit,
  } = useScheduleFormLogic();

  const isFormValid = form.watch('userId') && selectedDates.length > 0 && selectedTimeSlots.length > 0;

  return (
    <div className="space-y-4">
      {/* 手機優化的標題卡片 */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <UserPlus className="h-5 w-5" />
            <span>創建新排班</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 錯誤提示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-700 text-sm font-medium">
              錯誤：{error}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 員工選擇 */}
          <Card>
            <CardContent className="p-4">
              <StaffSelector control={form.control} />
            </CardContent>
          </Card>

          {/* 年月選擇 */}
          <Card>
            <CardContent className="p-4">
              <YearMonthSelector
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
              />
            </CardContent>
          </Card>

          {/* 日期選擇 */}
          <Card>
            <CardContent className="p-4">
              <ScheduleCalendar
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDates={selectedDates}
                onDateToggle={handleDateToggle}
              />
            </CardContent>
          </Card>

          {/* 時間段選擇 */}
          <Card>
            <CardContent className="p-4">
              <TimeSlotSelector
                selectedTimeSlots={selectedTimeSlots}
                onTimeSlotToggle={handleTimeSlotToggle}
              />
            </CardContent>
          </Card>

          {/* 預覽 */}
          {(selectedDates.length > 0 || selectedTimeSlots.length > 0) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <SchedulePreview
                  selectedDates={selectedDates}
                  selectedTimeSlots={selectedTimeSlots}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
              </CardContent>
            </Card>
          )}

          {/* 提交按鈕 */}
          <Card>
            <CardContent className="p-4">
              <ScheduleFormActions
                loading={loading}
                disabled={!isFormValid}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleForm;

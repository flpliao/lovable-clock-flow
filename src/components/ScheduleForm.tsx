
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { UserPlus, Users, Calendar, Clock, Eye, CheckCircle } from 'lucide-react';
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
    <div className="space-y-6">
      {/* 錯誤提示 */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl border border-red-400/30 shadow-lg p-4">
          <div className="text-red-100 text-sm font-medium">
            錯誤：{error}
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 員工選擇卡片 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">選擇員工</h3>
            </div>
            <StaffSelector control={form.control} />
          </div>

          {/* 年月選擇卡片 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/80 rounded-xl shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">選擇年月</h3>
            </div>
            <YearMonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* 日期選擇卡片 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/80 rounded-xl shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">選擇日期</h3>
            </div>
            <ScheduleCalendar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDates={selectedDates}
              onDateToggle={handleDateToggle}
            />
          </div>

          {/* 時間段選擇卡片 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/80 rounded-xl shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">選擇時間段</h3>
            </div>
            <TimeSlotSelector
              selectedTimeSlots={selectedTimeSlots}
              onTimeSlotToggle={handleTimeSlotToggle}
            />
          </div>

          {/* 預覽卡片 */}
          {(selectedDates.length > 0 || selectedTimeSlots.length > 0) && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/80 rounded-xl shadow-lg">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white drop-shadow-md">排班預覽</h3>
              </div>
              <SchedulePreview
                selectedDates={selectedDates}
                selectedTimeSlots={selectedTimeSlots}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>
          )}

          {/* 提交按鈕卡片 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500/80 rounded-xl shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">提交排班</h3>
            </div>
            <ScheduleFormActions
              loading={loading}
              disabled={!isFormValid}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleForm;


import React from 'react';
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
    <div className="space-y-8 px-4">
      {/* 錯誤提示 */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-xl border border-red-300/30 rounded-3xl p-6 shadow-xl">
          <div className="text-red-100 font-medium">
            錯誤：{error}
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 員工選擇 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">選擇員工</h3>
            </div>
            <StaffSelector control={form.control} />
          </div>

          {/* 年月選擇 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">選擇年月</h3>
            </div>
            <YearMonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* 日期選擇 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">選擇日期</h3>
            </div>
            <ScheduleCalendar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDates={selectedDates}
              onDateToggle={handleDateToggle}
            />
          </div>

          {/* 時間段選擇 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">選擇時間段</h3>
            </div>
            <TimeSlotSelector
              selectedTimeSlots={selectedTimeSlots}
              onTimeSlotToggle={handleTimeSlotToggle}
            />
          </div>

          {/* 預覽 */}
          {(selectedDates.length > 0 || selectedTimeSlots.length > 0) && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">排班預覽</h3>
              </div>
              <SchedulePreview
                selectedDates={selectedDates}
                selectedTimeSlots={selectedTimeSlots}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>
          )}

          {/* 提交按鈕 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">提交排班</h3>
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

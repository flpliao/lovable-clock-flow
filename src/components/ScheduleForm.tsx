
import React from 'react';
import { Form } from '@/components/ui/form';
import { UserPlus, Users, Calendar, Clock, Eye, CheckCircle, Star, Award } from 'lucide-react';
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
    <div className="space-y-8">
      {/* 錯誤提示 */}
      {error && (
        <div className="backdrop-blur-2xl bg-red-500/20 border border-red-400/30 rounded-3xl shadow-lg p-6">
          <div className="text-red-100 text-sm font-medium drop-shadow-sm">
            錯誤：{error}
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 員工選擇卡片 */}
          <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg border border-white/20">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black drop-shadow-lg">選擇員工</h3>
            </div>
            <StaffSelector control={form.control} />
          </div>

          {/* 年月選擇卡片 */}
          <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg border border-white/20">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black drop-shadow-lg">選擇年月</h3>
            </div>
            <YearMonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* 日期選擇卡片 */}
          <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg border border-white/20">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black drop-shadow-lg">選擇日期</h3>
            </div>
            <ScheduleCalendar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDates={selectedDates}
              onDateToggle={handleDateToggle}
            />
          </div>

          {/* 時間段選擇卡片 */}
          <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg border border-white/20">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black drop-shadow-lg">選擇時間段</h3>
            </div>
            <TimeSlotSelector
              selectedTimeSlots={selectedTimeSlots}
              onTimeSlotToggle={handleTimeSlotToggle}
            />
          </div>

          {/* 預覽卡片 */}
          {(selectedDates.length > 0 || selectedTimeSlots.length > 0) && (
            <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg border border-white/20">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black drop-shadow-lg">排班預覽</h3>
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
          <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg border border-white/20">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black drop-shadow-lg">提交排班</h3>
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

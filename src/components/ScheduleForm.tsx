
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
        <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl shadow-lg p-6">
          <div className="text-red-800 text-sm font-medium drop-shadow-sm">
            錯誤：{error}
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 員工選擇卡片 */}
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">選擇員工</h3>
            </div>
            <div className="text-gray-900">
              <StaffSelector control={form.control} />
            </div>
          </div>

          {/* 年月選擇卡片 */}
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">選擇年月</h3>
            </div>
            <div className="text-gray-900">
              <YearMonthSelector
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
              />
            </div>
          </div>

          {/* 日期選擇卡片 */}
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-purple-400/50 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">選擇日期</h3>
            </div>
            <div className="text-gray-900">
              <ScheduleCalendar
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDates={selectedDates}
                onDateToggle={handleDateToggle}
              />
            </div>
          </div>

          {/* 時間段選擇卡片 */}
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">選擇時間段</h3>
            </div>
            <div className="text-gray-900">
              <TimeSlotSelector
                selectedTimeSlots={selectedTimeSlots}
                onTimeSlotToggle={handleTimeSlotToggle}
              />
            </div>
          </div>

          {/* 預覽卡片 */}
          {(selectedDates.length > 0 || selectedTimeSlots.length > 0) && (
            <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-teal-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-teal-400/50 text-white">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">排班預覽</h3>
              </div>
              <div className="text-gray-900">
                <SchedulePreview
                  selectedDates={selectedDates}
                  selectedTimeSlots={selectedTimeSlots}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
              </div>
            </div>
          )}

          {/* 提交按鈕卡片 */}
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-indigo-400/50 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">提交排班</h3>
            </div>
            <div className="text-gray-900">
              <ScheduleFormActions
                loading={loading}
                disabled={!isFormValid}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleForm;

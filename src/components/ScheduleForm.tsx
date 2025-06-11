
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
import { visionProStyles } from '@/utils/visionProStyles';

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
    <div className="space-y-12">
      {/* 錯誤提示 */}
      {error && (
        <div className="backdrop-blur-2xl bg-red-500/20 border border-red-400/30 rounded-3xl shadow-lg p-6">
          <div className="text-red-800 text-sm font-medium drop-shadow-sm">
            錯誤：{error}
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* 員工選擇卡片 */}
          <div className={`${visionProStyles.dashboardCard} p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={visionProStyles.coloredIconContainer.blue}>
                <Users className="h-6 w-6" />
              </div>
              <h3 className={`text-2xl font-bold text-gray-800`}>選擇員工</h3>
            </div>
            <div className="text-gray-800">
              <StaffSelector control={form.control} />
            </div>
          </div>

          {/* 年月選擇卡片 */}
          <div className={`${visionProStyles.dashboardCard} p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={visionProStyles.coloredIconContainer.green}>
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className={`text-2xl font-bold text-gray-800`}>選擇年月</h3>
            </div>
            <div className="text-gray-800">
              <YearMonthSelector
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
              />
            </div>
          </div>

          {/* 日期選擇卡片 */}
          <div className={`${visionProStyles.dashboardCard} p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={visionProStyles.coloredIconContainer.purple}>
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className={`text-2xl font-bold text-gray-800`}>選擇日期</h3>
            </div>
            <div className="text-gray-800">
              <ScheduleCalendar
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDates={selectedDates}
                onDateToggle={handleDateToggle}
              />
            </div>
          </div>

          {/* 時間段選擇卡片 */}
          <div className={`${visionProStyles.dashboardCard} p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={visionProStyles.coloredIconContainer.orange}>
                <Clock className="h-6 w-6" />
              </div>
              <h3 className={`text-2xl font-bold text-gray-800`}>選擇時間段</h3>
            </div>
            <div className="text-gray-800">
              <TimeSlotSelector
                selectedTimeSlots={selectedTimeSlots}
                onTimeSlotToggle={handleTimeSlotToggle}
              />
            </div>
          </div>

          {/* 預覽卡片 */}
          {(selectedDates.length > 0 || selectedTimeSlots.length > 0) && (
            <div className={`${visionProStyles.dashboardCard} p-8`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={visionProStyles.coloredIconContainer.teal}>
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className={`text-2xl font-bold text-gray-800`}>排班預覽</h3>
              </div>
              <div className="text-gray-800">
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
          <div className={`${visionProStyles.dashboardCard} p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={visionProStyles.coloredIconContainer.indigo}>
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className={`text-2xl font-bold text-gray-800`}>提交排班</h3>
            </div>
            <div className="text-gray-800">
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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
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
    <Card>
      <CardHeader>
        <CardTitle>創建新排班</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            錯誤：{error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <StaffSelector control={form.control} />

            <YearMonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />

            <ScheduleCalendar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDates={selectedDates}
              onDateToggle={handleDateToggle}
            />

            <TimeSlotSelector
              selectedTimeSlots={selectedTimeSlots}
              onTimeSlotToggle={handleTimeSlotToggle}
            />

            <SchedulePreview
              selectedDates={selectedDates}
              selectedTimeSlots={selectedTimeSlots}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />

            <ScheduleFormActions
              loading={loading}
              disabled={!isFormValid}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;

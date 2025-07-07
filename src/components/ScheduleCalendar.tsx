import { Staff } from '@/components/staff/types';
import { Tabs } from '@/components/ui/tabs';
import { Schedule } from '@/contexts/scheduling/types';
import { useCallback, useMemo } from 'react';
import ScheduleHeader from './schedule/components/ScheduleHeader';
import ScheduleTabsContent from './schedule/components/ScheduleTabsContent';
import { useDateNavigation } from './schedule/hooks/useDateNavigation';
import { useScheduleFiltering } from './schedule/hooks/useScheduleFiltering';
import { useScheduleOperations } from './schedule/hooks/useScheduleOperations';
import { useSchedulePageState } from './schedule/hooks/useSchedulePageState';
import { useScheduleViewState } from './schedule/hooks/useScheduleViewState';

interface ScheduleCalendarProps {
  staffList: Staff[];
  getSubordinates: (userId: string) => Staff[];
}

const ScheduleCalendar = ({ staffList, getSubordinates }: ScheduleCalendarProps) => {
  const { viewMode, setViewMode } = useSchedulePageState();

  const {
    schedules,
    currentUser,
    getAvailableStaff,
    getUserName,
    getUserRelation,
    handleRemoveSchedule,
    canDeleteSchedule,
    hasSubordinates,
  } = useScheduleOperations({ staffList, getSubordinates });

  const { viewableStaffIds, getFilteredSchedulesForDate } = useScheduleFiltering({
    viewMode,
    staffList,
    getSubordinates,
  });
  const {
    selectedYear,
    selectedMonth,
    selectedDate: dateNavSelectedDate,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDate: setDateNavSelectedDate,
    generateDaysInMonth,
    generateYears,
    generateMonths,
  } = useDateNavigation();

  const {
    viewType,
    setViewType,
    selectedStaffId,
    setSelectedStaffId,
    selectedDate,
    setSelectedDate,
  } = useScheduleViewState();

  console.log('ScheduleCalendar - All schedules:', schedules);

  // 建立每天排班數量快取
  const scheduleCountMap = useMemo(() => {
    const map = new Map<string, number>();
    // 將 viewableStaffIds 轉成 Set 以加速 includes 檢查
    const visibleSet = new Set(viewableStaffIds);
    schedules.forEach((sch: Schedule) => {
      if (!visibleSet.has(sch.userId)) return;
      const key = sch.workDate || '';
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [schedules, viewableStaffIds]);

  // 取得指定日期的排班數量（已快取）
  const getScheduleCountForDate = useCallback(
    (date: Date) => {
      const key = date.toISOString().split('T')[0];
      return scheduleCountMap.get(key) ?? 0;
    },
    [scheduleCountMap]
  );

  // 包裝 generateDaysInMonth，只有在月份或快取變動時重新計算
  const daysInMonth = useMemo(
    () => generateDaysInMonth(getScheduleCountForDate),
    [selectedYear, selectedMonth, scheduleCountMap, generateDaysInMonth, getScheduleCountForDate]
  );

  // 由快取取得選擇日期的班表，避免重複 filter
  const shiftsForSelectedDate = useMemo(
    () => getFilteredSchedulesForDate(dateNavSelectedDate),
    [getFilteredSchedulesForDate, dateNavSelectedDate]
  );

  const handleDateClick = (day: { date?: Date }) => {
    if (day && day.date) {
      setDateNavSelectedDate(day.date);
    }
  };

  // 包裝 handleRemoveSchedule 確保它返回 Promise
  const wrappedHandleRemoveSchedule = async (scheduleId: string): Promise<void> => {
    await handleRemoveSchedule(scheduleId);
  };

  const availableStaff = getAvailableStaff();

  return (
    <div className="space-y-6">
      <Tabs
        value={viewType}
        onValueChange={(value: 'daily' | 'monthly') => setViewType(value)}
        className="w-full space-y-6"
      >
        {/* 簡化的查看模式選擇器 */}
        <ScheduleHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasSubordinates={hasSubordinates}
          viewType={viewType}
          onViewTypeChange={setViewType}
        />

        {/* 主要內容 */}
        <ScheduleTabsContent
          viewType={viewType}
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={setSelectedStaffId}
          onDateChange={setSelectedDate}
          getUserRelation={getUserRelation}
          schedules={schedules}
          getUserName={getUserName}
          viewableStaffIds={viewableStaffIds}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDateNav={dateNavSelectedDate}
          daysInMonth={daysInMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
          onDateClick={handleDateClick}
          generateYears={generateYears}
          generateMonths={generateMonths}
          shiftsForSelectedDate={shiftsForSelectedDate}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={wrappedHandleRemoveSchedule}
          currentUser={currentUser}
          setSelectedDateNav={setDateNavSelectedDate}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </Tabs>
    </div>
  );
};

export default ScheduleCalendar;

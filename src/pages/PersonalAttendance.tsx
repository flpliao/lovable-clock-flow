import AttendanceCalendarView from '@/components/attendance/AttendanceCalendarView';
import { useAttendanceRecords } from '@/hooks/useAttendanceRecords';
import { useMissedCheckinRecords } from '@/hooks/useMissedCheckinRecords';
import { useUserSchedules } from '@/hooks/useUserSchedules';
import { useCurrentUser } from '@/hooks/useStores';
import { useCallback, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const PersonalAttendance = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();

  const { date, setDate, selectedDateRecords, checkInRecords, refreshData } =
    useAttendanceRecords();

  const { missedCheckinRecords, loadMissedCheckinRecords, refreshMissedCheckinRecords } =
    useMissedCheckinRecords();

  const {
    userSchedules,
    loadUserSchedules,
    refreshUserSchedules,
    hasScheduleForDate,
    getScheduleForDate,
  } = useUserSchedules();

  // 載入頁面時重新整理資料
  const handleDataRefresh = useCallback(async () => {
    if (currentUser?.id) {
      console.log('載入月曆視圖，重新整理資料');
      await refreshData();
      await refreshMissedCheckinRecords();
      await refreshUserSchedules(date);
    }
  }, [currentUser?.id, refreshData, refreshMissedCheckinRecords, refreshUserSchedules, date]);

  useEffect(() => {
    handleDataRefresh();
  }, [handleDataRefresh]);

  // 載入忘打卡記錄
  useEffect(() => {
    if (currentUser?.id) {
      loadMissedCheckinRecords();
    }
  }, [currentUser?.id, loadMissedCheckinRecords]);

  // 載入排班記錄
  useEffect(() => {
    if (currentUser?.id) {
      loadUserSchedules(date);
    }
  }, [currentUser?.id, loadUserSchedules, date]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent" />

      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
      <div
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse"
        style={{ animationDelay: '6s' }}
      />

      <div className="relative z-10 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-6 py-[50px]">
          <div className="space-y-6">
            {/* 標題 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/80 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white drop-shadow-md">打卡記錄</h2>
            </div>

            {/* 月曆視圖內容 */}
            <div className="mt-6">
              <AttendanceCalendarView
                date={date}
                setDate={setDate}
                selectedDateRecords={selectedDateRecords}
                checkInRecords={checkInRecords}
                missedCheckinRecords={missedCheckinRecords}
                userSchedules={userSchedules}
                hasScheduleForDate={hasScheduleForDate}
                getScheduleForDate={getScheduleForDate}
                onMonthChange={handleDataRefresh}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAttendance;

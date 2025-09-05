import React from 'react';
import { Calendar } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import AttendanceCalendar from '@/components/attendance/AttendanceCalendar';
import DateRecordDetails from '@/components/attendance/DateRecordDetails';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { RequestType, CheckInMethod, CheckInSource, CheckInStatus } from '@/constants/checkInTypes';

const PersonalAttendancePage: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    currentYear,
    currentMonth,
    changeMonth,
    highlightedDates,
    selectedDateAttendance,
    monthlyData,
    loading,
    error,
    fetchMonthlyData,
  } = useAttendanceData();

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 標題 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white drop-shadow-md">打卡記錄</h2>
        </div>

        {/* 主要內容區域 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* 月曆區域 */}
          <div className="flex justify-center ">
            <AttendanceCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onMonthChange={changeMonth}
              highlightedDates={highlightedDates}
              monthlyData={monthlyData}
              loading={loading}
            />
          </div>

          {/* 狀態區域 */}
          <div className="space-y-4">
            {/* 選中日期詳細資訊 */}
            {selectedDate && (
              <DateRecordDetails
                date={selectedDate}
                selectedDateRecords={{
                  checkIn: selectedDateAttendance?.check_in_time
                    ? {
                        id: '1',
                        type: RequestType.CHECK_IN,
                        method: CheckInMethod.IP,
                        status: CheckInStatus.SUCCESS,
                        latitude: 0,
                        longitude: 0,
                        ip_address: '',
                        source: CheckInSource.NORMAL,
                        checked_at: selectedDateAttendance.check_in_time,
                      }
                    : undefined,
                  checkOut: selectedDateAttendance?.check_out_time
                    ? {
                        id: '2',
                        type: RequestType.CHECK_OUT,
                        method: CheckInMethod.IP,
                        status: CheckInStatus.SUCCESS,
                        latitude: 0,
                        longitude: 0,
                        ip_address: '',
                        source: CheckInSource.NORMAL,
                        checked_at: selectedDateAttendance.check_out_time,
                      }
                    : undefined,
                }}
                recordsCount={selectedDateAttendance ? 1 : 0}
                missedCheckinRecords={[]} // 這裡需要從 hook 中獲取
                hasScheduleForDate={(_dateStr: string) => {
                  // 檢查是否有排班
                  return selectedDateAttendance?.is_workday || false;
                }}
                getScheduleForDate={(_dateStr: string) => {
                  // 返回排班資訊
                  return selectedDateAttendance?.work_schedule
                    ? {
                        id: selectedDateAttendance.work_schedule.id.toString(),
                        user_id: '',
                        work_date: _dateStr,
                        start_time: selectedDateAttendance.work_schedule.clock_in_time,
                        end_time: selectedDateAttendance.work_schedule.clock_out_time,
                        time_slot: '',
                        created_by: '',
                        created_at: '',
                        updated_at: '',
                      }
                    : undefined;
                }}
                onDataRefresh={async () => {
                  // 重新載入資料
                  await fetchMonthlyData(currentYear, currentMonth);
                }}
              />
            )}

            {/* 載入狀態 */}
            {loading && (
              <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="ml-2 text-white">載入中...</span>
                </div>
              </div>
            )}

            {/* 錯誤狀態 */}
            {error && (
              <div className="bg-red-100/20 backdrop-blur-2xl rounded-2xl border border-red-300/30 shadow-lg p-4">
                <div className="text-red-700">
                  <p className="font-medium">載入失敗</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PersonalAttendancePage;

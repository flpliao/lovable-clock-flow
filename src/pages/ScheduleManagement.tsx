import PageHeader from '@/components/layout/PageHeader';
import PageLayout from '@/components/layout/PageLayout';
import {
  DepartmentSelect,
  PersonnelFilter,
  ShiftFilter,
  ShiftSelector,
} from '@/components/schedule';
import { Button } from '@/components/ui/button';
import { useDepartment } from '@/hooks/useDepartment';
import { useShift } from '@/hooks/useShift';
import dayjs from 'dayjs';
import { Calendar, ChevronDown, ChevronRight, Edit, Save, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 模擬員工資料
const mockEmployees = [
  { id: 1, name: '楊玄琳', department: '診所' },
  { id: 2, name: '林郁庭', department: '診所' },
  { id: 3, name: '周荃', department: '診所' },
  { id: 4, name: '陳玉楓', department: '診所' },
  { id: 5, name: '廖妍伊', department: '診所' },
];

// 模擬班次資料
const mockShifts = [
  { id: 2, name: '診所早班', color: '#10B981', code: 'MORNING' },
  { id: 3, name: '診所晚班', color: '#F59E0B', code: 'EVENING' },
  { id: 4, name: '請假', color: '#EF4444', code: 'LEAVE' },
];

// 模擬排班資料
const mockScheduleData = {
  楊玄琳: {
    4: {
      shiftId: 3,
      shiftName: '診所晚班',
      startTime: '14:00',
      endTime: '22:00',
      status: '已確認',
      leave: null,
      overtime: null,
      businessTrip: null,
    },
    17: {
      shiftId: 3,
      shiftName: '診所晚班',
      startTime: '14:00',
      endTime: '22:00',
      status: '已確認',
      leave: null,
      overtime: null,
      businessTrip: null,
    },
    20: {
      shiftId: 3,
      shiftName: '診所晚班',
      startTime: '14:00',
      endTime: '22:00',
      status: '已確認',
      leave: null,
      overtime: null,
      businessTrip: null,
    },
    21: {
      shiftId: 3,
      shiftName: '診所晚班',
      startTime: '14:00',
      endTime: '22:00',
      status: '已確認',
      leave: null,
      overtime: null,
      businessTrip: null,
    },
  },
};

const ScheduleManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [_selectedWorkSystem, _setSelectedWorkSystem] = useState<string>('standard');
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('YYYY-MM'));
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [personnelFilter, setPersonnelFilter] = useState<'all' | 'workSystem'>('all');
  const [_leaveFilter, _setLeaveFilter] = useState({
    all: true,
    leave: true,
    monthlyLeave: true,
    nationalHoliday: true,
    restDay: true,
    regularHoliday: true,
  });
  const [shiftFilter, setShiftFilter] = useState({
    all: true,
    support: true,
    requestLeave: true,
    clinicMorning: true,
    clinicEvening: true,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(new Set());
  const [scheduleData, setScheduleData] = useState(mockScheduleData);
  const [initialScheduleData, setInitialScheduleData] = useState(mockScheduleData);

  const { loadAllShifts } = useShift();

  const { loadDepartments } = useDepartment();

  useEffect(() => {
    loadDepartments();
  }, []);

  // 檢查是否已選擇單位和月份
  const isSelectionComplete = selectedDepartment && selectedMonth;

  // 處理搜尋班表
  const handleSearchSchedule = () => {
    if (isSelectionComplete) {
      loadAllShifts();
      setHasSearched(true);
      // 搜尋班表時，重置為原始模擬資料（深拷貝）
      const deepCopyData = JSON.parse(JSON.stringify(mockScheduleData));
      setScheduleData(deepCopyData);
      setInitialScheduleData(deepCopyData);
    }
  };

  // 使用 dayjs 格式化月份顯示
  const formatMonthDisplay = (monthValue: string) => {
    if (!monthValue) return '';
    return dayjs(monthValue).format('YYYY年MM月');
  };

  // 處理月份變更
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
  };

  // 獲取月份的天數和第一天是星期幾
  const getMonthDays = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const firstDay = dayjs(`${year}-${month}-01`);
    const lastDay = firstDay.endOf('month');
    const daysInMonth = lastDay.date();
    const firstDayOfWeek = firstDay.day(); // 0 = 星期日, 1 = 星期一, ...

    return { daysInMonth, firstDayOfWeek };
  };

  // 判斷是否為週末
  const isWeekend = (yearMonth: string, day: number) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = dayjs(`${year}-${month}-${day}`);
    const dayOfWeek = date.day();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = 星期日, 6 = 星期六
  };

  // 獲取員工某天的班次
  const getEmployeeShift = (employeeName: string, day: number) => {
    return scheduleData[employeeName as keyof typeof scheduleData]?.[day];
  };

  // 處理班表格子點擊
  const handleCellClick = (employeeName: string, day: number) => {
    if (isEditMode && selectedShift) {
      // 獲取選中的班次資訊
      const selectedShiftInfo = mockShifts.find(s => s.id.toString() === selectedShift);

      if (selectedShiftInfo) {
        // 更新班表資料（深拷貝）
        const newScheduleData = JSON.parse(JSON.stringify(scheduleData));

        // 如果該員工的資料不存在，先初始化
        if (!newScheduleData[employeeName]) {
          newScheduleData[employeeName] = {};
        }

        // 根據班次 ID 設定時間
        let startTime = '08:00';
        let endTime = '17:00';

        switch (selectedShiftInfo.id) {
          case 2: // 診所早班
            startTime = '08:00';
            endTime = '17:00';
            break;
          case 3: // 診所晚班
            startTime = '14:00';
            endTime = '22:00';
            break;
          case 4: // 請假
            startTime = '00:00';
            endTime = '00:00';
            break;
          default:
            startTime = '08:00';
            endTime = '17:00';
        }

        // 只為點擊的那一天添加班次
        newScheduleData[employeeName][day] = {
          shiftId: selectedShiftInfo.id,
          shiftName: selectedShiftInfo.name,
          startTime,
          endTime,
          status: '已確認',
          leave: null,
          overtime: null,
          businessTrip: null,
        };

        // 更新狀態
        setScheduleData(newScheduleData);

        // 標記有變更
        setHasChanges(true);
      }
    }
  };

  // 處理員工展開/收合
  const handleEmployeeToggle = (employeeId: number) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedEmployees(newExpanded);
  };

  // 處理儲存變更
  const handleSaveChanges = () => {
    // 儲存變更：將 scheduleData 寫回 initialScheduleData（深拷貝）
    setInitialScheduleData(JSON.parse(JSON.stringify(scheduleData)));
    setHasChanges(false);
    setIsEditMode(false); // 儲存後退出編輯模式
    setSelectedShift(null); // 清除選中的班次
  };

  // 獲取班次顏色
  const getShiftColor = (shiftName: string) => {
    const shift = mockShifts.find(s => s.name === shiftName);
    return shift?.color || '#6B7280';
  };

  const { daysInMonth } = getMonthDays(selectedMonth);

  return (
    <PageLayout>
      <PageHeader
        icon={Calendar}
        title="班表審核"
        description="用於審核和管理員工排班表"
        iconBgColor="bg-blue-500"
      />

      {/* 第一階段：班表搜尋條件 */}
      <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">班表搜尋條件</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 單位選擇 */}
          <DepartmentSelect
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
          />

          {/* 年度/月份選擇 */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">年度/月份</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請選擇月份"
            />
          </div>

          {/* 工時制選擇 */}
          {/* <WorkSystemSelect
              selectedWorkSystem={_selectedWorkSystem}
              onWorkSystemChange={_setSelectedWorkSystem}
            /> */}
        </div>

        {/* 搜尋按鈕 */}
        <div className="flex justify-end pt-4 border-t border-white/20">
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
            onClick={handleSearchSchedule}
            disabled={!isSelectionComplete}
          >
            <Search className="h-4 w-4 mr-2" />
            搜尋班表
          </Button>
        </div>
      </div>

      {/* 第二階段：班表篩選條件 */}
      {hasSearched && (
        <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6 space-y-6 mt-6">
          <h2 className="text-xl font-semibold text-white">班表篩選條件</h2>

          <div className="space-y-6">
            {/* 人員篩選 */}
            <PersonnelFilter
              personnelFilter={personnelFilter}
              onPersonnelFilterChange={setPersonnelFilter}
            />

            {/* 休假選擇 */}
            {/* <LeaveFilter
                 leaveFilter={_leaveFilter}
                 onLeaveFilterChange={_setLeaveFilter}
               /> */}

            {/* 班次選擇 */}
            {isEditMode ? (
              <ShiftSelector selectedShift={selectedShift} onShiftSelect={setSelectedShift} />
            ) : (
              <ShiftFilter shiftFilter={shiftFilter} onShiftFilterChange={setShiftFilter} />
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="flex gap-3">
              <Button
                className={`${
                  isEditMode
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
                onClick={() => {
                  if (!isEditMode) {
                    // 進入編輯模式：把當前 initialScheduleData 寫入 scheduleData 暫存
                    setScheduleData(JSON.parse(JSON.stringify(initialScheduleData)));
                    setIsEditMode(true);
                  } else {
                    // 取消編輯：把 initialScheduleData 返回 scheduleData（深拷貝）
                    setScheduleData(JSON.parse(JSON.stringify(initialScheduleData)));
                    setHasChanges(false);
                    setIsEditMode(false);
                  }
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? '取消編輯' : '編輯'}
              </Button>
            </div>
            {hasChanges && (
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                onClick={handleSaveChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                檢查並發佈
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 編輯模式提示 */}
      {isEditMode && selectedShift && (
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">已選擇班次，點擊下方班表中的格子來添加班次</p>
        </div>
      )}

      {/* 班表內容 */}
      {hasSearched ? (
        <div className="mt-8">
          {/* 班表標題和操作 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {formatMonthDisplay(selectedMonth)} 班表
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                展開全表
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              統計資訊
            </Button>
          </div>

          {/* 班表網格 */}
          <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-4 py-3 text-white font-medium min-w-[200px]">
                      <div className="flex justify-between items-center">
                        <span>員工</span>
                        <span>{dayjs(selectedMonth).format('M')} 月</span>
                      </div>
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                      <th
                        key={day}
                        className="px-2 py-3 text-center text-white font-medium min-w-[40px]"
                      >
                        <div
                          className={`${isWeekend(selectedMonth, day) ? 'text-red-400' : 'text-white'}`}
                        >
                          {day}
                        </div>
                        <div className="text-xs text-white/60 mt-1">
                          {dayjs(`${selectedMonth}-${day.toString().padStart(2, '0')}`).format(
                            'ddd'
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockEmployees.map(employee => {
                    const isExpanded = expandedEmployees.has(employee.id);
                    return (
                      <React.Fragment key={employee.id}>
                        <tr className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-4 py-3 text-white">
                            <div className="flex items-center justify-between">
                              <span>{employee.name}</span>
                              <button
                                onClick={() => handleEmployeeToggle(employee.id)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-white/60" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-white/60" />
                                )}
                              </button>
                            </div>
                          </td>
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const isWeekendDay = isWeekend(selectedMonth, day);
                            const shift = getEmployeeShift(employee.name, day);

                            return (
                              <td
                                key={day}
                                className={`px-2 py-3 text-center min-w-[40px] ${
                                  isWeekendDay ? 'bg-pink-500/10' : ''
                                } ${isEditMode ? 'cursor-pointer hover:bg-white/10' : ''}`}
                                onClick={() => handleCellClick(employee.name, day)}
                              >
                                {shift && (
                                  <div
                                    className="w-3 h-3 rounded-full mx-auto"
                                    style={{ backgroundColor: getShiftColor(shift.shiftName) }}
                                    title={shift.shiftName}
                                  ></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                        {/* 展開的詳細資訊 */}
                        {isExpanded && (
                          <>
                            {/* 排班時間 */}
                            <tr className="bg-white/5 border-t border-white/10">
                              <td className="px-4 py-2 text-white text-sm font-medium">排班時間</td>
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const shift = getEmployeeShift(employee.name, day);
                                return (
                                  <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                                    {shift ? (
                                      <div className="text-xs text-white/80">
                                        {shift.startTime}-{shift.endTime}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-white/40">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* 班表狀態 */}
                            <tr className="bg-white/5 border-t border-white/10">
                              <td className="px-4 py-2 text-white text-sm font-medium">班表狀態</td>
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const shift = getEmployeeShift(employee.name, day);
                                return (
                                  <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                                    {shift ? (
                                      <div className="text-xs text-green-400">{shift.status}</div>
                                    ) : (
                                      <div className="text-xs text-white/40">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* 請假 */}
                            <tr className="bg-white/5 border-t border-white/10">
                              <td className="px-4 py-2 text-white text-sm font-medium">請假</td>
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const shift = getEmployeeShift(employee.name, day);
                                return (
                                  <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                                    {shift && shift.leave ? (
                                      <div className="text-xs text-red-400">{shift.leave}</div>
                                    ) : (
                                      <div className="text-xs text-white/40">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* 加班 */}
                            <tr className="bg-white/5 border-t border-white/10">
                              <td className="px-4 py-2 text-white text-sm font-medium">加班</td>
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const shift = getEmployeeShift(employee.name, day);
                                return (
                                  <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                                    {shift && shift.overtime ? (
                                      <div className="text-xs text-yellow-400">
                                        {shift.overtime}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-white/40">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* 出差 */}
                            <tr className="bg-white/5 border-t border-white/10">
                              <td className="px-4 py-2 text-white text-sm font-medium">出差</td>
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const shift = getEmployeeShift(employee.name, day);
                                return (
                                  <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                                    {shift && shift.businessTrip ? (
                                      <div className="text-xs text-blue-400">
                                        {shift.businessTrip}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-white/40">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* 未搜尋時的提示 */
        <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-12 text-center mt-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">請先搜尋班表</h3>
          <p className="text-white/60">選擇單位和月份後，點擊搜尋班表即可查看班表資訊</p>
        </div>
      )}
    </PageLayout>
  );
};

export default ScheduleManagement;

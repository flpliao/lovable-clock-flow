import PageHeader from '@/components/layout/PageHeader';
import PageLayout from '@/components/layout/PageLayout';
import {
  DepartmentSelect,
  PersonnelFilter,
  ScheduleGrid,
  ShiftFilter,
  ShiftSelector,
} from '@/components/schedule';
import { Button } from '@/components/ui/button';
import { useDepartment } from '@/hooks/useDepartment';
import { useShift } from '@/hooks/useShift';
import { Employee, EmployeeWorkScheduleData, ScheduleShift } from '@/types/schedule';
import { formatMonthDisplay } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import { Calendar, Edit, Save, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 模擬員工資料
const mockEmployees: Employee[] = [
  { id: 1, name: '楊玄琳', department: '診所' },
  { id: 2, name: '林郁庭', department: '診所' },
  { id: 3, name: '周荃', department: '診所' },
  { id: 4, name: '陳玉楓', department: '診所' },
  { id: 5, name: '廖妍伊', department: '診所' },
];

// 模擬班次資料
const mockShifts: ScheduleShift[] = [
  { id: 2, name: '診所早班', color: '#10B981', code: 'MORNING' },
  { id: 3, name: '診所晚班', color: '#F59E0B', code: 'EVENING' },
  { id: 4, name: '請假', color: '#EF4444', code: 'LEAVE' },
];

// 模擬員工工作排程資料
const mockEmployeeWorkScheduleData: EmployeeWorkScheduleData = {
  楊玄琳: {
    4: {
      employee_id: 1,
      work_schedule_id: 3,
      date: '2024-01-04',
      status: '已確認',
    },
    17: {
      employee_id: 1,
      work_schedule_id: 3,
      date: '2024-01-17',
      status: '已確認',
    },
    20: {
      employee_id: 1,
      work_schedule_id: 3,
      date: '2024-01-20',
      status: '已確認',
    },
    21: {
      employee_id: 1,
      work_schedule_id: 3,
      date: '2024-01-21',
      status: '已確認',
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
  const [employeeWorkScheduleData, setEmployeeWorkScheduleData] = useState(
    mockEmployeeWorkScheduleData
  );
  const [initialEmployeeWorkScheduleData, setInitialEmployeeWorkScheduleData] = useState(
    mockEmployeeWorkScheduleData
  );

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
      const deepCopyData = JSON.parse(JSON.stringify(mockEmployeeWorkScheduleData));
      setEmployeeWorkScheduleData(deepCopyData);
      setInitialEmployeeWorkScheduleData(deepCopyData);
    }
  };

  // 處理月份變更
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
  };

  // 處理班表格子點擊
  const handleCellClick = (employeeName: string, day: number) => {
    if (isEditMode && selectedShift) {
      // 獲取選中的班次資訊
      const selectedShiftInfo = mockShifts.find(s => s.id.toString() === selectedShift);

      if (selectedShiftInfo) {
        // 更新班表資料（深拷貝）
        const newEmployeeWorkScheduleData = JSON.parse(JSON.stringify(employeeWorkScheduleData));

        // 如果該員工的資料不存在，先初始化
        if (!newEmployeeWorkScheduleData[employeeName]) {
          newEmployeeWorkScheduleData[employeeName] = {};
        }

        // 找到對應的員工 ID
        const employee = mockEmployees.find(emp => emp.name === employeeName);
        if (!employee) return;

        // 只為點擊的那一天添加班次
        newEmployeeWorkScheduleData[employeeName][day] = {
          employee_id: employee.id,
          work_schedule_id: selectedShiftInfo.id,
          date: `${selectedMonth}-${day.toString().padStart(2, '0')}`,
          status: '已確認',
        };

        // 更新狀態
        setEmployeeWorkScheduleData(newEmployeeWorkScheduleData);

        // 標記有變更
        setHasChanges(true);
      }
    }
  };

  // 處理儲存變更
  const handleSaveChanges = () => {
    // 儲存變更：將 employeeWorkScheduleData 寫回 initialEmployeeWorkScheduleData（深拷貝）
    setInitialEmployeeWorkScheduleData(JSON.parse(JSON.stringify(employeeWorkScheduleData)));
    setHasChanges(false);
    setIsEditMode(false); // 儲存後退出編輯模式
    setSelectedShift(null); // 清除選中的班次
  };

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
                    // 進入編輯模式：把當前 initialEmployeeWorkScheduleData 寫入 employeeWorkScheduleData 暫存
                    setEmployeeWorkScheduleData(
                      JSON.parse(JSON.stringify(initialEmployeeWorkScheduleData))
                    );
                    setIsEditMode(true);
                  } else {
                    // 取消編輯：把 initialEmployeeWorkScheduleData 返回 employeeWorkScheduleData（深拷貝）
                    setEmployeeWorkScheduleData(
                      JSON.parse(JSON.stringify(initialEmployeeWorkScheduleData))
                    );
                    setHasChanges(false);
                    setIsEditMode(false);
                    setSelectedShift(null); // 清除選中的班次
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
      {isEditMode && (
        <div className="mt-6 text-center">
          {selectedShift ? (
            <p className="text-white/80 text-sm">已選擇班次，點擊下方班表中的格子來排班</p>
          ) : (
            <p className="text-white/80 text-sm">請選擇一個班次，然後點擊下方班表中的格子來排班</p>
          )}
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
          <ScheduleGrid
            employees={mockEmployees}
            employeeWorkScheduleData={employeeWorkScheduleData}
            selectedMonth={selectedMonth}
            isEditMode={isEditMode}
            onCellClick={handleCellClick}
          />
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

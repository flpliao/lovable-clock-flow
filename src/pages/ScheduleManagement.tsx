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
import { useEmployeeWorkSchedule } from '@/hooks/useEmployeeWorkSchedule';
import { useShift } from '@/hooks/useShift';
import type { EmployeeWithWorkSchedules, EmployeesBySlug } from '@/types/employee';

import { formatMonthDisplay } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import { Calendar, Edit, Save, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ScheduleManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  // const [selectedWorkSystem, setSelectedWorkSystem] = useState<string>('standard');
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('YYYY-MM'));
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [personnelFilter, setPersonnelFilter] = useState<'all' | 'workSystem'>('all');
  // const [leaveFilter, setLeaveFilter] = useState({
  //   all: true,
  //   leave: true,
  //   monthlyLeave: true,
  //   nationalHoliday: true,
  //   restDay: true,
  //   regularHoliday: true,
  // });
  const [shiftFilter, setShiftFilter] = useState<{ all: boolean; [key: string]: boolean }>({
    all: true,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [employees, setEmployees] = useState<EmployeeWithWorkSchedules[]>([]);
  // const [employeesBySlug, setEmployeesBySlug] = useState<EmployeesBySlug>({});
  const [initialEmployees, setInitialEmployees] = useState<EmployeesBySlug>({});

  const { loadAllShifts, getShiftBySlug, shifts } = useShift();
  const {
    getEmployeesByDepartment,
    isDepartmentPeriodLoaded,
    loadDepartmentByMonth,
    handleBulkSyncEmployeeWorkSchedules,
  } = useEmployeeWorkSchedule();

  const { loadDepartments } = useDepartment();

  useEffect(() => {
    loadDepartments();
    loadAllShifts();
  }, [loadDepartments, loadAllShifts]);

  // 當 shifts 載入後，初始化 shiftFilter
  useEffect(() => {
    if (shifts.length > 0) {
      const initialShiftFilter: { all: boolean; [key: string]: boolean } = { all: true };
      shifts.forEach(shift => {
        initialShiftFilter[shift.slug] = true;
      });
      setShiftFilter(initialShiftFilter);
    }
  }, [shifts]);

  // 當部門或員工資料變化時，更新員工列表
  useEffect(() => {
    if (
      selectedDepartment &&
      selectedMonth &&
      !isDepartmentPeriodLoaded(selectedDepartment, selectedMonth)
    ) {
      setHasSearched(false);
    } else {
      const departmentEmployees = getEmployeesByDepartment(selectedDepartment);
      if (departmentEmployees.length > 0) {
        setEmployees(departmentEmployees);
        setHasSearched(true);
      }
    }
  }, [selectedDepartment, selectedMonth, isDepartmentPeriodLoaded, getEmployeesByDepartment]);

  // 檢查是否已選擇單位和月份
  const isSelectionComplete = selectedDepartment && selectedMonth;

  // 處理搜尋班表
  const handleSearchSchedule = async () => {
    if (isSelectionComplete) {
      // 載入部門特定月份的員工資料，直接使用返回的資料
      const departmentEmployees = await loadDepartmentByMonth(
        selectedDepartment,
        parseInt(selectedMonth.split('-')[0]), // year
        parseInt(selectedMonth.split('-')[1]) // month
      );

      // 除錯：檢查載入後的資料結構
      console.log('載入的員工資料:', {
        employeesCount: departmentEmployees.length,
        firstEmployee: departmentEmployees[0]
          ? {
              slug: departmentEmployees[0].slug,
              workSchedulesCount: departmentEmployees[0].work_schedules?.length || 0,
              sampleWorkSchedule: departmentEmployees[0].work_schedules?.[0] || null,
            }
          : 'no employees',
      });

      const deepCopyData = JSON.parse(JSON.stringify(departmentEmployees));
      setEmployees(deepCopyData);
      setInitialEmployees(deepCopyData);
      setHasSearched(true);
    }
  };

  // 處理月份變更
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
    // 當月份變更時，重置搜尋狀態
    setHasSearched(false);
    setHasChanges(false);
    setIsEditMode(false);
    setSelectedShift(null);
    // 清空員工資料
    setEmployees([]);
    setInitialEmployees({});
  };

  // 處理班表格子點擊
  const handleCellClick = (employeeSlug: string, day: number) => {
    if (isEditMode && selectedShift) {
      // 找到對應的員工
      const employee = employees.find(emp => emp.slug === employeeSlug);
      if (!employee) return;

      // 找到選中的班次
      const shift = getShiftBySlug(selectedShift);
      if (!shift) return;

      // 找到該班次的第一個工作時程（如果有的話）
      const workSchedule = shift.work_schedules?.[0];
      if (!workSchedule) return;

      // 將 shift 資訊塞回 workSchedule
      const workScheduleWithShift = {
        ...workSchedule,
        shift: shift,
      };

      // 更新班表資料（深拷貝）
      const newEmployees = [...employees];

      // 找到員工索引
      const employeeIndex = newEmployees.findIndex(emp => emp.slug === employeeSlug);
      if (employeeIndex === -1) return;

      // 如果該員工的 work_schedules 不存在，先初始化為陣列
      if (!newEmployees[employeeIndex].work_schedules) {
        newEmployees[employeeIndex].work_schedules = [];
      }

      // 構建完整的日期字串 (YYYY-MM-DD)
      const fullDate = `${selectedMonth}-${day.toString().padStart(2, '0')}`;

      // 準備新的工作排程（含 pivot.date）
      const newWorkSchedule = {
        ...workScheduleWithShift,
        pivot: { ...workScheduleWithShift.pivot, date: fullDate },
      };

      // 移除該日期的舊排程
      const filteredSchedules = newEmployees[employeeIndex].work_schedules!.filter(
        ws => ws.pivot?.date !== fullDate
      );

      // 新增新排程
      newEmployees[employeeIndex].work_schedules = [...filteredSchedules, newWorkSchedule];

      // 更新狀態
      setEmployees(newEmployees);

      // 標記有變更
      setHasChanges(true);
    }
  };

  // 處理儲存變更
  const handleSaveChanges = async () => {
    // 儲存變更：使用結構化資料格式進行同步
    const date = dayjs(selectedMonth);

    console.log('準備儲存班表:', {
      selectedMonth,
      year: date.year(),
      month: date.month() + 1,
      employeesCount: employees.length,
      sampleEmployee: employees[0]
        ? {
            slug: employees[0].slug,
            workSchedulesKeys: employees[0].work_schedules
              ? Object.keys(employees[0].work_schedules)
              : [],
          }
        : null,
    });

    // 使用結構化資料格式進行同步
    await handleBulkSyncEmployeeWorkSchedules(
      employees,
      date.year(),
      date.month() + 1, // dayjs.month() 回傳 0-11，需要加 1
      () => {
        console.log('班表儲存成功');
        setInitialEmployees(JSON.parse(JSON.stringify(employees)));
        handleEditFinish();
      },
      () => {
        // 錯誤處理 - 可以在這裡添加錯誤提示
        console.error('儲存班表失敗');
      }
    );
  };

  const handleEditFinish = () => {
    setHasChanges(false);
    setIsEditMode(false); // 儲存後退出編輯模式
    setSelectedShift(null); // 清除選中的班次
  };

  // 處理班次選擇
  const handleShiftSelect = (shiftSlug: string | null) => {
    setSelectedShift(shiftSlug);
  };

  // 處理編輯模式切換
  const handleEditToggle = () => {
    if (!isEditMode) {
      // 進入編輯模式：把當前 initialEmployeesBySlug 寫入 EmployeesBySlug 暫存
      setEmployees(JSON.parse(JSON.stringify(initialEmployees)));
      setIsEditMode(true);
    } else {
      // 取消編輯：把 initialEmployeesBySlug 返回 EmployeesBySlug（深拷貝）
      setEmployees(JSON.parse(JSON.stringify(initialEmployees)));
      setHasChanges(false);
      setIsEditMode(false);
      setSelectedShift(null); // 清除選中的班次
    }
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
              selectedWorkSystem={selectedWorkSystem}
              onWorkSystemChange={setSelectedWorkSystem}
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
                 leaveFilter={leaveFilter}
                 onLeaveFilterChange={setLeaveFilter}
               /> */}

            {/* 班次選擇 */}
            {isEditMode ? (
              <ShiftSelector selectedShift={selectedShift} onShiftSelect={handleShiftSelect} />
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
                onClick={handleEditToggle}
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
            employees={employees}
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

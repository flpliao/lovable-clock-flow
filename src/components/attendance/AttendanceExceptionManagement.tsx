import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus } from 'lucide-react';
import {
  AdvancedFilter,
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import {
  getExceptionTypeText,
  getExceptionStatusText,
  getExceptionStatusColor,
} from '@/utils/attendanceExceptionUtils';
import { useStaffManagementSafe } from '@/components/company/hooks/useStaffManagementSafe';
import { AttendanceException } from '@/types/attendance';

interface AttendanceExceptionWithStaff extends AttendanceException {
  staff_name?: string;
  staff_department?: string;
  staff_position?: string;
}

const AttendanceExceptionManagement: React.FC = () => {
  // 使用真實的員工資料
  const { staffList } = useStaffManagementSafe();

  // 模擬異常資料，但使用真實員工資料
  const exceptions: AttendanceExceptionWithStaff[] =
    staffList.length > 0
      ? [
          {
            id: '1',
            staff_id: staffList[0]?.id || '',
            staff_name: staffList[0]?.name || '張小明',
            staff_department: staffList[0]?.department || 'IT部',
            staff_position: staffList[0]?.position || '工程師',
            exception_date: '2024-01-15',
            exception_type: 'missing_check_in',
            reason: '忘記打卡',
            status: 'pending',
            created_at: '2024-01-15T09:00:00Z',
            updated_at: '2024-01-15T09:00:00Z',
          },
          {
            id: '2',
            staff_id: staffList[1]?.id || '',
            staff_name: staffList[1]?.name || '李小華',
            staff_department: staffList[1]?.department || 'HR部',
            staff_position: staffList[1]?.position || '人事專員',
            exception_date: '2024-01-14',
            exception_type: 'late_check_in',
            reason: '交通堵塞',
            status: 'approved',
            created_at: '2024-01-14T10:30:00Z',
            updated_at: '2024-01-14T10:30:00Z',
          },
        ]
      : [];

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'staff_name', label: '員工姓名' },
    { value: 'staff_department', label: '部門' },
    { value: 'staff_position', label: '職位' },
    { value: 'exception_type', label: '異常類型' },
    { value: 'status', label: '狀態' },
    { value: 'exception_date', label: '異常日期' },
    { value: 'reason', label: '異常原因' },
  ];

  // 篩選函數
  const applyExceptionFilter = (
    exception: AttendanceExceptionWithStaff,
    conditionGroups: FilterGroup[]
  ) => {
    return applyMultiConditionFilter(exception, conditionGroups, (item, field) => {
      if (field === 'staff_name') {
        return item.staff_name || '';
      }
      if (field === 'staff_department') {
        return item.staff_department || '';
      }
      if (field === 'staff_position') {
        return item.staff_position || '';
      }
      if (field === 'exception_type') {
        return getExceptionTypeText(item.exception_type);
      }
      if (field === 'status') {
        return getExceptionStatusText(item.status);
      }
      return (item[field as keyof AttendanceExceptionWithStaff] || '').toString();
    });
  };

  // 使用通用篩選 Hook
  const {
    conditionGroups,
    filteredData: filteredExceptions,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
  } = useAdvancedFilter({
    data: exceptions,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: applyExceptionFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center">
          <Clock className="h-5 w-5 mr-3 text-white" />
          打卡異常處理
        </h2>
        <Button className="bg-blue-500/90 hover:bg-blue-600/90 text-white shadow-lg backdrop-blur-xl border border-blue-400/50">
          <Plus className="h-4 w-4 mr-2" />
          新增異常
        </Button>
      </div>

      {/* 使用通用篩選組件 */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={exceptions}
        filteredData={filteredExceptions}
        applyFilter={applyExceptionFilter}
        title="出勤異常篩選"
        showAdvancedFilters={showAdvancedFilters}
        onShowAdvancedFiltersChange={setShowAdvancedFilters}
        onClearAll={clearAllConditions}
      />

      {/* 異常記錄列表 */}
      <div className="space-y-4">
        {filteredExceptions.map(exception => (
          <div
            key={exception.id}
            className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{exception.staff_name}</h3>
                    <Badge className={`${getExceptionStatusColor(exception.status)} shadow-md`}>
                      {getExceptionStatusText(exception.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700 font-medium">部門職位:</span>
                      <p className="text-gray-900 mt-1">
                        {exception.staff_department} - {exception.staff_position}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">異常類型:</span>
                      <p className="text-gray-900 mt-1">
                        {getExceptionTypeText(exception.exception_type)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">異常日期:</span>
                  <p className="text-gray-900 font-medium mt-1">{exception.exception_date}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">申請時間:</span>
                  <p className="text-gray-900 mt-1">
                    {new Date(exception.created_at).toLocaleString('zh-TW')}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <span className="text-gray-700 font-medium">異常原因:</span>
                <p className="text-gray-900 mt-2 bg-white/30 rounded-lg p-3">{exception.reason}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  className="bg-white/50 border-white/60 text-gray-900 hover:bg-white/70"
                >
                  查看詳情
                </Button>
                {exception.status === 'pending' && (
                  <>
                    <Button className="bg-green-500/90 hover:bg-green-600/90 text-white shadow-md">
                      核准申請
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-red-500/20 border-red-500/50 text-red-700 hover:bg-red-500/30"
                    >
                      拒絕申請
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredExceptions.length === 0 && (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-12">
            <div className="text-center">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {staffList.length === 0 ? '尚未載入員工資料' : '沒有找到相關的異常記錄'}
              </h3>
              <p className="text-gray-700">
                {staffList.length === 0 ? '請稍候系統載入員工資料' : '請嘗試調整搜尋條件或篩選器'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceExceptionManagement;

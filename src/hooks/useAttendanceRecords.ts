import { useCallback, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { permissionService } from '@/services/simplifiedPermissionService';
import { AttendanceRecordService } from '@/services/attendanceRecordService';
import {
  useAttendanceRecordStore,
  type AttendanceAnomalyRecord,
  type ExtendedCheckInRecord,
} from '@/stores/attendanceRecordStore';
import { eachDayOfInterval, isFuture, format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

export function useAttendanceRecords() {
  const { toast } = useToast();

  // Store狀態和操作
  const {
    // 資料狀態
    staffList,
    departments,
    allRecords,
    allSchedules,
    allMissedRequests,

    // UI狀態
    loading,
    activeTab,
    currentPage,
    filters,

    // 操作
    setStaffList,
    setDepartments,
    setAllRecords,
    setAllSchedules,
    setAllMissedRequests,
    setLoading,
    setActiveTab,
    setCurrentPage,
    setFilters,
    clearFilters,
    clearAllData,
  } = useAttendanceRecordStore();

  // 權限檢查
  const permissions = useMemo(
    () => ({
      canDeleteRecords:
        permissionService.hasPermission('check_in_records:delete') || permissionService.isAdmin(),
      canCreateMissedRequests:
        permissionService.hasPermission('missed_checkin:manage') || permissionService.isAdmin(),
      canViewAll:
        permissionService.isAdmin() || permissionService.hasPermission('attendance:view_all'),
    }),
    []
  );

  // 載入基礎資料
  const loadBaseData = useCallback(async () => {
    try {
      setLoading(true);
      const { staffList: staff, departments: depts } = await AttendanceRecordService.loadBaseData();
      setStaffList(staff);
      setDepartments(depts);

      console.log('✅ useAttendanceRecords: 基礎資料載入完成', {
        staffCount: staff.length,
        departmentCount: depts.length,
      });
    } catch (error) {
      console.error('❌ useAttendanceRecords: 載入基礎資料失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入基礎資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setStaffList, setDepartments, toast]);

  // 載入出勤資料
  const loadAttendanceData = useCallback(async () => {
    if (!filters.startDate || !filters.endDate) return;

    try {
      setLoading(true);
      const { records, schedules, missedRequests } =
        await AttendanceRecordService.loadAttendanceData(filters.startDate, filters.endDate);

      setAllRecords(records);
      setAllSchedules(schedules);
      setAllMissedRequests(missedRequests);

      console.log('✅ useAttendanceRecords: 出勤資料載入完成', {
        recordsCount: records.length,
        schedulesCount: schedules.length,
        missedRequestsCount: missedRequests.length,
      });
    } catch (error) {
      console.error('❌ useAttendanceRecords: 載入出勤資料失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入出勤資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [
    filters.startDate,
    filters.endDate,
    setLoading,
    setAllRecords,
    setAllSchedules,
    setAllMissedRequests,
    toast,
  ]);

  // 計算異常記錄
  const calculateAnomalies = useMemo(() => {
    if (!filters.startDate || !filters.endDate || allSchedules.length === 0) {
      return [];
    }

    const anomalies: AttendanceAnomalyRecord[] = [];
    const startDate = filters.startDate;
    const endDate = filters.endDate;
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

    // 按員工分組排班記錄
    const schedulesByStaff = allSchedules.reduce(
      (acc, schedule) => {
        if (!acc[schedule.user_id]) {
          acc[schedule.user_id] = [];
        }
        acc[schedule.user_id].push(schedule);
        return acc;
      },
      {} as Record<string, typeof allSchedules>
    );

    // 按員工和日期分組打卡記錄
    const recordsByStaffAndDate = allRecords.reduce(
      (acc, record) => {
        const date = format(new Date(record.timestamp), 'yyyy-MM-dd');
        const key = `${record.userId}_${date}`;
        if (!acc[key]) {
          acc[key] = { checkIn: undefined, checkOut: undefined };
        }
        if (record.action === 'check-in') {
          acc[key].checkIn = record;
        } else {
          acc[key].checkOut = record;
        }
        return acc;
      },
      {} as Record<string, { checkIn?: ExtendedCheckInRecord; checkOut?: ExtendedCheckInRecord }>
    );

    // 按員工和日期分組忘打卡申請
    const missedByStaffAndDate = allMissedRequests.reduce(
      (acc, request) => {
        const key = `${request.staff_id}_${request.request_date}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(request);
        return acc;
      },
      {} as Record<string, typeof allMissedRequests>
    );

    // 檢查每個員工的每個工作日
    Object.entries(schedulesByStaff).forEach(([staffId, staffSchedules]) => {
      const staff = staffList.find(s => s.id === staffId);
      if (!staff) return;

      daysInRange.forEach(day => {
        // 跳過未來日期
        if (isFuture(day)) return;

        const dateStr = format(day, 'yyyy-MM-dd');
        const schedule = staffSchedules.find(s => s.work_date === dateStr);
        // 只檢查有排班的日期
        if (!schedule) return;

        const recordKey = `${staffId}_${dateStr}`;
        const dayRecords = recordsByStaffAndDate[recordKey];
        const missedRequests = missedByStaffAndDate[`${staff.id}_${dateStr}`] || [];

        // 檢查打卡狀況
        const hasCheckIn = dayRecords?.checkIn?.status === 'success';
        const hasCheckOut = dayRecords?.checkOut?.status === 'success';

        // 檢查已核准的忘打卡申請
        const approvedCheckInRequest = missedRequests.find(
          r => r.status === 'approved' && r.missed_type === 'check_in'
        );
        const approvedCheckOutRequest = missedRequests.find(
          r => r.status === 'approved' && r.missed_type === 'check_out'
        );

        // 判斷是否有有效的記錄
        const hasValidCheckIn = hasCheckIn || !!approvedCheckInRequest;
        const hasValidCheckOut = hasCheckOut || !!approvedCheckOutRequest;

        // 檢查異常情況
        if (!hasValidCheckIn && !hasValidCheckOut) {
          // 雙重異常
          const hasAnyApprovedRequest = missedRequests.some(r => r.status === 'approved');

          if (!hasAnyApprovedRequest) {
            const description = '上班未打卡 / 下班未打卡';
            const hasMissedRequest = missedRequests.length > 0;
            let missedRequestStatus: 'pending' | 'approved' | 'rejected' | undefined = undefined;

            if (hasMissedRequest) {
              const pendingRequest = missedRequests.find(r => r.status === 'pending');
              const rejectedRequest = missedRequests.find(r => r.status === 'rejected');

              if (pendingRequest) {
                missedRequestStatus = 'pending';
              } else if (rejectedRequest) {
                missedRequestStatus = 'rejected';
              }
            }

            anomalies.push({
              id: `${staffId}_${dateStr}`,
              staff_id: staffId,
              staff_name: staff.name,
              department: staff.department,
              date: dateStr,
              anomaly_type: 'both_missing',
              description,
              has_missed_request: hasMissedRequest,
              missed_request_status: missedRequestStatus,
              schedule,
            });
          }
        } else if (!hasValidCheckIn) {
          // 只缺上班記錄
          const checkInMissedRequests = missedRequests.filter(r => r.missed_type === 'check_in');
          const hasMissedRequest = checkInMissedRequests.length > 0;
          const hasApprovedCheckInRequest = checkInMissedRequests.some(
            r => r.status === 'approved'
          );

          if (!hasApprovedCheckInRequest) {
            let missedRequestStatus = undefined;

            if (hasMissedRequest) {
              const pendingRequest = checkInMissedRequests.find(r => r.status === 'pending');
              const rejectedRequest = checkInMissedRequests.find(r => r.status === 'rejected');

              if (pendingRequest) {
                missedRequestStatus = 'pending';
              } else if (rejectedRequest) {
                missedRequestStatus = 'rejected';
              }
            }

            anomalies.push({
              id: `${staffId}_${dateStr}_checkin`,
              staff_id: staffId,
              staff_name: staff.name,
              department: staff.department,
              date: dateStr,
              anomaly_type: 'missing_check_in',
              description: '上班未打卡',
              has_missed_request: hasMissedRequest,
              missed_request_status: missedRequestStatus,
              schedule,
            });
          }
        } else if (!hasValidCheckOut) {
          // 只缺下班記錄
          const checkOutMissedRequests = missedRequests.filter(r => r.missed_type === 'check_out');
          const hasMissedRequest = checkOutMissedRequests.length > 0;
          const hasApprovedCheckOutRequest = checkOutMissedRequests.some(
            r => r.status === 'approved'
          );

          if (!hasApprovedCheckOutRequest) {
            let missedRequestStatus = undefined;

            if (hasMissedRequest) {
              const pendingRequest = checkOutMissedRequests.find(r => r.status === 'pending');
              const rejectedRequest = checkOutMissedRequests.find(r => r.status === 'rejected');

              if (pendingRequest) {
                missedRequestStatus = 'pending';
              } else if (rejectedRequest) {
                missedRequestStatus = 'rejected';
              }
            }

            anomalies.push({
              id: `${staffId}_${dateStr}_checkout`,
              staff_id: staffId,
              staff_name: staff.name,
              department: staff.department,
              date: dateStr,
              anomaly_type: 'missing_check_out',
              description: '下班未打卡',
              has_missed_request: hasMissedRequest,
              missed_request_status: missedRequestStatus,
              schedule,
            });
          }
        }
      });
    });

    return anomalies.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.staff_name.localeCompare(b.staff_name);
    });
  }, [allSchedules, allRecords, allMissedRequests, staffList, filters.startDate, filters.endDate]);

  // 應用篩選的異常記錄
  const filteredAnomalies = useMemo(() => {
    let filtered = calculateAnomalies;

    // 部門篩選
    if (filters.department !== 'all') {
      filtered = filtered.filter(record => record.department === filters.department);
    }

    // 員工篩選
    if (filters.staffId !== 'all') {
      filtered = filtered.filter(record => record.staff_id === filters.staffId);
    }

    // 原因篩選
    if (filters.reason.trim()) {
      filtered = filtered.filter(record =>
        record.description.toLowerCase().includes(filters.reason.toLowerCase())
      );
    }

    // 隱藏有申請記錄的篩選
    if (filters.hideWithRequests) {
      filtered = filtered.filter(record => !record.has_missed_request);
    }

    return filtered;
  }, [calculateAnomalies, filters]);

  // 正常記錄篩選
  const filteredNormalRecords = useMemo(() => {
    let filtered = allRecords;

    // 部門篩選
    if (filters.department !== 'all') {
      filtered = filtered.filter(record => record.staff?.department === filters.department);
    }

    // 員工篩選
    if (filters.staffId !== 'all') {
      filtered = filtered.filter(record => record.userId === filters.staffId);
    }

    return filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [allRecords, filters]);

  // 分頁邏輯
  const paginationData = useMemo(() => {
    const currentData = activeTab === 'normal' ? filteredNormalRecords : filteredAnomalies;
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPageData = currentData.slice(startIndex, endIndex);

    return {
      currentData: currentPageData,
      totalPages,
      totalItems: currentData.length,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [activeTab, filteredNormalRecords, filteredAnomalies, currentPage]);

  // 刪除打卡記錄
  const deleteRecord = useCallback(
    async (recordId: string) => {
      if (!permissions.canDeleteRecords) {
        toast({
          title: '權限不足',
          description: '您沒有權限刪除打卡記錄',
          variant: 'destructive',
        });
        return;
      }

      try {
        await AttendanceRecordService.deleteRecord(recordId);
        toast({
          title: '刪除成功',
          description: '打卡記錄已刪除',
        });
        // 重新載入資料
        await loadAttendanceData();
      } catch (error) {
        console.error('❌ useAttendanceRecords: 刪除打卡記錄失敗:', error);
        toast({
          title: '刪除失敗',
          description: error instanceof Error ? error.message : '無法刪除打卡記錄',
          variant: 'destructive',
        });
      }
    },
    [permissions.canDeleteRecords, toast, loadAttendanceData]
  );

  // 忘打卡補登
  const createMissedCheckinCompensation = useCallback(
    async (record: AttendanceAnomalyRecord) => {
      if (!permissions.canCreateMissedRequests) {
        toast({
          title: '權限不足',
          description: '您沒有權限執行忘打卡補登操作',
          variant: 'destructive',
        });
        return;
      }

      if (!record.schedule) {
        toast({
          title: '補登失敗',
          description: '無法找到對應的班表記錄',
          variant: 'destructive',
        });
        return;
      }

      try {
        setLoading(true);
        const result = await AttendanceRecordService.createMissedCheckinCompensation(
          record.staff_id,
          record.date,
          record.anomaly_type,
          record.schedule,
          staffList
        );

        toast({
          title: '補登成功',
          description: result.message,
        });

        // 重新載入資料
        await loadAttendanceData();
      } catch (error) {
        console.error('❌ useAttendanceRecords: 忘打卡補登失敗:', error);
        toast({
          title: '補登失敗',
          description: error instanceof Error ? error.message : '無法完成忘打卡補登',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [permissions.canCreateMissedRequests, staffList, setLoading, toast, loadAttendanceData]
  );

  // 重新載入資料
  const refresh = useCallback(async () => {
    await loadAttendanceData();
    const currentData = activeTab === 'normal' ? filteredNormalRecords : filteredAnomalies;
    toast({
      title: '重新載入成功',
      description: `已載入 ${currentData.length} 筆記錄`,
    });
  }, [loadAttendanceData, activeTab, filteredNormalRecords, filteredAnomalies, toast]);

  // 搜尋
  const search = useCallback(() => {
    setCurrentPage(1);
    loadAttendanceData();
  }, [setCurrentPage, loadAttendanceData]);

  // 分頁控制
  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, [setCurrentPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages));
  }, [setCurrentPage, paginationData.totalPages]);

  // 初始化載入
  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  useEffect(() => {
    if (staffList.length > 0) {
      loadAttendanceData();
    }
  }, [loadAttendanceData, staffList.length]);

  return {
    // 資料狀態
    staffList,
    departments,
    allRecords,
    allSchedules,
    allMissedRequests,

    // 計算後的資料
    filteredNormalRecords,
    filteredAnomalies,
    paginationData,

    // UI狀態
    loading,
    activeTab,
    currentPage,
    filters,

    // 權限
    permissions,

    // 操作方法
    setActiveTab,
    setCurrentPage,
    setFilters,
    clearFilters,
    clearAllData,

    // 業務操作
    loadBaseData,
    loadAttendanceData,
    deleteRecord,
    createMissedCheckinCompensation,
    refresh,
    search,
    goToPreviousPage,
    goToNextPage,
  };
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { permissionService } from '@/services/simplifiedPermissionService';
import { scheduleService, Schedule as SupabaseSchedule } from '@/services/scheduleService';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { formatDate, formatTime } from '@/utils/checkInUtils';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  X,
  FileText,
  Clock,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { format, eachDayOfInterval, isFuture, subDays } from 'date-fns';

const ITEMS_PER_PAGE = 10;

// Staff資料類型
interface StaffMember {
  id: string;
  user_id: string;
  name: string;
  department: string;
  position: string;
  branch_name: string;
}

// 出勤異常記錄類型
interface AttendanceAnomalyRecord {
  id: string;
  staff_id: string;
  staff_name: string;
  department: string;
  date: string;
  anomaly_type: string;
  description: string;
  has_missed_request: boolean;
  missed_request_status?: 'pending' | 'approved' | 'rejected';
  schedule?: SupabaseSchedule;
}

// 擴展CheckInRecord類型，包含員工資料
interface ExtendedCheckInRecord extends CheckInRecord {
  staff?: StaffMember | null;
}

// 篩選條件類型
interface FilterConditions {
  startDate: Date | undefined;
  endDate: Date | undefined;
  department: string;
  staffId: string;
  reason: string;
  hideWithRequests: boolean;
}

const AttendanceRecordManagement: React.FC = () => {
  const { toast } = useToast();

  // 狀態管理
  const [activeTab, setActiveTab] = useState<'normal' | 'anomaly'>('normal');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 權限檢查
  const canDeleteRecords = useMemo(() => {
    return (
      permissionService.hasPermission('check_in_records:delete') || permissionService.isAdmin()
    );
  }, []);

  const canCreateMissedRequests = useMemo(() => {
    return (
      permissionService.hasPermission('missed_checkin:create') ||
      permissionService.hasPermission('missed_checkin:manage') ||
      permissionService.isAdmin()
    );
  }, []);

  // 資料狀態
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [allRecords, setAllRecords] = useState<ExtendedCheckInRecord[]>([]);
  const [allSchedules, setAllSchedules] = useState<SupabaseSchedule[]>([]);
  const [allMissedRequests, setAllMissedRequests] = useState<MissedCheckinRequest[]>([]);

  // 篩選條件狀態
  const [filters, setFilters] = useState<FilterConditions>({
    startDate: subDays(new Date(), 14), // 預設查詢最近14天
    endDate: new Date(),
    department: 'all',
    staffId: 'all',
    reason: '',
    hideWithRequests: false,
  });

  // 載入基礎資料
  const loadBaseData = useCallback(async () => {
    try {
      setLoading(true);

      // 載入員工資料
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, user_id, name, department, position, branch_name')
        .order('name');

      if (staffError) throw staffError;
      setStaffList(staffData || []);

      // 獲取所有部門列表
      const uniqueDepartments = [
        ...new Set((staffData || []).map(s => s.department).filter(Boolean)),
      ];
      setDepartments(uniqueDepartments);

      console.log('✅ 基礎資料載入完成', {
        staffCount: staffData?.length || 0,
        departmentCount: uniqueDepartments.length,
      });
    } catch (error) {
      console.error('❌ 載入基礎資料失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入基礎資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 載入打卡和排班資料
  const loadAttendanceData = useCallback(async () => {
    if (!filters.startDate || !filters.endDate) return;

    try {
      setLoading(true);
      const startDateStr = format(filters.startDate, 'yyyy-MM-dd');
      const endDateStr = format(filters.endDate, 'yyyy-MM-dd');

      // 根據權限決定查詢範圍
      let recordsQuery = supabase
        .from('check_in_records')
        .select(
          `
          *,
          staff:staff_id (
            id,
            user_id,
            name,
            department,
            position,
            branch_name
          )
        `
        )
        .gte('timestamp', startDateStr)
        .lte('timestamp', endDateStr + ' 23:59:59')
        .eq('status', 'success')
        .order('timestamp', { ascending: false });

      // 如果不是管理員，只能查看自己的記錄
      if (!permissionService.isAdmin() && !permissionService.hasPermission('attendance:view_all')) {
        // 需要從當前用戶的員工資料中獲取staff_id
        const { data: currentStaff, error: staffError } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (staffError || !currentStaff) {
          throw new Error('無法獲取當前用戶的員工資料');
        }

        recordsQuery = recordsQuery.eq('staff_id', currentStaff.id);
      }

      // 載入打卡記錄，同時載入員工資料
      const { data: recordsData, error: recordsError } = await recordsQuery;

      if (recordsError) throw recordsError;

      // 載入排班記錄 - 同樣根據權限控制
      let schedules: SupabaseSchedule[];
      if (permissionService.isAdmin() || permissionService.hasPermission('schedule:view_all')) {
        schedules = await scheduleService.getSchedulesForDateRange(startDateStr, endDateStr);
      } else {
        // 只載入當前用戶的排班
        const { data: currentStaff } = await supabase
          .from('staff')
          .select('user_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (currentStaff) {
          const userSchedules = await scheduleService.getSchedulesForUser(currentStaff.user_id);
          // 在客戶端過濾日期範圍
          schedules = userSchedules.filter(
            schedule => schedule.work_date >= startDateStr && schedule.work_date <= endDateStr
          );
        } else {
          schedules = [];
        }
      }

      // 載入忘打卡申請 - 根據權限控制
      let missedQuery = supabase
        .from('missed_checkin_requests')
        .select('*')
        .gte('request_date', startDateStr)
        .lte('request_date', endDateStr);

      // 如果不是管理員，只能查看自己的忘打卡申請
      if (
        !permissionService.isAdmin() &&
        !permissionService.hasPermission('missed_checkin:view_all')
      ) {
        const { data: currentStaff } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (currentStaff) {
          missedQuery = missedQuery.eq('staff_id', currentStaff.id);
        }
      }

      const { data: missedData, error: missedError } = await missedQuery;

      if (missedError) throw missedError;

      // 轉換打卡記錄格式，包含員工資料
      const formattedRecords: ExtendedCheckInRecord[] = (recordsData || []).map(record => ({
        id: record.id,
        userId: record.user_id,
        timestamp: record.timestamp,
        action: record.action as 'check-in' | 'check-out',
        type: record.type as 'location' | 'ip',
        status: record.status as 'success' | 'failed',
        details: {
          ip: String(('ip' in record ? record.ip : '') || ''),
          locationName: record.department_name || '',
          distance: record.distance || 0,
        },
        staff: record.staff
          ? {
              id: record.staff.id,
              user_id: record.staff.user_id,
              name: record.staff.name,
              department: record.staff.department,
              position: record.staff.position,
              branch_name: record.staff.branch_name,
            }
          : null,
      }));

      // 轉換忘打卡申請格式
      const formattedMissedRequests: MissedCheckinRequest[] = (missedData || []).map(request => ({
        ...request,
        missed_type: request.missed_type as 'check_in' | 'check_out',
        status: request.status as 'pending' | 'approved' | 'rejected',
      }));

      setAllRecords(formattedRecords);
      setAllSchedules(schedules);
      setAllMissedRequests(formattedMissedRequests);

      console.log('✅ 出勤資料載入完成', {
        recordsCount: recordsData?.length || 0,
        schedulesCount: schedules.length,
        missedRequestsCount: missedData?.length || 0,
      });
    } catch (error) {
      console.error('❌ 載入出勤資料失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入出勤資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, toast]);

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
      {} as Record<string, SupabaseSchedule[]>
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
      {} as Record<string, MissedCheckinRequest[]>
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

        // 檢查已核准的忘打卡申請 - 修正邏輯
        const approvedCheckInRequest = missedRequests.find(
          r => r.status === 'approved' && r.missed_type === 'check_in'
        );
        const approvedCheckOutRequest = missedRequests.find(
          r => r.status === 'approved' && r.missed_type === 'check_out'
        );

        // 判斷是否有有效的上班記錄（實際打卡 或 已核准的忘打卡申請）
        const hasValidCheckIn = hasCheckIn || !!approvedCheckInRequest;
        // 判斷是否有有效的下班記錄（實際打卡 或 已核准的忘打卡申請）
        const hasValidCheckOut = hasCheckOut || !!approvedCheckOutRequest;

        // 檢查異常情況：只有當缺少上班或下班記錄時才標記為異常
        if (!hasValidCheckIn && !hasValidCheckOut) {
          // 雙重異常：既沒上班記錄也沒下班記錄
          // 但是，如果有任何已核准的申請，就不算異常
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

          // 檢查是否有已核准的上班申請
          const hasApprovedCheckInRequest = checkInMissedRequests.some(
            r => r.status === 'approved'
          );

          // 如果有已核准的申請，這不算異常，跳過
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

          // 檢查是否有已核准的下班申請
          const hasApprovedCheckOutRequest = checkOutMissedRequests.some(
            r => r.status === 'approved'
          );

          // 如果有已核准的申請，這不算異常，跳過
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

  // 正常記錄（用於上下班/休息/外出 Tab）
  const normalRecords = useMemo(() => {
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
  const totalPages = Math.ceil(
    (activeTab === 'normal' ? normalRecords.length : filteredAnomalies.length) / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNormalRecords =
    activeTab === 'normal' ? normalRecords.slice(startIndex, endIndex) : [];
  const currentAnomalyRecords =
    activeTab === 'anomaly' ? filteredAnomalies.slice(startIndex, endIndex) : [];

  // 初始化載入
  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  useEffect(() => {
    if (staffList.length > 0) {
      loadAttendanceData();
    }
  }, [loadAttendanceData, staffList.length]);

  // 重新載入資料
  const handleRefresh = useCallback(async () => {
    await loadAttendanceData();
    toast({
      title: '重新載入成功',
      description: `已載入 ${activeTab === 'normal' ? normalRecords.length : filteredAnomalies.length} 筆記錄`,
    });
  }, [loadAttendanceData, activeTab, normalRecords.length, filteredAnomalies.length, toast]);

  // 清空篩選條件
  const handleClearFilters = useCallback(() => {
    setFilters({
      startDate: subDays(new Date(), 14),
      endDate: new Date(),
      department: 'all',
      staffId: 'all',
      reason: '',
      hideWithRequests: false,
    });
    setCurrentPage(1);
  }, []);

  // 搜尋
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    loadAttendanceData();
  }, [loadAttendanceData]);

  // 分頁控制
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // 獲取員工姓名
  const getStaffName = (record: ExtendedCheckInRecord) => {
    return record.staff?.name || '未知員工';
  };

  // 獲取員工部門
  const getStaffDepartment = (record: ExtendedCheckInRecord) => {
    return record.staff?.department || '未知部門';
  };

  // 獲取申請狀態顯示
  const getRequestStatusBadge = (record: AttendanceAnomalyRecord) => {
    if (!record.has_missed_request) {
      return <span className="text-gray-500">無</span>;
    }

    switch (record.missed_request_status) {
      case 'pending':
        return <Badge className="bg-yellow-500/80 text-white">審核中</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/80 text-white">已核准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/80 text-white">已拒絕</Badge>;
      default:
        return <Badge className="bg-gray-500/80 text-white">未知</Badge>;
    }
  };

  // 刪除打卡記錄
  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { error } = await supabase.from('check_in_records').delete().eq('id', recordId);

      if (error) throw error;

      toast({
        title: '刪除成功',
        description: '打卡記錄已刪除',
      });

      // 重新載入資料
      await loadAttendanceData();
    } catch (error) {
      console.error('❌ 刪除打卡記錄失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除打卡記錄',
        variant: 'destructive',
      });
    }
  };

  // 忘打卡補登
  const handleMissedCheckinCompensation = async (record: AttendanceAnomalyRecord) => {
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
      const staff = staffList.find(s => s.id === record.staff_id);
      if (!staff) {
        throw new Error('找不到員工資料');
      }

      // 準備要創建的申請記錄
      const requestsToCreate = [];
      // const checkInRecordsToCreate = [];

      if (record.anomaly_type === 'missing_check_in' || record.anomaly_type === 'both_missing') {
        // 檢查是否已存在上班打卡申請
        const { data: existingCheckInRequest, error: checkInError } = await supabase
          .from('missed_checkin_requests')
          .select('id, status')
          .eq('staff_id', record.staff_id)
          .eq('request_date', record.date)
          .eq('missed_type', 'check_in')
          .maybeSingle();

        if (checkInError) throw checkInError;

        if (existingCheckInRequest) {
          toast({
            title: '補登失敗',
            description: `該日期已存在${existingCheckInRequest.status === 'pending' ? '待審核' : '已處理'}的上班打卡申請`,
            variant: 'destructive',
          });
          return;
        }

        // 準備上班打卡申請
        const checkInTime = `${record.date} ${record.schedule.start_time}`;
        requestsToCreate.push({
          staff_id: record.staff_id,
          request_date: record.date,
          missed_type: 'check_in',
          requested_check_in_time: checkInTime,
          requested_check_out_time: null,
          reason: `系統自動補登 - 根據班表上班時間 ${record.schedule.start_time}`,
          status: 'approved',
          approved_by: staff.user_id,
          approval_comment: '管理員代為補登',
          approval_date: new Date().toISOString(),
        });

        // 準備上班打卡記錄
        // checkInRecordsToCreate.push({
        //   user_id: staff.user_id,
        //   staff_id: record.staff_id,
        //   timestamp: checkInTime,
        //   action: 'check-in',
        //   type: 'manual',
        //   status: 'success',
        //   department_name: staff.department,
        // });
      }

      if (record.anomaly_type === 'missing_check_out' || record.anomaly_type === 'both_missing') {
        // 檢查是否已存在下班打卡申請
        const { data: existingCheckOutRequest, error: checkOutError } = await supabase
          .from('missed_checkin_requests')
          .select('id, status')
          .eq('staff_id', record.staff_id)
          .eq('request_date', record.date)
          .eq('missed_type', 'check_out')
          .maybeSingle();

        if (checkOutError) throw checkOutError;

        if (existingCheckOutRequest) {
          toast({
            title: '補登失敗',
            description: `該日期已存在${existingCheckOutRequest.status === 'pending' ? '待審核' : '已處理'}的下班打卡申請`,
            variant: 'destructive',
          });
          return;
        }

        // 準備下班打卡申請
        const checkOutTime = `${record.date} ${record.schedule.end_time}`;
        requestsToCreate.push({
          staff_id: record.staff_id,
          request_date: record.date,
          missed_type: 'check_out',
          requested_check_in_time: null,
          requested_check_out_time: checkOutTime,
          reason: `系統自動補登 - 根據班表下班時間 ${record.schedule.end_time}`,
          status: 'approved',
          approved_by: staff.user_id,
          approval_comment: '管理員代為補登',
          approval_date: new Date().toISOString(),
        });

        // 準備下班打卡記錄
        // checkInRecordsToCreate.push({
        //   user_id: staff.user_id,
        //   staff_id: record.staff_id,
        //   timestamp: checkOutTime,
        //   action: 'check-out',
        //   type: 'manual',
        //   status: 'success',
        //   department_name: staff.department,
        // });
      }

      // 批量創建忘打卡申請記錄
      if (requestsToCreate.length > 0) {
        const { error: insertError } = await supabase
          .from('missed_checkin_requests')
          .insert(requestsToCreate);

        if (insertError) throw insertError;
      }

      // 批量創建打卡記錄
      // if (checkInRecordsToCreate.length > 0) {
      //   const { error: recordsError } = await supabase
      //     .from('check_in_records')
      //     .insert(checkInRecordsToCreate);

      //   if (recordsError) throw recordsError;
      // }

      const actionText =
        record.anomaly_type === 'missing_check_in'
          ? '上班打卡'
          : record.anomaly_type === 'missing_check_out'
            ? '下班打卡'
            : '上下班打卡';

      toast({
        title: '補登成功',
        description: `已為 ${staff.name} 創建${actionText}補登申請並自動核准`,
      });

      // 重新載入資料
      await loadAttendanceData();
    } catch (error) {
      console.error('❌ 忘打卡補登失敗:', error);
      toast({
        title: '補登失敗',
        description: '無法完成忘打卡補登',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 主要 Tab 切換 */}
      <Tabs
        value={activeTab}
        onValueChange={value => {
          setActiveTab(value as 'normal' | 'anomaly');
          setCurrentPage(1);
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white/20 backdrop-blur-xl border-white/30">
            <TabsTrigger value="normal" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              上下班/休息/外出
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              異常
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '載入中...' : '重新載入'}
          </Button>
        </div>

        {/* 篩選區域 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg p-6 space-y-4">
          {/* 第一行：日期範圍 */}
          <div className="flex items-center gap-4">
            <Label className="text-white font-medium">查詢日期：</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[140px] justify-start text-left font-normal bg-white/20 border-white/30 text-white',
                      !filters.startDate && 'text-white/50'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, 'yyyy/MM/dd') : '選擇開始日期'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={date => setFilters(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-white">～</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[140px] justify-start text-left font-normal bg-white/20 border-white/30 text-white',
                      !filters.endDate && 'text-white/50'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, 'yyyy/MM/dd') : '選擇結束日期'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={date => setFilters(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 第二行：單位和姓名 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-white font-medium">單位：</Label>
              <Select
                value={filters.department}
                onValueChange={value => setFilters(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="請選擇" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-white font-medium">姓名：</Label>
              <Select
                value={filters.staffId}
                onValueChange={value => setFilters(prev => ({ ...prev, staffId: value }))}
              >
                <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="請選擇" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {staffList
                    .filter(
                      staff =>
                        filters.department === 'all' || staff.department === filters.department
                    )
                    .map(staff => (
                      <SelectItem key={staff.user_id} value={staff.user_id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 第三行：原因和選項 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-white font-medium">原因：</Label>
              <Input
                value={filters.reason}
                onChange={e => setFilters(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="輸入原因關鍵字"
                className="w-[200px] bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>

            {activeTab === 'anomaly' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hideWithRequests"
                  checked={filters.hideWithRequests}
                  onCheckedChange={checked =>
                    setFilters(prev => ({ ...prev, hideWithRequests: !!checked }))
                  }
                  className="border-white/30"
                />
                <Label htmlFor="hideWithRequests" className="text-white text-sm">
                  僅顯示無表單申請紀錄資料
                </Label>
              </div>
            )}
          </div>

          {/* 按鈕區 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="bg-blue-500/70 hover:bg-blue-600/70 text-white"
                disabled={loading}
              >
                <Search className="h-4 w-4 mr-2" />
                搜尋
              </Button>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <X className="h-4 w-4 mr-2" />
                清空
              </Button>
            </div>

            {/* 操作按鈕區 */}
            {activeTab === 'normal' && (
              <div className="flex gap-2">
                <Button disabled className="bg-gray-500/50 text-white/70">
                  <FileText className="h-4 w-4 mr-2" />
                  請假
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tab 內容 */}
        <TabsContent value="normal" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
              <p className="text-white/80 font-medium drop-shadow-md text-lg">
                正在載入打卡記錄...
              </p>
            </div>
          ) : normalRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                <Clock className="w-10 h-10 text-white/60" />
              </div>
              <p className="text-white/80 font-semibold text-lg drop-shadow-md">
                沒有找到符合條件的打卡記錄
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white/80 font-medium drop-shadow-md">
                  總共 {normalRecords.length} 筆記錄
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white/80 text-sm font-medium px-3">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/90 font-semibold">日期</TableHead>
                        <TableHead className="text-white/90 font-semibold">時間</TableHead>
                        <TableHead className="text-white/90 font-semibold">員工姓名</TableHead>
                        <TableHead className="text-white/90 font-semibold">部門</TableHead>
                        <TableHead className="text-white/90 font-semibold">動作</TableHead>
                        <TableHead className="text-white/90 font-semibold">狀態</TableHead>
                        <TableHead className="text-white/90 font-semibold">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentNormalRecords.map((record: ExtendedCheckInRecord) => (
                        <TableRow key={record.id} className="border-white/20 hover:bg-white/5">
                          <TableCell className="text-white/90">
                            {formatDate(record.timestamp)}
                          </TableCell>
                          <TableCell className="text-white/90">
                            {formatTime(record.timestamp)}
                          </TableCell>
                          <TableCell className="text-white/90">{getStaffName(record)}</TableCell>
                          <TableCell className="text-white/80">
                            {getStaffDepartment(record)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-semibold ${
                                record.action === 'check-in' ? 'text-green-300' : 'text-blue-300'
                              }`}
                            >
                              {record.action === 'check-in' ? '上班打卡' : '下班打卡'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-xl">
                              成功
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                                          disabled={!canDeleteRecords}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>確認刪除</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            您確定要刪除這筆打卡記錄嗎？此操作無法復原。
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>取消</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteRecord(record.id)}
                                            className="bg-red-500 hover:bg-red-600"
                                          >
                                            刪除
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {canDeleteRecords
                                      ? '刪除此打卡記錄'
                                      : '權限不足：需要出勤記錄刪除權限'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
              <p className="text-white/80 font-medium drop-shadow-md text-lg">
                正在分析出勤異常...
              </p>
            </div>
          ) : filteredAnomalies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                <AlertCircle className="w-10 h-10 text-green-400/80" />
              </div>
              <p className="text-white/80 font-semibold text-lg drop-shadow-md">
                沒有發現符合條件的出勤異常
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white/80 font-medium drop-shadow-md">
                  發現 {filteredAnomalies.length} 筆異常記錄
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white/80 text-sm font-medium px-3">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/90 font-semibold">單位</TableHead>
                        <TableHead className="text-white/90 font-semibold">姓名</TableHead>
                        <TableHead className="text-white/90 font-semibold">日期</TableHead>
                        <TableHead className="text-white/90 font-semibold">原因</TableHead>
                        <TableHead className="text-white/90 font-semibold">表單申請紀錄</TableHead>
                        <TableHead className="text-white/90 font-semibold">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentAnomalyRecords.map((record: AttendanceAnomalyRecord) => (
                        <TableRow key={record.id} className="border-white/20 hover:bg-white/5">
                          <TableCell className="text-white/90">{record.department}</TableCell>
                          <TableCell className="text-white/90">{record.staff_name}</TableCell>
                          <TableCell className="text-white/90">{formatDate(record.date)}</TableCell>
                          <TableCell className="text-white/80">{record.description}</TableCell>
                          <TableCell>{getRequestStatusBadge(record)}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                                          disabled={
                                            !canCreateMissedRequests ||
                                            (record.has_missed_request &&
                                              record.missed_request_status === 'approved')
                                          }
                                        >
                                          <Clock className="h-4 w-4 mr-1" />
                                          忘打卡補登
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>確認忘打卡補登</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            <div className="space-y-2">
                                              <p>員工：{record.staff_name}</p>
                                              <p>日期：{formatDate(record.date)}</p>
                                              <p>異常原因：{record.description}</p>
                                              {record.schedule && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                  <p className="text-sm text-blue-800 font-medium">
                                                    將創建忘打卡申請記錄並自動核准：
                                                  </p>
                                                  {(record.anomaly_type === 'missing_check_in' ||
                                                    record.anomaly_type === 'both_missing') && (
                                                    <p className="text-sm">
                                                      • 申請上班打卡時間：
                                                      {record.schedule.start_time}
                                                    </p>
                                                  )}
                                                  {(record.anomaly_type === 'missing_check_out' ||
                                                    record.anomaly_type === 'both_missing') && (
                                                    <p className="text-sm">
                                                      • 申請下班打卡時間：{record.schedule.end_time}
                                                    </p>
                                                  )}
                                                  <p className="text-xs text-gray-600 mt-2">
                                                    * 將同時在系統中創建對應的打卡記錄
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>取消</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleMissedCheckinCompensation(record)}
                                            className="bg-blue-500 hover:bg-blue-600"
                                          >
                                            確認補登
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {!canCreateMissedRequests
                                      ? '權限不足：需要忘打卡申請權限'
                                      : record.has_missed_request &&
                                          record.missed_request_status === 'approved'
                                        ? '已有核准的申請記錄'
                                        : '創建忘打卡補登申請'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceRecordManagement;

import { supabase } from '@/integrations/supabase/client';
import { permissionService } from '@/services/simplifiedPermissionService';
import { scheduleService, Schedule as SupabaseSchedule } from '@/services/scheduleService';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { StaffMember, ExtendedCheckInRecord } from '@/stores/attendanceRecordStore';
import { format } from 'date-fns';

export class AttendanceRecordService {
  /**
   * 載入基礎資料：員工列表和部門列表
   */
  static async loadBaseData() {
    try {
      console.log('🔄 AttendanceRecordService: 載入基礎資料');

      // 載入員工資料
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, user_id, name, department, position, branch_name')
        .order('name');

      if (staffError) throw staffError;

      const staffList: StaffMember[] = staffData || [];

      // 獲取所有部門列表
      const departments = [...new Set(staffList.map(s => s.department).filter(Boolean))];

      console.log('✅ AttendanceRecordService: 基礎資料載入完成', {
        staffCount: staffList.length,
        departmentCount: departments.length,
      });

      return { staffList, departments };
    } catch (error) {
      console.error('❌ AttendanceRecordService: 載入基礎資料失敗:', error);
      throw error;
    }
  }

  /**
   * 載入出勤資料：打卡記錄、排班記錄、忘打卡申請
   */
  static async loadAttendanceData(startDate: Date, endDate: Date) {
    try {
      console.log('🔄 AttendanceRecordService: 載入出勤資料', { startDate, endDate });

      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');

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

      // 載入打卡記錄
      const { data: recordsData, error: recordsError } = await recordsQuery;
      if (recordsError) throw recordsError;

      // 載入排班記錄
      let schedules: SupabaseSchedule[];
      if (permissionService.isAdmin() || permissionService.hasPermission('schedule:view_all')) {
        schedules = await scheduleService.getSchedulesForDateRange(startDateStr, endDateStr);
      } else {
        const { data: currentStaff } = await supabase
          .from('staff')
          .select('user_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (currentStaff) {
          const userSchedules = await scheduleService.getSchedulesForUser(currentStaff.user_id);
          schedules = userSchedules.filter(
            schedule => schedule.work_date >= startDateStr && schedule.work_date <= endDateStr
          );
        } else {
          schedules = [];
        }
      }

      // 載入忘打卡申請
      let missedQuery = supabase
        .from('missed_checkin_requests')
        .select('*')
        .gte('request_date', startDateStr)
        .lte('request_date', endDateStr);

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

      // 轉換打卡記錄格式
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

      console.log('✅ AttendanceRecordService: 出勤資料載入完成', {
        recordsCount: formattedRecords.length,
        schedulesCount: schedules.length,
        missedRequestsCount: formattedMissedRequests.length,
      });

      return {
        records: formattedRecords,
        schedules,
        missedRequests: formattedMissedRequests,
      };
    } catch (error) {
      console.error('❌ AttendanceRecordService: 載入出勤資料失敗:', error);
      throw error;
    }
  }

  /**
   * 刪除打卡記錄
   */
  static async deleteRecord(recordId: string) {
    try {
      console.log('🔄 AttendanceRecordService: 刪除打卡記錄', recordId);

      // 權限檢查
      if (
        !permissionService.hasPermission('check_in_records:delete') &&
        !permissionService.isAdmin()
      ) {
        throw new Error('權限不足：需要出勤記錄刪除權限');
      }

      const { error } = await supabase.from('check_in_records').delete().eq('id', recordId);

      if (error) throw error;

      console.log('✅ AttendanceRecordService: 打卡記錄刪除成功');
    } catch (error) {
      console.error('❌ AttendanceRecordService: 刪除打卡記錄失敗:', error);
      throw error;
    }
  }

  /**
   * 忘打卡補登
   */
  static async createMissedCheckinCompensation(
    staffId: string,
    date: string,
    anomalyType: string,
    schedule: SupabaseSchedule,
    staffList: StaffMember[]
  ) {
    try {
      console.log('🔄 AttendanceRecordService: 執行忘打卡補登', {
        staffId,
        date,
        anomalyType,
      });

      // 權限檢查
      if (
        !permissionService.hasPermission('missed_checkin:manage') &&
        !permissionService.isAdmin()
      ) {
        throw new Error('權限不足：需要忘打卡申請權限');
      }

      const staff = staffList.find(s => s.id === staffId);
      if (!staff) {
        throw new Error('找不到員工資料');
      }

      const requestsToCreate = [];

      if (anomalyType === 'missing_check_in' || anomalyType === 'both_missing') {
        // 檢查是否已存在上班打卡申請
        const { data: existingCheckInRequest, error: checkInError } = await supabase
          .from('missed_checkin_requests')
          .select('id, status')
          .eq('staff_id', staffId)
          .eq('request_date', date)
          .eq('missed_type', 'check_in')
          .maybeSingle();

        if (checkInError) throw checkInError;

        if (existingCheckInRequest) {
          throw new Error(
            `該日期已存在${existingCheckInRequest.status === 'pending' ? '待審核' : '已處理'}的上班打卡申請`
          );
        }

        const checkInTime = `${date} ${schedule.start_time}`;
        requestsToCreate.push({
          staff_id: staffId,
          request_date: date,
          missed_type: 'check_in',
          requested_check_in_time: checkInTime,
          requested_check_out_time: null,
          reason: `系統自動補登 - 根據班表上班時間 ${schedule.start_time}`,
          status: 'approved',
          approved_by: staff.user_id,
          approval_comment: '管理員代為補登',
          approval_date: new Date().toISOString(),
        });
      }

      if (anomalyType === 'missing_check_out' || anomalyType === 'both_missing') {
        // 檢查是否已存在下班打卡申請
        const { data: existingCheckOutRequest, error: checkOutError } = await supabase
          .from('missed_checkin_requests')
          .select('id, status')
          .eq('staff_id', staffId)
          .eq('request_date', date)
          .eq('missed_type', 'check_out')
          .maybeSingle();

        if (checkOutError) throw checkOutError;

        if (existingCheckOutRequest) {
          throw new Error(
            `該日期已存在${existingCheckOutRequest.status === 'pending' ? '待審核' : '已處理'}的下班打卡申請`
          );
        }

        const checkOutTime = `${date} ${schedule.end_time}`;
        requestsToCreate.push({
          staff_id: staffId,
          request_date: date,
          missed_type: 'check_out',
          requested_check_in_time: null,
          requested_check_out_time: checkOutTime,
          reason: `系統自動補登 - 根據班表下班時間 ${schedule.end_time}`,
          status: 'approved',
          approved_by: staff.user_id,
          approval_comment: '管理員代為補登',
          approval_date: new Date().toISOString(),
        });
      }

      // 批量創建忘打卡申請記錄
      if (requestsToCreate.length > 0) {
        const { error: insertError } = await supabase
          .from('missed_checkin_requests')
          .insert(requestsToCreate);

        if (insertError) throw insertError;
      }

      console.log('✅ AttendanceRecordService: 忘打卡補登成功');

      return {
        success: true,
        message: `已為 ${staff.name} 創建並自動核准忘打卡申請`,
      };
    } catch (error) {
      console.error('❌ AttendanceRecordService: 忘打卡補登失敗:', error);
      throw error;
    }
  }
}

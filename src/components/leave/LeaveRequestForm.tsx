import { SubmitButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import { LeaveTypeCode } from '@/constants/leave';
import { RequestStatus } from '@/constants/requestStatus';
import { useLeaveType } from '@/hooks/useLeaveType';
import { useMyLeaveRequest } from '@/hooks/useMyLeaveRequest';
import { leaveRequestFormSchema, LeaveRequestFormValues } from '@/schemas/leaveRequest';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import {
  calculateLeaveHoursBySchedule,
  calculateLeaveHoursSimple,
  validateLeaveTimeWithSchedule,
} from '@/utils/leaveHoursCalculator';
import { useEmployeeSchedule } from '@/hooks/useEmployeeSchedule';
import { getSmartDefaultTime } from '@/utils/scheduleTimeUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';
import LeaveTypeExtraFields from './LeaveTypeExtraFields';
import { requiresReferenceDate } from '@/utils/leaveTypeUtils';
import { LeaveTimeInput } from './LeaveTimeInput';

interface LeaveRequestFormProps {
  onSuccess?: () => void;
}

const LeaveRequestForm = ({ onSuccess }: LeaveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleValidationError, setScheduleValidationError] = useState<string | null>(null);
  const hasTriggeredInitialFullDay = useRef(false);
  const { leaveTypes, loadLeaveTypes } = useLeaveType();
  const getLeaveTypeBySlug = useLeaveTypeStore(state => state.getLeaveTypeBySlug);
  const { handleCreateMyLeaveRequest } = useMyLeaveRequest();
  const { employee } = useEmployeeStore();
  const {
    workSchedules,
    isLoading: isLoadingSchedules,
    loadScheduleForDateRange,
    error: scheduleError,
  } = useEmployeeSchedule();

  const form = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      start_date: null,
      end_date: null,
      leave_type_code: '',
      reason: '',
      duration_hours: 0,
      status: RequestStatus.PENDING,
      attachment: null,
      reference_date: null,
    },
  });

  useEffect(() => {
    loadLeaveTypes();

    // 自動載入今天的班表資料
    const today = dayjs().format('YYYY-MM-DD');
    loadScheduleForDateRange(today, today);
  }, [loadLeaveTypes, loadScheduleForDateRange]);

  const watchedLeaveType = form.watch('leave_type_code');
  const watchedStartDate = form.watch('start_date');
  const watchedEndDate = form.watch('end_date');

  const currentLeaveType = useMemo(() => {
    return watchedLeaveType ? getLeaveTypeBySlug(watchedLeaveType) : null;
  }, [watchedLeaveType, getLeaveTypeBySlug]);

  // 當請假類型改變時，清除額外欄位
  useEffect(() => {
    if (currentLeaveType) {
      const needsReferenceDate = requiresReferenceDate(currentLeaveType.code);
      if (!needsReferenceDate) {
        form.setValue('reference_date', null);
      }
    }
  }, [currentLeaveType, form]);

  // 自動載入班表資料當日期變更時
  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      const startDate = dayjs(watchedStartDate).format('YYYY-MM-DD');
      const endDate = dayjs(watchedEndDate).format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');

      // 檢查是否需要載入額外的日期範圍
      const needsAdditionalLoad = startDate !== today || endDate !== today;

      if (needsAdditionalLoad) {
        // 擴展日期範圍以包含今天（如果還沒有的話）
        const startDayjs = dayjs(startDate);
        const endDayjs = dayjs(endDate);
        const todayDayjs = dayjs(today);

        const finalStartDate = startDayjs.isBefore(todayDayjs) ? startDate : today;
        const finalEndDate = endDayjs.isAfter(todayDayjs) ? endDate : today;

        loadScheduleForDateRange(finalStartDate, finalEndDate);
      }
    }
  }, [watchedStartDate, watchedEndDate, loadScheduleForDateRange]);

  // 設定今日全天時間的獨立函數
  const setTodayFullDay = useCallback(() => {
    const today = dayjs();
    const startTime = getSmartDefaultTime(today, workSchedules, false);
    const endTime = getSmartDefaultTime(today, workSchedules, true);
    form.setValue('start_date', dayjs(startTime));
    form.setValue('end_date', dayjs(endTime));
  }, [workSchedules, form]);

  // 監聽班表載入狀態，當載入完成時自動設定今日全天（僅第一次）
  useEffect(() => {
    if (!isLoadingSchedules && workSchedules.length > 0 && !hasTriggeredInitialFullDay.current) {
      setTodayFullDay();
      hasTriggeredInitialFullDay.current = true;
    }
  }, [isLoadingSchedules, workSchedules, setTodayFullDay]);

  // 計算請假時數（當開始和結束日期都存在時）
  const calculatedHours = useMemo(() => {
    if (!watchedStartDate || !watchedEndDate) {
      return 0;
    }

    const startDateTime = dayjs(watchedStartDate);
    const endDateTime = dayjs(watchedEndDate);

    // 驗證請假時間
    const validation = validateLeaveTimeWithSchedule(startDateTime, endDateTime, workSchedules);
    if (!validation.isValid) {
      setScheduleValidationError(validation.message || '請假時間驗證失敗');
      return 0;
    }

    setScheduleValidationError(null);

    // 如果有班表資料，使用班表計算
    if (workSchedules.length > 0) {
      return calculateLeaveHoursBySchedule(startDateTime, endDateTime, workSchedules);
    }

    // 沒有班表資料時，使用簡化計算（標準工作時間）
    return calculateLeaveHoursSimple(startDateTime, endDateTime);
  }, [watchedStartDate, watchedEndDate, workSchedules]);

  const handleFormSubmit = async (data: LeaveRequestFormValues) => {
    // 檢查表單驗證
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    // 準備請假申請資料
    const leaveRequestData = {
      start_date: data.start_date.format('YYYY-MM-DD HH:mm:ss'),
      end_date: data.end_date.format('YYYY-MM-DD HH:mm:ss'),
      leave_type_code: currentLeaveType.code,
      duration_hours: calculatedHours,
      reason: data.reason,
      status: RequestStatus.PENDING,
      ...(data.reference_date && { reference_date: data.reference_date.format('YYYY-MM-DD') }),
    };

    const result = await handleCreateMyLeaveRequest(leaveRequestData);

    if (result) {
      // 成功提交
      if (onSuccess) {
        onSuccess();
      }
      // 重置表單
      form.reset({
        start_date: null,
        end_date: null,
        leave_type_code: '',
        reason: '',
        duration_hours: 0,
        status: RequestStatus.PENDING,
        attachment: null,
        reference_date: null,
      });
    } else {
      // 提交失敗
      alert('請假申請提交失敗，請稍後再試');
    }

    setIsSubmitting(false);
  };

  const hasStartDate = Boolean(employee?.start_date);
  const isDisabled = !employee;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 請假類型選擇 */}
        <div className="backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
          <FormField
            control={form.control}
            name="leave_type_code"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel required className="text-white">
                  假別
                </CustomFormLabel>
                <FormControl>
                  <SearchableSelect
                    options={leaveTypes.map(type => ({
                      value: type.slug,
                      label: type.name,
                      disabled: !hasStartDate && type.code === LeaveTypeCode.ANNUAL,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="請選擇請假類型"
                    searchPlaceholder="搜尋請假類型..."
                    emptyMessage="找不到符合的請假類型"
                    className="bg-white/20 border-white/30 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 請假類型詳細資訊 */}
        {currentLeaveType && <LeaveTypeDetailCard leaveType={currentLeaveType} />}

        {/* 額外欄位（根據請假類型） */}
        {currentLeaveType && requiresReferenceDate(currentLeaveType.code) && (
          <LeaveTypeExtraFields form={form} leaveTypeCode={currentLeaveType.code} />
        )}

        {/* 請假日期時間 */}
        <div className="backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期時間</h3>

          {/* 快速選擇按鈕 */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const today = dayjs();
                const startTime = getSmartDefaultTime(today, workSchedules, false);
                form.setValue('start_date', dayjs(startTime));
              }}
              className="px-3 py-1 text-sm bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-lg border border-blue-300/30 transition-colors"
            >
              今日上班時間
            </button>
            <button
              type="button"
              onClick={() => {
                const today = dayjs();
                const endTime = getSmartDefaultTime(today, workSchedules, true);
                form.setValue('end_date', dayjs(endTime));
              }}
              className="px-3 py-1 text-sm bg-purple-500/30 hover:bg-purple-500/50 text-white rounded-lg border border-purple-300/30 transition-colors"
            >
              今日下班時間
            </button>
            <button
              type="button"
              onClick={setTodayFullDay}
              className="px-3 py-1 text-sm bg-green-500/30 hover:bg-green-500/50 text-white rounded-lg border border-green-300/30 transition-colors"
            >
              今日全天
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <LeaveTimeInput
                  form={form}
                  field={field}
                  workSchedules={workSchedules}
                  label="開始日期時間"
                  isEndTime={false}
                />
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <LeaveTimeInput
                  form={form}
                  field={field}
                  workSchedules={workSchedules}
                  label="結束日期時間"
                  isEndTime={true}
                />
              )}
            />
          </div>

          {/* 顯示計算的請假時數 */}
          {calculatedHours > 0 && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-300/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white">請假時數：</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-200 font-semibold">{calculatedHours} 小時</span>
                  {workSchedules.length > 0 && (
                    <span className="text-xs text-blue-300/80 bg-blue-600/30 px-2 py-1 rounded">
                      依班表計算
                    </span>
                  )}
                  {workSchedules.length === 0 && (
                    <span className="text-xs text-yellow-300/80 bg-yellow-600/30 px-2 py-1 rounded">
                      標準時間
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 顯示班表載入狀態 */}
          {isLoadingSchedules && (
            <div className="mt-4 p-3 bg-gray-500/20 border border-gray-300/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white text-sm">載入班表資料中...</span>
              </div>
            </div>
          )}

          {/* 顯示班表錯誤或驗證錯誤 */}
          {(scheduleError || scheduleValidationError) && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-300/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-200 text-sm">
                  ⚠️ {scheduleError || scheduleValidationError}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 請假原因 */}
        <div className="backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假原因</h3>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel required className="text-white">
                  事由說明
                </CustomFormLabel>
                <FormControl>
                  <Textarea
                    placeholder="請輸入請假事由..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 附件欄位 */}
        <div className="backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">附件上傳</h3>
          <FormField
            control={form.control}
            name="attachment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="file"
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-end">
          <SubmitButton
            isLoading={isSubmitting}
            loadingText="提交中..."
            disabled={isDisabled}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交申請
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default LeaveRequestForm;

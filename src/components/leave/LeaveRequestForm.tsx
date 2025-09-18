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
import { checkLeaveAvailability } from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { LeaveAvailabilityResponse } from '@/types/leaveBalance';
import { calculateHoursBetween } from '@/utils/dateTimeUtils';
import { requiresReferenceDate } from '@/utils/leaveTypeUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';
import LeaveTypeExtraFields from './LeaveTypeExtraFields';

interface LeaveRequestFormProps {
  onSuccess?: () => void;
}

const LeaveRequestForm = ({ onSuccess }: LeaveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<LeaveAvailabilityResponse | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const { leaveTypes, loadLeaveTypes } = useLeaveType();
  const getLeaveTypeBySlug = useLeaveTypeStore(state => state.getLeaveTypeBySlug);
  const { handleCreateMyLeaveRequest } = useMyLeaveRequest();
  const { employee } = useEmployeeStore();

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
  }, [loadLeaveTypes]);

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

  // 計算請假時數（當開始和結束日期都存在時）
  const calculatedHours = useMemo(() => {
    if (watchedStartDate && watchedEndDate) {
      const startDateTime = dayjs(watchedStartDate);
      const endDateTime = dayjs(watchedEndDate);
      return calculateHoursBetween(startDateTime, endDateTime);
    }
    return 0;
  }, [watchedStartDate, watchedEndDate]);

  // 檢查請假可用性
  useEffect(() => {
    const checkAvailability = async () => {
      if (!watchedLeaveType || !watchedStartDate || !watchedEndDate) {
        setAvailabilityData(null);
        return;
      }

      setIsCheckingAvailability(true);
      try {
        const data = await checkLeaveAvailability({
          leave_type_slug: watchedLeaveType,
          start_date: watchedStartDate.format('YYYY-MM-DD HH:mm:ss'),
          end_date: watchedEndDate.format('YYYY-MM-DD HH:mm:ss'),
        });
        setAvailabilityData(data);
      } catch (error) {
        console.error('檢查請假可用性失敗:', error);
        setAvailabilityData(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [watchedLeaveType, watchedStartDate, watchedEndDate]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <CustomFormLabel required className="text-white">
                    開始日期時間
                  </CustomFormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      step="1800"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/30 transition-colors duration-200"
                      value={field.value ? field.value.format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={e => {
                        const date = e.target.value ? dayjs(e.target.value) : null;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <CustomFormLabel required className="text-white">
                    結束日期時間
                  </CustomFormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      step="1800"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/30 transition-colors duration-200"
                      value={field.value ? field.value.format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={e => {
                        const date = e.target.value ? dayjs(e.target.value) : null;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 顯示計算的請假時數 */}
          {calculatedHours > 0 && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-300/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white">請假時數：</span>
                <span className="text-blue-200 font-semibold">{calculatedHours} 小時</span>
              </div>
            </div>
          )}

          {/* 顯示可用性檢查結果 */}
          {isCheckingAvailability && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-300/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-300 border-t-transparent"></div>
                <span className="text-yellow-200">檢查請假可用性中...</span>
              </div>
            </div>
          )}

          {availabilityData && !isCheckingAvailability && (
            <div className="mt-4 space-y-3">
              {/* 可用性狀態 */}
              <div
                className={`p-3 rounded-lg border ${
                  availabilityData.is_available
                    ? 'bg-green-500/20 border-green-300/30'
                    : 'bg-red-500/20 border-red-300/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">申請狀態：</span>
                  <span
                    className={`font-semibold ${
                      availabilityData.is_available ? 'text-green-200' : 'text-red-200'
                    }`}
                  >
                    {availabilityData.is_available ? '可以申請' : '無法申請'}
                  </span>
                </div>
              </div>

              {/* 餘額資訊 */}
              <div className="p-3 bg-white/10 border border-white/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">剩餘時數：</span>
                    <span className="text-white font-medium">
                      {availabilityData.remaining_hours} 小時
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">已用時數：</span>
                    <span className="text-white font-medium">
                      {availabilityData.used_hours} 小時
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">年度上限：</span>
                    <span className="text-white font-medium">
                      {availabilityData.max_hours_per_year} 小時
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">申請時數：</span>
                    <span className="text-white font-medium">
                      {availabilityData.requested_hours} 小時
                    </span>
                  </div>
                </div>
              </div>

              {/* 建議資訊 */}
              {availabilityData.suggestion && (
                <div className="p-3 bg-blue-500/20 border border-blue-300/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-200 text-sm">💡</span>
                    <span className="text-blue-200 text-sm">{availabilityData.suggestion}</span>
                  </div>
                </div>
              )}

              {/* 特休年資資訊 */}
              {availabilityData.seniority_years && (
                <div className="p-3 bg-purple-500/20 border border-purple-300/30 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-white/80">年資：</span>
                    <span className="text-purple-200 font-medium">
                      {availabilityData.seniority_years} 年
                    </span>
                  </div>
                </div>
              )}
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

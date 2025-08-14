import { CancelButton, SubmitButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { REQUEST_TYPE_LABELS, RequestType } from '@/constants/checkInTypes';
import useLoadingAction from '@/hooks/useLoadingAction';
import { useMyMissedCheckInRequests } from '@/hooks/useMyMissedCheckInRequests';
import { MissedCheckInFormData, missedCheckInSchema } from '@/schemas/missedCheckIn';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React from 'react';
import { useForm } from 'react-hook-form';

interface MissedCheckInFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultRequestType?: RequestType;
}

const MissedCheckInForm: React.FC<MissedCheckInFormProps> = ({
  onSuccess,
  onCancel,
  defaultRequestType = RequestType.CHECK_IN,
}) => {
  const { handleCreateMyMissedCheckInRequest } = useMyMissedCheckInRequests();
  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: MissedCheckInFormData) => {
      // 調用 API 建立忘記打卡申請
      const result = await handleCreateMyMissedCheckInRequest({
        request_date: data.request_date,
        request_type: data.request_type,
        checked_at: data.checked_at,
        reason: data.reason,
      });

      if (result) {
        form.reset();
        onSuccess();
      }
    }
  );

  const form = useForm<MissedCheckInFormData>({
    resolver: zodResolver(missedCheckInSchema),
    defaultValues: {
      request_date: dayjs().format('YYYY-MM-DD'),
      request_type: defaultRequestType,
      checked_at: '',
      reason: '',
    },
  });

  // 確保表單的 request_type 始終與 defaultRequestType 同步
  React.useEffect(() => {
    form.setValue('request_type', defaultRequestType);
  }, [defaultRequestType, form]);

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-4">
        <FormField
          control={form.control}
          name="request_date"
          render={({ field }) => (
            <FormItem>
              <CustomFormLabel required>申請日期</CustomFormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="bg-background border-input text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 申請類型顯示（不可編輯） */}
        <div className="space-y-2">
          <CustomFormLabel>申請類型</CustomFormLabel>
          <div className="p-3 bg-muted rounded-md border">
            <span className="text-sm text-muted-foreground font-medium">
              {REQUEST_TYPE_LABELS[defaultRequestType]}
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="checked_at"
          render={({ field }) => (
            <FormItem>
              <CustomFormLabel required>
                {defaultRequestType === RequestType.CHECK_IN && '上班時間'}
                {defaultRequestType === RequestType.CHECK_OUT && '下班時間'}
              </CustomFormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="bg-background border-input text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <CustomFormLabel>申請原因</CustomFormLabel>
              <FormControl>
                <Textarea
                  placeholder="請說明忘記打卡的原因..."
                  {...field}
                  rows={3}
                  className="bg-background border-input text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <CancelButton onClick={handleCancel} disabled={isLoading}>
            取消
          </CancelButton>
          <SubmitButton isLoading={isLoading} loadingText="提交中..." disabled={isLoading}>
            提交申請
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default MissedCheckInForm;

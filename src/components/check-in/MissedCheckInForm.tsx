import { CancelButton, SubmitButton } from '@/components/common/buttons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';
import { REQUEST_TYPE_LABELS, RequestType } from '@/constants/checkInTypes';
import useLoadingAction from '@/hooks/useLoadingAction';
import { useMyMissedCheckInRequests } from '@/hooks/useMyMissedCheckInRequests';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 表單驗證 schema
const missedCheckInSchema = z
  .object({
    request_date: z.string().min(1, '請選擇申請日期'),
    request_type: z.nativeEnum(RequestType),
    check_in_time: z.string().optional(),
    check_out_time: z.string().optional(),
    reason: z.string().min(1, '請填寫申請原因'),
  })
  .refine(
    data => {
      if (data.request_type === RequestType.CHECK_IN && !data.check_in_time) {
        return false;
      }
      if (data.request_type === RequestType.CHECK_OUT && !data.check_out_time) {
        return false;
      }
      return true;
    },
    {
      message: '請填寫對應的時間',
      path: ['check_in_time', 'check_out_time'],
    }
  );

export type MissedCheckInFormData = z.infer<typeof missedCheckInSchema>;

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
        check_in_time: data.check_in_time,
        check_out_time: data.check_out_time,
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
      check_in_time: '',
      check_out_time: '',
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

  const requestType = form.watch('request_type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-4">
        <FormField
          control={form.control}
          name="request_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">申請日期</FormLabel>
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
          <FormLabel className="text-muted-foreground">申請類型</FormLabel>
          <div className="p-3 bg-muted rounded-md border">
            <span className="text-sm text-muted-foreground font-medium">
              {REQUEST_TYPE_LABELS[defaultRequestType]}
            </span>
          </div>
        </div>

        {requestType === RequestType.CHECK_IN && (
          <FormField
            control={form.control}
            name="check_in_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">上班時間</FormLabel>
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
        )}

        {requestType === RequestType.CHECK_OUT && (
          <FormField
            control={form.control}
            name="check_out_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">下班時間</FormLabel>
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
        )}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">申請原因</FormLabel>
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

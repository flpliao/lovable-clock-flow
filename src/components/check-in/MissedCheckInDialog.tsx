import { CancelButton, SubmitButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { REQUEST_TYPE_LABELS, RequestType } from '@/constants/checkInTypes';
import useLoadingAction from '@/hooks/useLoadingAction';
import { useMyMissedCheckInRequests } from '@/hooks/useMyMissedCheckInRequests';
import { MissedCheckInFormData, missedCheckInSchema } from '@/schemas/missedCheckIn';
import { formatTimeString } from '@/utils/dateTimeUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface MissedCheckInDialogProps {
  onSubmit?: () => void;
  // 當前打卡狀態
  type: RequestType;
  // 新增：自動帶入參數
  defaultDate?: Date;
  defaultTime?: string;
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  // 新增：外部控制
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean; // 是否顯示觸發按鈕
}

const MissedCheckInDialog: React.FC<MissedCheckInDialogProps> = ({
  onSubmit,
  type,
  defaultDate,
  defaultTime,
  scheduleStartTime,
  scheduleEndTime,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  showTrigger = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // 使用外部控制或內部狀態
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

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
        handleClose();
        onSubmit?.();
      }
    }
  );

  // 計算預設時間
  const getDefaultTime = () => {
    if (defaultTime) return defaultTime;
    if (type === RequestType.CHECK_IN) {
      return scheduleStartTime ? formatTimeString(scheduleStartTime) : '09:30';
    } else {
      return scheduleEndTime ? formatTimeString(scheduleEndTime) : '17:30';
    }
  };

  const form = useForm<MissedCheckInFormData>({
    resolver: zodResolver(missedCheckInSchema),
    defaultValues: {
      request_date: defaultDate
        ? dayjs(defaultDate).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      request_type: type,
      checked_at: getDefaultTime(),
      reason: '',
    },
  });

  // 確保表單的 request_type 始終與 type 同步
  React.useEffect(() => {
    form.setValue('request_type', type);
  }, [type, form]);

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 whitespace-nowrap"
          >
            <Clock className="h-4 w-4 mr-1" />
            忘記打卡
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            忘記打卡申請
          </DialogTitle>
        </DialogHeader>

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
                  {REQUEST_TYPE_LABELS[type]}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="checked_at"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel required>
                    {type === RequestType.CHECK_IN && '上班時間'}
                    {type === RequestType.CHECK_OUT && '下班時間'}
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

            <DialogFooter>
              <CancelButton onClick={handleClose} disabled={isLoading}>
                取消
              </CancelButton>
              <SubmitButton isLoading={isLoading} loadingText="提交中..." disabled={isLoading}>
                提交申請
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckInDialog;

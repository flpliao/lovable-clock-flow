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
import { editScheduleFormSchema } from '@/schemas/schedule';
import type { EditScheduleFormData, EditScheduleFormProps } from '@/types/schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Calendar, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditScheduleForm: React.FC<EditScheduleFormProps> = ({
  isOpen,
  onClose,
  workSchedule,
  employee,
  onSave,
}) => {
  const form = useForm<EditScheduleFormData>({
    resolver: zodResolver(editScheduleFormSchema),
    defaultValues: {
      clock_in_time: '09:00',
      clock_out_time: '18:00',
      comment: '',
    },
  });

  // 當 workSchedule 改變時，初始化表單資料
  useEffect(() => {
    if (workSchedule) {
      form.reset({
        clock_in_time: workSchedule.clock_in_time || '09:00',
        clock_out_time: workSchedule.clock_out_time || '18:00',
        comment: workSchedule.pivot?.comment || '',
      });
    }
  }, [workSchedule, form]);

  if (!isOpen) return null;

  const onSubmit = (data: EditScheduleFormData) => {
    onSave(data);
    onClose();
  };

  const formatDate = () => {
    if (!workSchedule?.pivot?.date) return '';
    const date = dayjs(workSchedule.pivot.date);
    return date.format('YYYY年M月D日 (dddd)');
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* 編輯表單對話框 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* 標題欄 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">編輯排班</h2>
                <p className="text-sm text-gray-500">{employee?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 日期顯示 */}
          {workSchedule?.pivot?.date && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate()}</span>
              </div>
            </div>
          )}

          {/* 表單內容 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* 上下班時間 */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clock_in_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">上班時間</FormLabel>
                      <FormControl>
                        <Input type="time" value="00:00:00" step="60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clock_out_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">下班時間</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 註解 */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">註解</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入註解資訊..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 按鈕組 */}
              <div className="flex justify-end gap-2 pt-4">
                <CancelButton onClick={onClose} />
                <SubmitButton isLoading={form.formState.isSubmitting} />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditScheduleForm;

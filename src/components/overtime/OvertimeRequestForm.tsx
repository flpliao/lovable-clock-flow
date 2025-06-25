
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { OvertimeRequestFormData } from '@/types/overtime';

interface OvertimeRequestFormProps {
  onSubmit?: () => void;
}

const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<OvertimeRequestFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const startTime = watch('start_time');
  const endTime = watch('end_time');

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  const hours = calculateHours(startTime, endTime);

  const onFormSubmit = async (data: OvertimeRequestFormData) => {
    setIsSubmitting(true);
    try {
      console.log('提交加班申請:', data);
      // TODO: 實際提交邏輯
      
      toast({
        title: '加班申請已提交',
        description: '您的加班申請已成功提交，等待審核中',
      });
      
      reset();
      onSubmit?.();
    } catch (error) {
      console.error('提交加班申請失敗:', error);
      toast({
        title: '提交失敗',
        description: '加班申請提交失敗，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          加班申請
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overtime_date">加班日期</Label>
              <Input
                id="overtime_date"
                type="date"
                {...register('overtime_date', { required: '請選擇加班日期' })}
                className="w-full"
              />
              {errors.overtime_date && (
                <p className="text-sm text-red-500">{errors.overtime_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>預計加班時數</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{hours.toFixed(1)} 小時</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">開始時間</Label>
              <Input
                id="start_time"
                type="time"
                {...register('start_time', { required: '請選擇開始時間' })}
                className="w-full"
              />
              {errors.start_time && (
                <p className="text-sm text-red-500">{errors.start_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">結束時間</Label>
              <Input
                id="end_time"
                type="time"
                {...register('end_time', { required: '請選擇結束時間' })}
                className="w-full"
              />
              {errors.end_time && (
                <p className="text-sm text-red-500">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">加班原因</Label>
            <Textarea
              id="reason"
              {...register('reason', { required: '請輸入加班原因' })}
              placeholder="請詳細說明加班原因..."
              rows={4}
              className="w-full"
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              清除
            </Button>
            <Button type="submit" disabled={isSubmitting || hours <= 0}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  提交中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  提交申請
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OvertimeRequestForm;

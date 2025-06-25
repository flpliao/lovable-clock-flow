
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeFormData, OvertimeType } from '@/types/overtime';

interface OvertimeRequestFormProps {
  onSuccess?: () => void;
}

const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({ onSuccess }) => {
  const [overtimeTypes, setOvertimeTypes] = useState<OvertimeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OvertimeFormData>();

  useEffect(() => {
    loadOvertimeTypes();
  }, []);

  const loadOvertimeTypes = async () => {
    try {
      const types = await overtimeService.getOvertimeTypes();
      setOvertimeTypes(types);
    } catch (error) {
      console.error('載入加班類型失敗:', error);
      toast.error('載入加班類型失敗');
    }
  };

  const onSubmit = async (data: OvertimeFormData) => {
    setIsSubmitting(true);
    try {
      await overtimeService.submitOvertimeRequest(data);
      toast.success('加班申請提交成功');
      onSuccess?.();
    } catch (error) {
      console.error('提交失敗:', error);
      toast.error('加班申請提交失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>加班申請</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overtime_type">加班類型</Label>
              <Select onValueChange={(value) => setValue('overtime_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇加班類型" />
                </SelectTrigger>
                <SelectContent>
                  {overtimeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.code}>
                      {type.name_zh}
                      {type.compensation_type === 'compensatory_time' ? ' (補休)' : ' (加班費)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.overtime_type && (
                <p className="text-red-500 text-sm">請選擇加班類型</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime_date">加班日期</Label>
              <Input
                type="date"
                {...register('overtime_date', { required: '請選擇加班日期' })}
              />
              {errors.overtime_date && (
                <p className="text-red-500 text-sm">{errors.overtime_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">開始時間</Label>
              <Input
                type="time"
                {...register('start_time', { required: '請選擇開始時間' })}
              />
              {errors.start_time && (
                <p className="text-red-500 text-sm">{errors.start_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">結束時間</Label>
              <Input
                type="time"
                {...register('end_time', { required: '請選擇結束時間' })}
              />
              {errors.end_time && (
                <p className="text-red-500 text-sm">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">加班原因</Label>
            <Textarea
              {...register('reason', { required: '請填寫加班原因' })}
              placeholder="請詳細說明加班原因..."
              rows={4}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? '提交中...' : '提交申請'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OvertimeRequestForm;

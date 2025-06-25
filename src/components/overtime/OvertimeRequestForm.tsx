
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Gift } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">
          申請加班
        </h2>
        <p className="text-white/80 font-medium drop-shadow-sm">
          請填寫以下資訊提交加班申請
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 基本資訊 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white drop-shadow-md">基本資訊</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 加班日期 */}
            <div className="space-y-2">
              <Label htmlFor="overtime_date" className="text-white font-medium">加班日期</Label>
              <Input
                type="date"
                {...register('overtime_date', { required: '請選擇加班日期' })}
                className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
              />
              {errors.overtime_date && (
                <p className="text-red-300 text-sm">{errors.overtime_date.message}</p>
              )}
            </div>

            {/* 加班類型 */}
            <div className="space-y-2">
              <Label htmlFor="overtime_type" className="text-white font-medium">加班類型</Label>
              <Select onValueChange={(value) => setValue('overtime_type', value)}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-xl">
                  <SelectValue placeholder="選擇加班類型" className="text-white/60" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
                  {overtimeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.code}>
                      {type.name_zh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.overtime_type && (
                <p className="text-red-300 text-sm">請選擇加班類型</p>
              )}
            </div>
          </div>
        </div>

        {/* 時間設定 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white drop-shadow-md">時間設定</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 開始時間 */}
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-white font-medium">開始時間</Label>
              <Input
                type="time"
                {...register('start_time', { required: '請選擇開始時間' })}
                className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
                placeholder="--:--"
              />
              {errors.start_time && (
                <p className="text-red-300 text-sm">{errors.start_time.message}</p>
              )}
            </div>

            {/* 結束時間 */}
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-white font-medium">結束時間</Label>
              <Input
                type="time"
                {...register('end_time', { required: '請選擇結束時間' })}
                className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
                placeholder="--:--"
              />
              {errors.end_time && (
                <p className="text-red-300 text-sm">{errors.end_time.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* 補償方式 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white drop-shadow-md">補償方式</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="compensation_type" className="text-white font-medium">補償類型</Label>
            <Select onValueChange={(value) => setValue('compensation_type', value)}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-xl">
                <SelectValue placeholder="選擇補償方式" className="text-white/60" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
                <SelectItem value="overtime_pay">加班費</SelectItem>
                <SelectItem value="compensatory_time">補休</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 加班原因 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-5 text-white">📝</div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">加班原因</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white font-medium">詳細說明</Label>
            <Textarea
              {...register('reason', { required: '請填寫加班原因' })}
              placeholder="請詳細說明加班原因..."
              rows={4}
              className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl resize-none"
            />
            {errors.reason && (
              <p className="text-red-300 text-sm">{errors.reason.message}</p>
            )}
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full backdrop-blur-xl bg-white/30 border border-white/40 text-white font-semibold shadow-lg hover:bg-white/50 transition-all duration-300 rounded-xl py-4 text-lg"
          >
            {isSubmitting ? '提交中...' : '✈️ 提交申請'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OvertimeRequestForm;

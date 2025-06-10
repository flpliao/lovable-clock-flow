
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, Send, Calendar, MapPin, FileText, DollarSign, Timer } from 'lucide-react';

const OvertimeRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    overtimeDate: '',
    startTime: '',
    endTime: '',
    overtimeType: '',
    compensationType: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 這裡會整合實際的 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 調用
      
      toast({
        title: '申請成功',
        description: '您的加班申請已提交，等待主管審核',
      });
      
      // 重置表單
      setFormData({
        overtimeDate: '',
        startTime: '',
        endTime: '',
        overtimeType: '',
        compensationType: '',
        reason: ''
      });
    } catch (error) {
      toast({
        title: '申請失敗',
        description: '提交加班申請時發生錯誤，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 表單標題 */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white drop-shadow-md">加班申請表</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 日期和類型區塊 */}
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-5 w-5 text-white/80" />
            <h4 className="text-lg font-medium text-white">基本資訊</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="overtimeDate" className="flex items-center gap-2 text-white font-medium">
                <Calendar className="h-4 w-4" />
                加班日期
              </Label>
              <Input
                id="overtimeDate"
                type="date"
                value={formData.overtimeDate}
                onChange={(e) => setFormData(prev => ({ ...prev, overtimeDate: e.target.value }))}
                className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="overtimeType" className="flex items-center gap-2 text-white font-medium">
                <MapPin className="h-4 w-4" />
                加班類型
              </Label>
              <Select 
                value={formData.overtimeType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, overtimeType: value }))}
              >
                <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
                  <SelectValue placeholder="選擇加班類型" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                  <SelectItem value="weekday">平日加班</SelectItem>
                  <SelectItem value="weekend">假日加班</SelectItem>
                  <SelectItem value="holiday">國定假日加班</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 時間區塊 */}
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Timer className="h-5 w-5 text-white/80" />
            <h4 className="text-lg font-medium text-white">時間設定</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="startTime" className="flex items-center gap-2 text-white font-medium">
                <Timer className="h-4 w-4" />
                開始時間
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="endTime" className="flex items-center gap-2 text-white font-medium">
                <Clock className="h-4 w-4" />
                結束時間
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        {/* 補償方式區塊 */}
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-5 w-5 text-white/80" />
            <h4 className="text-lg font-medium text-white">補償設定</h4>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="compensationType" className="flex items-center gap-2 text-white font-medium">
              <DollarSign className="h-4 w-4" />
              補償方式
            </Label>
            <Select 
              value={formData.compensationType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, compensationType: value }))}
            >
              <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
                <SelectValue placeholder="選擇補償方式" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="pay">加班費</SelectItem>
                <SelectItem value="time_off">補休</SelectItem>
                <SelectItem value="both">加班費+補休</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 原因說明區塊 */}
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-5 w-5 text-white/80" />
            <h4 className="text-lg font-medium text-white">原因說明</h4>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reason" className="flex items-center gap-2 text-white font-medium">
              <FileText className="h-4 w-4" />
              加班原因
            </Label>
            <Textarea
              id="reason"
              placeholder="請詳細說明加班原因..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
              className="bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl resize-none"
              required
            />
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
          <Button 
            type="submit" 
            className="w-full h-12 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-5 w-5 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                提交申請
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OvertimeRequestForm;

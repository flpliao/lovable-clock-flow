
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, Send } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-4 w-4 mr-2 text-purple-600" />
          加班申請
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overtimeDate">加班日期</Label>
              <Input
                id="overtimeDate"
                type="date"
                value={formData.overtimeDate}
                onChange={(e) => setFormData(prev => ({ ...prev, overtimeDate: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="overtimeType">加班類型</Label>
              <Select 
                value={formData.overtimeType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, overtimeType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇加班類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekday">平日加班</SelectItem>
                  <SelectItem value="weekend">假日加班</SelectItem>
                  <SelectItem value="holiday">國定假日加班</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">開始時間</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">結束時間</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="compensationType">補償方式</Label>
            <Select 
              value={formData.compensationType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, compensationType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇補償方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pay">加班費</SelectItem>
                <SelectItem value="time_off">補休</SelectItem>
                <SelectItem value="both">加班費+補休</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">加班原因</Label>
            <Textarea
              id="reason"
              placeholder="請詳細說明加班原因..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                提交申請
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OvertimeRequestForm;

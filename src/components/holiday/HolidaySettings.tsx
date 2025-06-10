
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Edit, Trash2, Calendar, MapPin, Tag, Type, Repeat, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Holiday {
  id: string;
  country_id: string | null;
  name_zh: string;
  name_en: string;
  holiday_date: string;
  holiday_type: string;
  is_recurring: boolean;
  is_active: boolean;
}

const HolidaySettings: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    country_id: null as string | null,
    name_zh: '',
    name_en: '',
    holiday_date: '',
    holiday_type: 'national',
    is_recurring: false
  });
  const { toast } = useToast();

  const holidayTypes = [
    { value: 'national', label: '國定假日' },
    { value: 'regional', label: '地區性假日' },
    { value: 'religious', label: '宗教假日' },
    { value: 'labor', label: '勞工假日' }
  ];

  const countries = [
    { code: 'TW', name: '台灣' },
    { code: 'CN', name: '中國大陸' },
    { code: 'HK', name: '香港' },
    { code: 'JP', name: '日本' },
    { code: 'KR', name: '韓國' }
  ];

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('holiday_date', { ascending: true });

      if (error) {
        console.error('載入假日設定失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入假日設定",
          variant: "destructive"
        });
        return;
      }

      setHolidays(data || []);
    } catch (error) {
      console.error('載入假日設定異常:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const holidayData = {
        ...formData,
        is_active: true
      };

      if (editingHoliday) {
        // 更新假日
        const { error } = await supabase
          .from('holidays')
          .update(holidayData)
          .eq('id', editingHoliday.id);

        if (error) throw error;

        toast({
          title: "更新成功",
          description: "假日設定已更新",
        });
      } else {
        // 新增假日
        const { error } = await supabase
          .from('holidays')
          .insert([holidayData]);

        if (error) throw error;

        toast({
          title: "新增成功",
          description: "新假日已加入",
        });
      }

      // 重置表單
      setFormData({
        country_id: null,
        name_zh: '',
        name_en: '',
        holiday_date: '',
        holiday_type: 'national',
        is_recurring: false
      });
      setEditingHoliday(null);
      loadHolidays();
    } catch (error) {
      console.error('儲存假日設定失敗:', error);
      toast({
        title: "儲存失敗",
        description: "儲存假日設定時發生錯誤",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      country_id: holiday.country_id,
      name_zh: holiday.name_zh,
      name_en: holiday.name_en || '',
      holiday_date: holiday.holiday_date,
      holiday_type: holiday.holiday_type,
      is_recurring: holiday.is_recurring
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個假日嗎？')) return;

    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "刪除成功",
        description: "假日已刪除",
      });
      loadHolidays();
    } catch (error) {
      console.error('刪除假日失敗:', error);
      toast({
        title: "刪除失敗",
        description: "刪除假日時發生錯誤",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-gray-400/50">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">
                {editingHoliday ? '編輯假日' : '新增假日'}
              </h3>
              <p className="text-white/80 text-sm mt-1">管理系統假日設定</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 bg-blue-500/60 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/40">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <div className="p-2 bg-green-500/60 rounded-lg shadow-md backdrop-blur-xl border border-green-400/40">
              <Save className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 表單區域 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-white font-medium">
                <MapPin className="h-3 w-3" />
                地區
              </Label>
              <Select 
                value={formData.country_id || 'TW'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
              >
                <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="holiday_type" className="flex items-center gap-2 text-white font-medium">
                <Tag className="h-3 w-3" />
                假日類型
              </Label>
              <Select 
                value={formData.holiday_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, holiday_type: value }))}
              >
                <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                  {holidayTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_zh" className="flex items-center gap-2 text-white font-medium">
                <Type className="h-3 w-3" />
                中文名稱
              </Label>
              <Input
                id="name_zh"
                value={formData.name_zh}
                onChange={(e) => setFormData(prev => ({ ...prev, name_zh: e.target.value }))}
                placeholder="輸入中文假日名稱"
                required
                className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white placeholder-white/70 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_en" className="flex items-center gap-2 text-white font-medium">
                <Type className="h-3 w-3" />
                英文名稱
              </Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                placeholder="輸入英文假日名稱"
                className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white placeholder-white/70 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holiday_date" className="flex items-center gap-2 text-white font-medium">
              <Calendar className="h-3 w-3" />
              假日日期
            </Label>
            <Input
              id="holiday_date"
              type="date"
              value={formData.holiday_date}
              onChange={(e) => setFormData(prev => ({ ...prev, holiday_date: e.target.value }))}
              required
              className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_recurring"
              checked={formData.is_recurring}
              onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="is_recurring" className="flex items-center gap-2 text-white font-medium">
              <Repeat className="h-3 w-3" />
              每年重複
            </Label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-xl h-12">
              <Plus className="h-4 w-4 mr-2" />
              {editingHoliday ? '更新假日' : '新增假日'}
            </Button>
            {editingHoliday && (
              <Button 
                type="button" 
                variant="outline" 
                className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-xl h-12"
                onClick={() => {
                  setEditingHoliday(null);
                  setFormData({
                    country_id: null,
                    name_zh: '',
                    name_en: '',
                    holiday_date: '',
                    holiday_type: 'national',
                    is_recurring: false
                  });
                }}
              >
                取消
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* 假日清單 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/70 rounded-lg shadow-md">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">假日清單</h4>
        </div>
        
        {loading ? (
          <div className="text-center py-4 text-white">載入中...</div>
        ) : holidays.length === 0 ? (
          <div className="text-center py-4 text-white/70">尚無假日設定</div>
        ) : (
          <div className="space-y-3">
            {holidays.map(holiday => (
              <div key={holiday.id} className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Type className="h-3 w-3 text-white/70" />
                        <span className="font-medium text-white">{holiday.name_zh}</span>
                      </div>
                      {holiday.name_en && (
                        <span className="text-sm text-white/70">({holiday.name_en})</span>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-white/70" />
                        <Badge variant="outline" className="text-xs border-white/40 text-white">
                          {holiday.country_id || 'TW'}
                        </Badge>
                      </div>
                      <Badge className="text-xs bg-blue-500/70 text-white">
                        {holidayTypes.find(t => t.value === holiday.holiday_type)?.label}
                      </Badge>
                      {holiday.is_recurring && (
                        <div className="flex items-center gap-1">
                          <Repeat className="h-3 w-3 text-white/70" />
                          <Badge variant="secondary" className="text-xs bg-purple-500/70 text-white">
                            每年重複
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Calendar className="h-3 w-3" />
                      {new Date(holiday.holiday_date).toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg"
                      onClick={() => handleEdit(holiday)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg"
                      onClick={() => handleDelete(holiday.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaySettings;

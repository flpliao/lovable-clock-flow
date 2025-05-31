
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Holiday {
  id: string;
  country_code: string;
  name_zh: string;
  name_en: string;
  holiday_date: string;
  holiday_type: string;
  is_recurring: boolean;
}

const HolidaySettings: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    country_code: 'TW',
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
      if (editingHoliday) {
        // 更新假日
        const { error } = await supabase
          .from('holidays')
          .update(formData)
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
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "新增成功",
          description: "新假日已加入",
        });
      }

      // 重置表單
      setFormData({
        country_code: 'TW',
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
      country_code: holiday.country_code,
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Settings className="h-4 w-4 mr-2 text-gray-600" />
            {editingHoliday ? '編輯假日' : '新增假日'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country_code">地區</Label>
                <Select 
                  value={formData.country_code} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holiday_type">假日類型</Label>
                <Select 
                  value={formData.holiday_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, holiday_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="name_zh">中文名稱</Label>
                <Input
                  id="name_zh"
                  value={formData.name_zh}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_zh: e.target.value }))}
                  placeholder="輸入中文假日名稱"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_en">英文名稱</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder="輸入英文假日名稱"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="holiday_date">假日日期</Label>
              <Input
                id="holiday_date"
                type="date"
                value={formData.holiday_date}
                onChange={(e) => setFormData(prev => ({ ...prev, holiday_date: e.target.value }))}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
              />
              <Label htmlFor="is_recurring">每年重複</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {editingHoliday ? '更新假日' : '新增假日'}
              </Button>
              {editingHoliday && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingHoliday(null);
                    setFormData({
                      country_code: 'TW',
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">假日清單</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">載入中...</div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-4 text-gray-500">尚無假日設定</div>
          ) : (
            <div className="space-y-2">
              {holidays.map(holiday => (
                <div key={holiday.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{holiday.name_zh}</span>
                      {holiday.name_en && (
                        <span className="text-sm text-gray-500">({holiday.name_en})</span>
                      )}
                      <Badge variant="outline">{holiday.country_code}</Badge>
                      <Badge className="text-xs">
                        {holidayTypes.find(t => t.value === holiday.holiday_type)?.label}
                      </Badge>
                      {holiday.is_recurring && (
                        <Badge variant="secondary" className="text-xs">每年重複</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(holiday.holiday_date).toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(holiday)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(holiday.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidaySettings;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin, Tag, Type, Calendar, Repeat } from 'lucide-react';

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

interface HolidayFormProps {
  formData: {
    country_id: string | null;
    name_zh: string;
    name_en: string;
    holiday_date: string;
    holiday_type: string;
    is_recurring: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    country_id: string | null;
    name_zh: string;
    name_en: string;
    holiday_date: string;
    holiday_type: string;
    is_recurring: boolean;
  }>>;
  editingHoliday: Holiday | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

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

const HolidayForm: React.FC<HolidayFormProps> = ({
  formData,
  setFormData,
  editingHoliday,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
      <form onSubmit={onSubmit} className="space-y-6">
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
              onClick={onCancel}
            >
              取消
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HolidayForm;

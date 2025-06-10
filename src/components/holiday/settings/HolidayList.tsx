
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Type, MapPin, Repeat, Edit, Trash2 } from 'lucide-react';

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

interface HolidayListProps {
  holidays: Holiday[];
  loading: boolean;
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: string) => void;
}

const holidayTypes = [
  { value: 'national', label: '國定假日' },
  { value: 'regional', label: '地區性假日' },
  { value: 'religious', label: '宗教假日' },
  { value: 'labor', label: '勞工假日' }
];

const HolidayList: React.FC<HolidayListProps> = ({
  holidays,
  loading,
  onEdit,
  onDelete
}) => {
  return (
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
                    onClick={() => onEdit(holiday)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg"
                    onClick={() => onDelete(holiday.id)}
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
  );
};

export default HolidayList;

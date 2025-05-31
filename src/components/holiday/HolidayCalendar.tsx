
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Holiday {
  id: string;
  country_id: string | null;
  name_zh: string;
  name_en: string;
  holiday_date: string;
  holiday_type: string;
  is_active: boolean;
  is_recurring: boolean;
}

const HolidayCalendar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCountry, setSelectedCountry] = useState('TW');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const countries = [
    { code: 'TW', name: '台灣', flag: '🇹🇼' },
    { code: 'CN', name: '中國大陸', flag: '🇨🇳' },
    { code: 'HK', name: '香港', flag: '🇭🇰' },
    { code: 'JP', name: '日本', flag: '🇯🇵' },
    { code: 'KR', name: '韓國', flag: '🇰🇷' }
  ];

  const holidayTypeColors = {
    national: 'bg-red-100 text-red-800',
    regional: 'bg-blue-100 text-blue-800',
    religious: 'bg-purple-100 text-purple-800',
    labor: 'bg-green-100 text-green-800'
  };

  const loadHolidays = async () => {
    setLoading(true);
    try {
      // Since we don't have countries table yet, we'll simulate by using a simple filter
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .gte('holiday_date', `${selectedYear}-01-01`)
        .lte('holiday_date', `${selectedYear}-12-31`)
        .eq('is_active', true)
        .order('holiday_date');

      if (error) {
        console.error('載入假日資料失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入假日資料",
          variant: "destructive"
        });
        return;
      }

      // Filter by country code (simulated since we don't have proper country mapping yet)
      const filteredHolidays = data?.filter(holiday => {
        // For now, we'll assume all holidays in the DB are for Taiwan
        return selectedCountry === 'TW';
      }) || [];

      setHolidays(filteredHolidays);
    } catch (error) {
      console.error('載入假日資料異常:', error);
      toast({
        title: "載入異常",
        description: "載入假日資料時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, [selectedYear, selectedCountry]);

  const groupHolidaysByMonth = () => {
    const grouped: { [key: number]: Holiday[] } = {};
    holidays.forEach(holiday => {
      const month = new Date(holiday.holiday_date).getMonth() + 1;
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(holiday);
    });
    return grouped;
  };

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            假日行事曆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">選擇年份</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year} 年</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">選擇地區</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center">
                        <span className="mr-2">{country.flag}</span>
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">載入中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthNames.map((monthName, index) => {
                const monthHolidays = groupHolidaysByMonth()[index + 1] || [];
                return (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{monthName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {monthHolidays.length === 0 ? (
                        <p className="text-sm text-gray-500">無法定假日</p>
                      ) : (
                        <div className="space-y-2">
                          {monthHolidays.map(holiday => (
                            <div key={holiday.id} className="p-2 border border-gray-100 rounded">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">{holiday.name_zh}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(holiday.holiday_date).toLocaleDateString('zh-TW')}
                                  </p>
                                </div>
                                <Badge className={`text-xs ${holidayTypeColors[holiday.holiday_type as keyof typeof holidayTypeColors]}`}>
                                  {holiday.holiday_type === 'national' && '國定'}
                                  {holiday.holiday_type === 'regional' && '地區'}
                                  {holiday.holiday_type === 'religious' && '宗教'}
                                  {holiday.holiday_type === 'labor' && '勞工'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayCalendar;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, BarChart3, PieChart as PieChartIcon, Filter, MapPin, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MonthlyData {
  month: string;
  workDays: number;
  holidays: number;
  totalHours: number;
  requiredHours: number;
}

const WorkHoursAnalytics: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCountry, setSelectedCountry] = useState('TW');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Taiwan labor law defaults
  const workTimeDefaults = {
    weekly_work_hours: 40,
    daily_work_hours: 8,
    annual_leave_days: 7
  };

  const calculateMonthlyData = async () => {
    setLoading(true);
    try {
      const { data: holidays, error } = await supabase
        .from('holidays')
        .select('holiday_date')
        .gte('holiday_date', `${selectedYear}-01-01`)
        .lte('holiday_date', `${selectedYear}-12-31`)
        .eq('is_active', true);

      if (error) {
        console.error('載入假日資料失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入假日資料",
          variant: "destructive"
        });
        return;
      }

      const holidayDates = new Set(holidays?.map(h => h.holiday_date) || []);
      const monthlyStats: MonthlyData[] = [];

      for (let month = 0; month < 12; month++) {
        const year = selectedYear;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let workDays = 0;
        let holidayCount = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          const dateString = date.toISOString().split('T')[0];
          const dayOfWeek = date.getDay();

          if (holidayDates.has(dateString)) {
            holidayCount++;
          } else if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 不是週末
            workDays++;
          }
        }

        const totalHours = workDays * workTimeDefaults.daily_work_hours;
        const requiredHours = Math.floor((daysInMonth - holidayCount) * (workTimeDefaults.weekly_work_hours / 7));

        monthlyStats.push({
          month: `${month + 1}月`,
          workDays,
          holidays: holidayCount,
          totalHours,
          requiredHours
        });
      }

      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error('計算月度資料異常:', error);
      toast({
        title: "計算異常",
        description: "計算工時統計時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateMonthlyData();
  }, [selectedYear, selectedCountry]);

  const yearlyStats = {
    totalWorkDays: monthlyData.reduce((sum, month) => sum + month.workDays, 0),
    totalHolidays: monthlyData.reduce((sum, month) => sum + month.holidays, 0),
    totalWorkHours: monthlyData.reduce((sum, month) => sum + month.totalHours, 0),
    averageMonthlyHours: monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, month) => sum + month.totalHours, 0) / monthlyData.length) : 0
  };

  const pieChartData = [
    { name: '工作日', value: yearlyStats.totalWorkDays, color: '#0088FE' },
    { name: '假日', value: yearlyStats.totalHolidays, color: '#00C49F' },
    { name: '週末', value: 104 - yearlyStats.totalHolidays, color: '#FFBB28' }
  ];

  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">工時統計分析</h3>
              <p className="text-white/80 text-sm mt-1">分析年度工作時數與假日分布</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 bg-blue-500/60 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/40">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div className="p-2 bg-purple-500/60 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/40">
              <PieChartIcon className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 篩選器區域 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/80 rounded-lg shadow-md">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <h4 className="text-base font-medium text-white">統計設定</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Calendar className="h-3 w-3" />
              統計年份
            </label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <SelectItem key={year} value={year.toString()}>{year} 年</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <MapPin className="h-3 w-3" />
              適用地區
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="TW">🇹🇼 台灣</SelectItem>
                <SelectItem value="CN">🇨🇳 中國大陸</SelectItem>
                <SelectItem value="HK">🇭🇰 香港</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-8">
          <div className="text-center text-white">計算中...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 年度統計卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/70 rounded-lg shadow-md">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/80 text-sm">工作日</span>
              </div>
              <div className="text-2xl font-bold text-white">{yearlyStats.totalWorkDays}</div>
              <div className="text-white/70 text-xs">年度工作日</div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/70 rounded-lg shadow-md">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/80 text-sm">假日</span>
              </div>
              <div className="text-2xl font-bold text-white">{yearlyStats.totalHolidays}</div>
              <div className="text-white/70 text-xs">法定假日</div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/70 rounded-lg shadow-md">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/80 text-sm">工時</span>
              </div>
              <div className="text-2xl font-bold text-white">{yearlyStats.totalWorkHours}</div>
              <div className="text-white/70 text-xs">年度工時</div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/70 rounded-lg shadow-md">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/80 text-sm">平均</span>
              </div>
              <div className="text-2xl font-bold text-white">{yearlyStats.averageMonthlyHours}</div>
              <div className="text-white/70 text-xs">月均工時</div>
            </div>
          </div>

          {/* 月度工時圖表 */}
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/70 rounded-lg shadow-md">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">月度工時統計</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalHours" fill="#8884d8" name="實際工時" />
                <Bar dataKey="requiredHours" fill="#82ca9d" name="應工工時" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 年度日數分佈圓餅圖 */}
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/70 rounded-lg shadow-md">
                <PieChartIcon className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">年度日數分佈</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkHoursAnalytics;

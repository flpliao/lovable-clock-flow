
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            工時統計分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">統計年份</label>
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
              <label className="text-sm font-medium">適用地區</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TW">🇹🇼 台灣</SelectItem>
                  <SelectItem value="CN">🇨🇳 中國大陸</SelectItem>
                  <SelectItem value="HK">🇭🇰 香港</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">計算中...</div>
          ) : (
            <div className="space-y-6">
              {/* 年度統計卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{yearlyStats.totalWorkDays}</div>
                    <div className="text-sm text-gray-600">年度工作日</div>
                  </CardContent>
                </Card>
                <Card className="border border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{yearlyStats.totalHolidays}</div>
                    <div className="text-sm text-gray-600">法定假日</div>
                  </CardContent>
                </Card>
                <Card className="border border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{yearlyStats.totalWorkHours}</div>
                    <div className="text-sm text-gray-600">年度工時</div>
                  </CardContent>
                </Card>
                <Card className="border border-orange-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{yearlyStats.averageMonthlyHours}</div>
                    <div className="text-sm text-gray-600">月均工時</div>
                  </CardContent>
                </Card>
              </div>

              {/* 月度工時圖表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">月度工時統計</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* 年度日數分佈圓餅圖 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">年度日數分佈</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHoursAnalytics;

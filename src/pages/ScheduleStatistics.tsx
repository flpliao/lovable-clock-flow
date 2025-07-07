import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transformFromSupabase } from '@/contexts/scheduling/transformUtils';
import { Schedule } from '@/contexts/scheduling/types';
import { scheduleService } from '@/services/scheduleService';
import { CalendarDays, Clock, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface ScheduleStats {
  totalSchedules: number;
  totalWorkHours: number;
  averageHoursPerDay: number;
  mostActiveDay: string;
  monthlyData: { month: string; schedules: number }[];
}

const ScheduleStatistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScheduleStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // 從 scheduleService 載入排班資料
        const supabaseSchedules = await scheduleService.getAllSchedules();
        const schedules = supabaseSchedules.map(transformFromSupabase);

        // 計算統計資料
        const calculatedStats = calculateStats(schedules);
        setStats(calculatedStats);
      } catch (err) {
        console.error('Failed to load schedule statistics:', err);
        setError(err instanceof Error ? err.message : '載入統計資料失敗');
      } finally {
        setLoading(false);
      }
    };

    loadScheduleStats();
  }, []);

  const calculateStats = (schedules: Schedule[]): ScheduleStats => {
    const totalSchedules = schedules.length;

    // 計算總工作時數
    const totalWorkHours = schedules.reduce((total, schedule) => {
      const startTime = new Date(`2000-01-01T${schedule.startTime}`);
      const endTime = new Date(`2000-01-01T${schedule.endTime}`);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    // 計算每日平均工作時數
    const uniqueDays = new Set(schedules.map(s => s.workDate)).size;
    const averageHoursPerDay = uniqueDays > 0 ? totalWorkHours / uniqueDays : 0;

    // 找出最活躍的一天
    const dayCount = schedules.reduce(
      (acc, schedule) => {
        const day = new Date(schedule.workDate).toLocaleDateString('zh-TW', { weekday: 'long' });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostActiveDay =
      Object.entries(dayCount).reduce((a, b) => (dayCount[a[0]] > dayCount[b[0]] ? a : b))[0] ||
      '無資料';

    // 計算月度資料
    const monthlyData = schedules.reduce(
      (acc, schedule) => {
        const month = new Date(schedule.workDate).toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'short',
        });
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.schedules += 1;
        } else {
          acc.push({ month, schedules: 1 });
        }
        return acc;
      },
      [] as { month: string; schedules: number }[]
    );

    return {
      totalSchedules,
      totalWorkHours: Math.round(totalWorkHours * 10) / 10,
      averageHoursPerDay: Math.round(averageHoursPerDay * 10) / 10,
      mostActiveDay,
      monthlyData: monthlyData.sort((a, b) => a.month.localeCompare(b.month)),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            載入統計資料中...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <div className="text-red-300 mb-4">載入失敗: {error}</div>
            <Button onClick={() => navigate('/scheduling')} variant="outline">
              返回排班管理
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">無統計資料可顯示</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 頁面標題 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">排班統計</h1>
          <p className="text-white/80">查看排班資料的統計分析</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總排班數</CardTitle>
              <CalendarDays className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSchedules}</div>
              <p className="text-xs text-white/70">累計排班記錄</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總工作時數</CardTitle>
              <Clock className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkHours}h</div>
              <p className="text-xs text-white/70">累計工作時數</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">日均工作時數</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageHoursPerDay}h</div>
              <p className="text-xs text-white/70">每日平均時數</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">最活躍日</CardTitle>
              <Users className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mostActiveDay}</div>
              <p className="text-xs text-white/70">排班最多的日子</p>
            </CardContent>
          </Card>
        </div>

        {/* 月度統計圖表 */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader>
            <CardTitle>月度排班統計</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <XAxis dataKey="month" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Bar dataKey="schedules" fill="#ffffff" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 返回按鈕 */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/scheduling')}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            返回排班管理
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStatistics;

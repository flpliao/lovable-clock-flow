import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import dayjs from 'dayjs';
import { Building2, Calendar, Clock, Plus, Search, Settings, Users } from 'lucide-react';
import React, { useState } from 'react';

const ScheduleManagement = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'list' | 'stats'>('calendar');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('YYYY-MM'));

  // 模擬單位數據
  const units = [
    { id: '1', name: '資訊部' },
    { id: '2', name: '人事部' },
    { id: '3', name: '財務部' },
    { id: '4', name: '行銷部' },
    { id: '5', name: '客服部' },
  ];

  // 模擬排班數據
  const mockSchedules = [
    {
      id: 1,
      employee: '張小明',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '17:00',
      status: 'confirmed',
    },
    {
      id: 2,
      employee: '李小華',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '18:00',
      status: 'pending',
    },
    {
      id: 3,
      employee: '王小美',
      date: '2024-01-16',
      startTime: '08:00',
      endTime: '16:00',
      status: 'confirmed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '已確認';
      case 'pending':
        return '待確認';
      default:
        return '未知';
    }
  };

  // 檢查是否已選擇單位和月份
  const isSelectionComplete = selectedUnit && selectedMonth;

  // 使用 dayjs 格式化月份顯示
  const formatMonthDisplay = (monthValue: string) => {
    if (!monthValue) return '';
    return dayjs(monthValue).format('YYYY年MM月');
  };

  // 處理月份變更
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
  };

  return (
    <PageLayout>
      {/* 頁面標題 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">排班管理</h1>
          <p className="text-white/70">管理員工工作時間安排</p>
        </div>
      </div>

      {/* 選擇區域 */}
      <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">選擇查看條件</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 單位選擇 */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">選擇單位</label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="請選擇單位" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 border-white/20">
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.id} className="text-gray-800">
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 月份選擇 */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">選擇月份</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請選擇月份"
            />
          </div>
        </div>

        {/* 選擇完成提示 */}
        {isSelectionComplete && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-100 text-sm">
                已選擇：{units.find(u => u.id === selectedUnit)?.name} -{' '}
                {formatMonthDisplay(selectedMonth)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 只有選擇完成後才顯示儀表板內容 */}
      {isSelectionComplete ? (
        <>
          {/* 操作按鈕 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Search className="h-4 w-4 mr-2" />
                搜尋
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                新增排班
              </Button>
            </div>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">總員工數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">24</span>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">今日排班</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">18</span>
                  <Calendar className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">待確認</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">3</span>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">設定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">-</span>
                  <Settings className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 視圖切換 */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setActiveView('calendar')}
              className={
                activeView === 'calendar'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              月曆視圖
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'outline'}
              onClick={() => setActiveView('list')}
              className={
                activeView === 'list'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }
            >
              <Users className="h-4 w-4 mr-2" />
              列表視圖
            </Button>
            <Button
              variant={activeView === 'stats' ? 'default' : 'outline'}
              onClick={() => setActiveView('stats')}
              className={
                activeView === 'stats'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }
            >
              <Settings className="h-4 w-4 mr-2" />
              統計視圖
            </Button>
          </div>

          {/* 主要內容區域 */}
          <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6">
            {activeView === 'calendar' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">月曆視圖</h2>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                    <div key={day} className="text-center text-white/70 font-medium py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div
                      key={i}
                      className="h-20 border border-white/10 rounded-lg p-2 text-white/50 text-sm hover:bg-white/5 cursor-pointer"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'list' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">排班列表</h2>
                <div className="space-y-3">
                  {mockSchedules.map(schedule => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{schedule.employee}</h3>
                          <p className="text-white/60 text-sm">{schedule.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-white/80">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}
                        >
                          {getStatusText(schedule.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'stats' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">統計分析</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">每週工作時數</CardTitle>
                      <CardDescription className="text-white/60">
                        員工平均工作時數統計
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">40.5 小時</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">排班覆蓋率</CardTitle>
                      <CardDescription className="text-white/60">
                        已安排排班的員工比例
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">75%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 未選擇完成時的提示 */
        <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">請先選擇單位和月份</h3>
          <p className="text-white/60">選擇完成後即可查看排班資訊</p>
        </div>
      )}
    </PageLayout>
  );
};

export default ScheduleManagement;

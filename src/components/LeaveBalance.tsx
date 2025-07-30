import React, { useState } from 'react';

const LeaveBalance: React.FC = () => {
  // 模擬資料
  const [balance] = useState({
    total_days: 14,
    used_days: 5,
    remaining_days: 9,
  });

  const [loading] = useState(false);

  // 模擬年資資料
  const hireDate = new Date('2023-01-15');
  const formattedYears = '1年3個月';

  // 使用模擬資料
  const totalDays = balance.total_days;
  const usedDays = balance.used_days;
  const remainingDays = balance.remaining_days;

  // Convert to hours (8 hours per day)
  const totalHours = totalDays * 8;
  const usedHours = usedDays * 8;
  const remainingHours = remainingDays * 8;

  const usagePercentage = totalHours > 0 ? Math.round((usedHours / totalHours) * 100) : 0;

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-200 rounded-xl h-20"></div>
            <div className="bg-gray-200 rounded-xl h-20"></div>
            <div className="bg-gray-200 rounded-xl h-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 年資資訊 */}
      <div className="bg-blue-50 rounded-xl border p-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">服務年資</div>
          <div className="text-lg font-bold text-blue-600">{formattedYears}</div>
          <div className="text-xs text-gray-500">
            入職日期：{hireDate.toLocaleDateString('zh-TW')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalHours}</div>
            <div className="text-gray-600 text-sm">年度總額（小時）</div>
            <div className="text-gray-500 text-xs">{totalDays} 天</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{usedHours}</div>
            <div className="text-gray-600 text-sm">已使用（小時）</div>
            <div className="text-gray-500 text-xs">{usedDays} 天</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{remainingHours}</div>
            <div className="text-gray-600 text-sm">剩餘時數（小時）</div>
            <div className="text-gray-500 text-xs">{remainingDays} 天</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-50 rounded-xl border p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">使用進度</span>
          <span className="text-gray-900 font-bold">{usagePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0 天</span>
          <span>{totalDays} 天</span>
        </div>
      </div>

      {/* 提醒訊息 */}
      {remainingDays <= 2 && remainingDays > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">特休餘額即將用完，請合理安排休假時間</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveBalance;

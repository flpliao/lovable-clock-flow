
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface YearlyDistributionChartProps {
  totalWorkDays: number;
  totalHolidays: number;
}

const YearlyDistributionChart: React.FC<YearlyDistributionChartProps> = ({
  totalWorkDays,
  totalHolidays
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieChartData = [
    { name: '工作日', value: totalWorkDays, color: '#0088FE' },
    { name: '假日', value: totalHolidays, color: '#00C49F' },
    { name: '週末', value: 104 - totalHolidays, color: '#FFBB28' }
  ];

  return (
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
  );
};

export default YearlyDistributionChart;

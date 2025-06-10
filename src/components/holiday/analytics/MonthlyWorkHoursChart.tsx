
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface MonthlyData {
  month: string;
  workDays: number;
  holidays: number;
  totalHours: number;
  requiredHours: number;
}

interface MonthlyWorkHoursChartProps {
  data: MonthlyData[];
}

const MonthlyWorkHoursChart: React.FC<MonthlyWorkHoursChartProps> = ({ data }) => {
  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/70 rounded-lg shadow-md">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h4 className="text-lg font-semibold text-white">月度工時統計</h4>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
  );
};

export default MonthlyWorkHoursChart;

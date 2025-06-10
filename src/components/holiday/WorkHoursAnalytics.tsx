
import React, { useState } from 'react';
import WorkHoursHeader from './analytics/WorkHoursHeader';
import WorkHoursFilters from './analytics/WorkHoursFilters';
import WorkHoursStatsCards from './analytics/WorkHoursStatsCards';
import MonthlyWorkHoursChart from './analytics/MonthlyWorkHoursChart';
import YearlyDistributionChart from './analytics/YearlyDistributionChart';
import { useWorkHoursData } from './analytics/hooks/useWorkHoursData';

const WorkHoursAnalytics: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCountry, setSelectedCountry] = useState('TW');
  
  const { monthlyData, loading } = useWorkHoursData(selectedYear, selectedCountry);

  const yearlyStats = {
    totalWorkDays: monthlyData.reduce((sum, month) => sum + month.workDays, 0),
    totalHolidays: monthlyData.reduce((sum, month) => sum + month.holidays, 0),
    totalWorkHours: monthlyData.reduce((sum, month) => sum + month.totalHours, 0),
    averageMonthlyHours: monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, month) => sum + month.totalHours, 0) / monthlyData.length) : 0
  };

  return (
    <div className="space-y-6">
      <WorkHoursHeader />

      <WorkHoursFilters
        selectedYear={selectedYear}
        selectedCountry={selectedCountry}
        onYearChange={setSelectedYear}
        onCountryChange={setSelectedCountry}
      />

      {loading ? (
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-8">
          <div className="text-center text-white">計算中...</div>
        </div>
      ) : (
        <div className="space-y-6">
          <WorkHoursStatsCards
            totalWorkDays={yearlyStats.totalWorkDays}
            totalHolidays={yearlyStats.totalHolidays}
            totalWorkHours={yearlyStats.totalWorkHours}
            averageMonthlyHours={yearlyStats.averageMonthlyHours}
          />

          <MonthlyWorkHoursChart data={monthlyData} />

          <YearlyDistributionChart
            totalWorkDays={yearlyStats.totalWorkDays}
            totalHolidays={yearlyStats.totalHolidays}
          />
        </div>
      )}
    </div>
  );
};

export default WorkHoursAnalytics;


import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText, CreditCard, Hash } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Profit',
      value: '$8,458,798',
      change: '+35% vs Last Month',
      changeType: 'positive',
      icon: DollarSign,
      iconBg: 'bg-teal-500/80',
      iconBorder: 'border-teal-400/50'
    },
    {
      title: 'Invoice Due',
      value: '$48,988,78',
      change: '+35% vs Last Month',
      changeType: 'positive',
      icon: FileText,
      iconBg: 'bg-green-500/80',
      iconBorder: 'border-green-400/50'
    },
    {
      title: 'Total Expenses',
      value: '$8,980,097',
      change: '+41% vs Last Month',
      changeType: 'positive',
      icon: CreditCard,
      iconBg: 'bg-red-500/80',
      iconBorder: 'border-red-400/50'
    },
    {
      title: 'Total Payment Returns',
      value: '$78,458,798',
      change: '-20% vs Last Month',
      changeType: 'negative',
      icon: Hash,
      iconBg: 'bg-purple-500/80',
      iconBorder: 'border-purple-400/50'
    }
  ];

  const StatCard = ({ stat }: { stat: any }) => (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative hover:scale-[1.02] group">
      {/* 柔和的背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${stat.iconBg} rounded-xl shadow-lg backdrop-blur-xl border ${stat.iconBorder} text-white group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <button className="text-gray-800 hover:text-gray-600 font-semibold text-sm underline decoration-2 underline-offset-4 transition-colors duration-300">
            View All
          </button>
        </div>
        
        {/* Value */}
        <div className="mb-4">
          <h3 className="text-3xl font-bold text-gray-900 drop-shadow-lg mb-1">
            {stat.value}
          </h3>
          <p className="text-gray-600 font-medium text-sm drop-shadow-sm">
            {stat.title}
          </p>
        </div>
        
        {/* Progress line */}
        <div className="w-full h-px bg-white/30 mb-4"></div>
        
        {/* Change indicator */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 ${
            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
          } font-semibold text-sm drop-shadow-sm`}>
            {stat.changeType === 'positive' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{stat.change}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center sm:text-left drop-shadow-lg">儀表板統計</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;

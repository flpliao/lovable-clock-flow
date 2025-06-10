
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
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Invoice Due',
      value: '$48,988,78',
      change: '+35% vs Last Month',
      changeType: 'positive',
      icon: FileText,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: '$8,980,097',
      change: '+41% vs Last Month',
      changeType: 'positive',
      icon: CreditCard,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Payment Returns',
      value: '$78,458,798',
      change: '-20% vs Last Month',
      changeType: 'negative',
      icon: Hash,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const StatCard = ({ stat }: { stat: any }) => (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
      <div className="relative z-10">
        {/* Header with icon and value */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 font-medium text-sm">
              {stat.title}
            </p>
          </div>
          <div className={`p-3 ${stat.iconBg} rounded-2xl shadow-sm ${stat.iconColor} group-hover:shadow-md transition-all duration-300`}>
            <stat.icon className="h-6 w-6" />
          </div>
        </div>
        
        {/* Divider line */}
        <div className="w-full h-px bg-gray-200 mb-4"></div>
        
        {/* Change indicator and View All */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 ${
            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
          } font-semibold text-sm`}>
            {stat.changeType === 'positive' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{stat.change}</span>
          </div>
          <button className="text-gray-700 hover:text-gray-900 font-medium text-sm underline decoration-2 underline-offset-4 transition-colors duration-200">
            View All
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">儀表板統計</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;

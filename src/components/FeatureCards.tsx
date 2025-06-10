
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Settings,
  BarChart3,
  Bell,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { visionProStyles, createLiquidGlassEffect } from '@/utils/visionProStyles';

interface FeatureCardsProps {
  abnormalCount: number;
  annualLeaveBalance: number;
}

const FeatureCards = ({ abnormalCount, annualLeaveBalance }: FeatureCardsProps) => {
  const { isAdmin, isManager } = useUser();

  // 主要功能卡片
  const mainFeatures = [
    {
      title: '個人出勤',
      description: '查看出勤記錄',
      icon: Clock,
      link: '/personal-attendance',
      gradient: 'from-green-400/20 to-emerald-500/20',
      iconBg: 'bg-green-400/40',
      iconColor: 'text-white'
    },
    {
      title: '請假申請',
      description: '申請各類假期',
      icon: FileText,
      link: '/leave-request',
      gradient: 'from-blue-400/20 to-blue-500/20',
      iconBg: 'bg-blue-400/40',
      iconColor: 'text-white',
      badge: annualLeaveBalance > 0 ? `${annualLeaveBalance}小時` : null
    },
    {
      title: '排班管理',
      description: '查看工作排班',
      icon: Calendar,
      link: '/scheduling',
      gradient: 'from-purple-400/20 to-purple-500/20',
      iconBg: 'bg-purple-400/40',
      iconColor: 'text-white'
    },
    {
      title: '公司公告',
      description: '最新消息通知',
      icon: Bell,
      link: '/company-announcements',
      gradient: 'from-orange-400/20 to-orange-500/20',
      iconBg: 'bg-orange-400/40',
      iconColor: 'text-white'
    }
  ];

  // 管理功能卡片
  const adminFeatures = [
    {
      title: '人員管理',
      description: '管理員工資料',
      icon: Users,
      link: '/personnel-management',
      gradient: 'from-indigo-400/20 to-indigo-500/20',
      iconBg: 'bg-indigo-400/40',
      iconColor: 'text-white'
    },
    {
      title: '員工儀表板',
      description: '查看員工狀態',
      icon: BarChart3,
      link: '/staff-dashboard',
      gradient: 'from-teal-400/20 to-teal-500/20',
      iconBg: 'bg-teal-400/40',
      iconColor: 'text-white',
      badge: abnormalCount > 0 ? `${abnormalCount}異常` : null
    },
    {
      title: '系統設定',
      description: '系統參數設定',
      icon: Settings,
      link: '/system-settings',
      gradient: 'from-gray-400/20 to-gray-500/20',
      iconBg: 'bg-gray-400/40',
      iconColor: 'text-white'
    },
    {
      title: '分公司管理',
      description: '管理分公司資料',
      icon: MapPin,
      link: '/company-branch-management',
      gradient: 'from-red-400/20 to-red-500/20',
      iconBg: 'bg-red-400/40',
      iconColor: 'text-white'
    }
  ];

  const FeatureCard = ({ feature }: { feature: any }) => (
    <div className={`group ${createLiquidGlassEffect(true)} hover:scale-[1.02] transition-all duration-500 overflow-hidden relative`}>
      <Link to={feature.link} className="block">
        <div className={`bg-gradient-to-br ${feature.gradient} transition-all duration-500 p-6 sm:p-8 relative overflow-hidden h-full`}>
          {/* 光線效果背景 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 ${feature.iconBg} rounded-2xl backdrop-blur-xl border border-white/40 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                <feature.icon className={`h-7 w-7 sm:h-8 sm:w-8 ${feature.iconColor} drop-shadow-lg`} />
              </div>
              {feature.badge && (
                <Badge className="bg-white/60 text-gray-800 border-white/60 text-xs backdrop-blur-xl font-semibold drop-shadow-md px-3 py-1 rounded-full shadow-lg">
                  {feature.badge}
                </Badge>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-end">
              <h3 className="font-bold text-white text-lg sm:text-xl mb-3 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed drop-shadow-md font-medium">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* 主要功能區 */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left drop-shadow-xl">主要功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* 管理功能區 - 只有管理員可見 */}
      {(isAdmin() || isManager()) && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left drop-shadow-xl">管理功能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {adminFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCards;

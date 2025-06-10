
import React from 'react';
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

interface FeatureCardsProps {
  abnormalCount: number;
  annualLeaveBalance: number;
}

const FeatureCards = ({ abnormalCount, annualLeaveBalance }: FeatureCardsProps) => {
  const { isAdmin, isManager } = useUser();

  // 主要功能卡片 - 使用圖片中的設計風格
  const mainFeatures = [
    {
      title: '個人出勤',
      description: '查看出勤記錄',
      icon: Clock,
      link: '/personal-attendance',
      colorClass: 'bg-green-500/80',
      borderClass: 'border-green-400/50'
    },
    {
      title: '請假申請',
      description: '申請各類假期',
      icon: FileText,
      link: '/leave-request',
      colorClass: 'bg-blue-500/80',
      borderClass: 'border-blue-400/50',
      badge: annualLeaveBalance > 0 ? `${annualLeaveBalance}小時` : null
    },
    {
      title: '排班管理',
      description: '查看工作排班',
      icon: Calendar,
      link: '/scheduling',
      colorClass: 'bg-purple-500/80',
      borderClass: 'border-purple-400/50'
    },
    {
      title: '公司公告',
      description: '最新消息通知',
      icon: Bell,
      link: '/company-announcements',
      colorClass: 'bg-orange-500/80',
      borderClass: 'border-orange-400/50'
    }
  ];

  // 管理功能卡片
  const adminFeatures = [
    {
      title: '人員管理',
      description: '管理員工資料',
      icon: Users,
      link: '/personnel-management',
      colorClass: 'bg-indigo-500/80',
      borderClass: 'border-indigo-400/50'
    },
    {
      title: '員工儀表板',
      description: '查看員工狀態',
      icon: BarChart3,
      link: '/staff-dashboard',
      colorClass: 'bg-teal-500/80',
      borderClass: 'border-teal-400/50',
      badge: abnormalCount > 0 ? `${abnormalCount}異常` : null
    },
    {
      title: '系統設定',
      description: '系統參數設定',
      icon: Settings,
      link: '/system-settings',
      colorClass: 'bg-gray-500/80',
      borderClass: 'border-gray-400/50'
    },
    {
      title: '分公司管理',
      description: '管理分公司資料',
      icon: MapPin,
      link: '/company-branch-management',
      colorClass: 'bg-red-500/80',
      borderClass: 'border-red-400/50'
    }
  ];

  const FeatureCard = ({ feature }: { feature: any }) => (
    <div className="group backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative hover:scale-[1.02]">
      <Link to={feature.link} className="block">
        <div className="p-6 sm:p-8 relative overflow-hidden h-full">
          {/* 柔和的背景光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 ${feature.colorClass} rounded-xl shadow-lg backdrop-blur-xl border ${feature.borderClass} text-white group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                <feature.icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              {feature.badge && (
                <Badge className="bg-white/70 text-gray-800 border-white/40 text-xs backdrop-blur-xl font-semibold drop-shadow-sm px-3 py-1 rounded-full shadow-md">
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
        <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left drop-shadow-lg">主要功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* 管理功能區 - 只有管理員可見 */}
      {(isAdmin() || isManager()) && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left drop-shadow-lg">管理功能</h2>
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

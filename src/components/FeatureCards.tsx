
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
      gradient: 'from-green-400/30 to-emerald-600/30',
      iconBg: 'bg-green-500/40',
      iconColor: 'text-gray-800'
    },
    {
      title: '請假申請',
      description: '申請各類假期',
      icon: FileText,
      link: '/leave-request',
      gradient: 'from-blue-400/30 to-blue-600/30',
      iconBg: 'bg-blue-500/40',
      iconColor: 'text-gray-800',
      badge: annualLeaveBalance > 0 ? `${annualLeaveBalance}小時` : null
    },
    {
      title: '排班管理',
      description: '查看工作排班',
      icon: Calendar,
      link: '/scheduling',
      gradient: 'from-purple-400/30 to-purple-600/30',
      iconBg: 'bg-purple-500/40',
      iconColor: 'text-gray-800'
    },
    {
      title: '公司公告',
      description: '最新消息通知',
      icon: Bell,
      link: '/company-announcements',
      gradient: 'from-orange-400/30 to-orange-600/30',
      iconBg: 'bg-orange-500/40',
      iconColor: 'text-gray-800'
    }
  ];

  // 管理功能卡片
  const adminFeatures = [
    {
      title: '人員管理',
      description: '管理員工資料',
      icon: Users,
      link: '/personnel-management',
      gradient: 'from-indigo-400/30 to-indigo-600/30',
      iconBg: 'bg-indigo-500/40',
      iconColor: 'text-gray-800'
    },
    {
      title: '員工儀表板',
      description: '查看員工狀態',
      icon: BarChart3,
      link: '/staff-dashboard',
      gradient: 'from-teal-400/30 to-teal-600/30',
      iconBg: 'bg-teal-500/40',
      iconColor: 'text-gray-800',
      badge: abnormalCount > 0 ? `${abnormalCount}異常` : null
    },
    {
      title: '系統設定',
      description: '系統參數設定',
      icon: Settings,
      link: '/system-settings',
      gradient: 'from-gray-400/30 to-gray-600/30',
      iconBg: 'bg-gray-500/40',
      iconColor: 'text-gray-800'
    },
    {
      title: '分公司管理',
      description: '管理分公司資料',
      icon: MapPin,
      link: '/company-branch-management',
      gradient: 'from-red-400/30 to-red-600/30',
      iconBg: 'bg-red-500/40',
      iconColor: 'text-gray-800'
    }
  ];

  const FeatureCard = ({ feature }: { feature: any }) => (
    <Card className="group hover:scale-[1.02] transition-all duration-300 border-0 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/25 hover:bg-white/35 border border-white/40">
      <CardContent className="p-0">
        <Link to={feature.link}>
          <div className={`bg-gradient-to-br ${feature.gradient} transition-all duration-300 p-5 sm:p-6 relative overflow-hidden`}>
            {/* Vision Pro 風格的光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${feature.iconBg} rounded-2xl backdrop-blur-xl border border-white/50 shadow-lg`}>
                  <feature.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.iconColor} drop-shadow-md`} />
                </div>
                {feature.badge && (
                  <Badge className="bg-white/50 text-gray-800 border-white/50 text-xs backdrop-blur-xl font-medium drop-shadow-md">
                    {feature.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 drop-shadow-lg">
                {feature.title}
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed drop-shadow-md font-medium">
                {feature.description}
              </p>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* 主要功能區 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center sm:text-left drop-shadow-lg">主要功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* 管理功能區 - 只有管理員可見 */}
      {(isAdmin() || isManager()) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center sm:text-left drop-shadow-lg">管理功能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

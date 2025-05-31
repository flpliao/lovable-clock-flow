
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
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: '請假申請',
      description: '申請各類假期',
      icon: FileText,
      link: '/leave-request',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      badge: annualLeaveBalance > 0 ? `${annualLeaveBalance}小時` : null
    },
    {
      title: '排班管理',
      description: '查看工作排班',
      icon: Calendar,
      link: '/scheduling',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: '公司公告',
      description: '最新消息通知',
      icon: Bell,
      link: '/company-announcements',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  // 管理功能卡片
  const adminFeatures = [
    {
      title: '人員管理',
      description: '管理員工資料',
      icon: Users,
      link: '/personnel-management',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    },
    {
      title: '員工儀表板',
      description: '查看員工狀態',
      icon: BarChart3,
      link: '/staff-dashboard',
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
      badge: abnormalCount > 0 ? `${abnormalCount}異常` : null
    },
    {
      title: '系統設定',
      description: '系統參數設定',
      icon: Settings,
      link: '/system-settings',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    },
    {
      title: '分公司管理',
      description: '管理分公司資料',
      icon: MapPin,
      link: '/company-branch-management',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    }
  ];

  const FeatureCard = ({ feature }: { feature: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardContent className="p-0">
        <Link to={feature.link}>
          <div className={`${feature.color} ${feature.hoverColor} transition-colors duration-200 p-4 sm:p-5`}>
            <div className="flex items-center justify-between mb-3">
              <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              {feature.badge && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {feature.badge}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-white text-base sm:text-lg mb-1">
              {feature.title}
            </h3>
            <p className="text-white/80 text-sm">
              {feature.description}
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 主要功能區 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">主要功能</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* 管理功能區 - 只有管理員可見 */}
      {(isAdmin() || isManager()) && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">管理功能</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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

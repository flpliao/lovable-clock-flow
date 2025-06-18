
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  FileText, 
  Calendar,
  Bell
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
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: '請假申請',
      description: '申請各類假期',
      icon: FileText,
      link: '/leave-request',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: annualLeaveBalance > 0 ? `${annualLeaveBalance}小時` : null
    },
    {
      title: '排班管理',
      description: '查看工作排班',
      icon: Calendar,
      link: '/scheduling',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: '公司公告',
      description: '最新消息通知',
      icon: Bell,
      link: '/company-announcements',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const FeatureCard = ({ feature }: { feature: any }) => (
    <div className="group rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative w-full max-w-xs mx-auto">
      <Link to={feature.link} className="block">
        <div className="p-6 sm:p-8 relative overflow-hidden h-full bg-white/80 backdrop-blur-xl border border-white/40">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-3 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
              <div className={`p-3 ${feature.iconBg} rounded-2xl shadow-sm ${feature.iconColor} group-hover:shadow-md transition-all duration-300 ml-4`}>
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            </div>
            
            {feature.badge && (
              <div className="mt-auto">
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {feature.badge}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 px-4">
      {/* 主要功能區 */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">主要功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;

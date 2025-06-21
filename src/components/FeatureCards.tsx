import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Calendar, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
interface FeatureCardsProps {
  abnormalCount: number;
  annualLeaveBalance: number;
}
const FeatureCards = ({
  abnormalCount,
  annualLeaveBalance
}: FeatureCardsProps) => {
  const {
    isAdmin,
    isManager
  } = useUser();

  // 主要功能卡片
  const mainFeatures = [{
    title: '個人出勤',
    description: '查看出勤記錄',
    icon: Clock,
    link: '/personal-attendance',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  }, {
    title: '請假申請',
    description: '申請各類假期',
    icon: FileText,
    link: '/leave-request',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: annualLeaveBalance > 0 ? `${annualLeaveBalance}小時` : null
  }, {
    title: '排班管理',
    description: '查看工作排班',
    icon: Calendar,
    link: '/scheduling',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }, {
    title: '公司公告',
    description: '最新消息通知',
    icon: Bell,
    link: '/company-announcements',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }];
  const FeatureCard = ({
    feature
  }: {
    feature: any;
  }) => <div className="group rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative w-full">
      <Link to={feature.link} className="block">
        <div className="p-5 sm:p-6 relative overflow-hidden h-full bg-white/80 backdrop-blur-xl border border-white/40">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl mb-2 transition-colors duration-300 text-gray-600">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed font-medium text-gray-500">
                  {feature.description}
                </p>
              </div>
              <div className={`p-3 ${feature.iconBg} rounded-2xl shadow-sm ${feature.iconColor} group-hover:shadow-md transition-all duration-300 ml-3`}>
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            
            {feature.badge && <div className="mt-auto">
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {feature.badge}
                </Badge>
              </div>}
          </div>
        </div>
      </Link>
    </div>;
  return <div className="space-y-6">
      {/* 主要功能區 */}
      <div className="px-[20px] py-[40px]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-lg py-0">主要功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mainFeatures.map((feature, index) => <FeatureCard key={index} feature={feature} />)}
        </div>
      </div>
    </div>;
};
export default FeatureCards;
import { Bell, Calendar, Clock, FileText, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureCard, FeatureIcon } from './common/cards';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  iconBg: string;
  iconColor: string;
  badge?: string | null;
}

const FeatureCards = () => {
  // 主要功能卡片
  const mainFeatures: Feature[] = [
    {
      title: '個人出勤',
      description: '查看出勤記錄',
      icon: Clock,
      link: '/personal-attendance',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: '請假申請',
      description: '申請各類假期',
      icon: FileText,
      link: '/leave-request',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: '排班管理',
      description: '查看工作排班',
      icon: Calendar,
      link: '/scheduling',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: '公司公告',
      description: '最新消息通知',
      icon: Bell,
      link: '/company-announcements',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 主要功能區 */}
      <div className="px-[20px] py-[20px]">
        <h2 className="text-lg font-bold text-white mb-4 text-center drop-shadow-lg">主要功能</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {mainFeatures.map((feature, index) => (
            <Link key={index} to={feature.link} className="block">
              <FeatureCard
                title={feature.title}
                description={feature.description}
                rightContent={
                  <FeatureIcon
                    icon={<feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    iconBg={feature.iconBg}
                    iconColor={feature.iconColor}
                  />
                }
                isClickable={false}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;

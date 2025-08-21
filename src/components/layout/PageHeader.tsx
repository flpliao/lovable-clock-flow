import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor?: string;
}

const PageHeader = ({
  icon: Icon,
  title,
  description,
  iconBgColor = 'bg-blue-500',
}: PageHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white drop-shadow-md">{title}</h1>
        <p className="text-white/80 font-medium drop-shadow-sm">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;

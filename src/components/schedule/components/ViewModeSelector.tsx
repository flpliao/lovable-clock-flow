import { Button } from '@/components/ui/button';
import { Globe, User, Users } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: 'own' | 'subordinates' | 'all';
  onViewModeChange: (value: 'own' | 'subordinates' | 'all') => void;
  hasSubordinates: boolean;
}

const ViewModeSelector = ({
  viewMode,
  onViewModeChange,
  hasSubordinates,
}: ViewModeSelectorProps) => {
  const modes = [
    {
      value: 'own' as const,
      label: '我的排班',
      icon: User,
      color: 'green',
    },
    {
      value: 'subordinates' as const,
      label: '下屬排班',
      icon: Users,
      color: 'blue',
      disabled: !hasSubordinates,
    },
    {
      value: 'all' as const,
      label: '全部排班',
      icon: Globe,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {modes.map(({ value, label, icon: Icon, color, disabled }) => (
        <Button
          key={value}
          variant={viewMode === value ? 'default' : 'outline'}
          onClick={() => onViewModeChange(value)}
          disabled={disabled}
          className={`h-16 p-4 rounded-2xl border-2 transition-all duration-300 ${
            viewMode === value
              ? `bg-gradient-to-br from-${color}-500 to-${color}-600 text-white border-white/30 shadow-lg`
              : 'bg-white/70 text-gray-700 border-white/60 hover:bg-white/80 hover:border-white/80'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${viewMode === value ? 'bg-white/20' : 'bg-gray-100'}`}>
              <Icon className={`h-5 w-5 ${viewMode === value ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <span className="font-semibold text-base">{label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ViewModeSelector;

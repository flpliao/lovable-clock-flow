
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Users, Globe, Eye } from 'lucide-react';

type ScheduleViewType = 'my' | 'subordinates' | 'all';

interface ScheduleListHeaderProps {
  activeView: ScheduleViewType;
  onViewChange: (view: ScheduleViewType) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const ScheduleListHeader: React.FC<ScheduleListHeaderProps> = ({
  activeView,
  onViewChange,
  onRefresh,
  isLoading,
  isAdmin
}) => {
  const getViewIcon = (view: ScheduleViewType) => {
    switch (view) {
      case 'my': return <User className="h-4 w-4" />;
      case 'subordinates': return <Users className="h-4 w-4" />;
      case 'all': return <Globe className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="text-white font-medium drop-shadow-md flex items-center gap-2">
            <User className="h-4 w-4" />
            我的排班記錄
          </h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-xl"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '載入中...' : '重新載入'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <TabsList className="bg-white/20 backdrop-blur-xl border-white/30">
        <TabsTrigger value="my" className="flex items-center gap-2">
          {getViewIcon('my')}
          我的排班
        </TabsTrigger>
        <TabsTrigger value="subordinates" className="flex items-center gap-2">
          {getViewIcon('subordinates')}
          <Eye className="h-4 w-4" />
          下屬排班（快速查看）
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          {getViewIcon('all')}
          全部排班
        </TabsTrigger>
      </TabsList>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-xl"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? '載入中...' : '重新載入'}
      </Button>
    </div>
  );
};

export default ScheduleListHeader;

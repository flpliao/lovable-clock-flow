
import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HROvertimeHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold flex items-center">
        <Clock className="h-4 w-4 mr-2 text-purple-600" />
        加班管理
      </h2>
      <Button size="sm" className="text-xs">
        <Plus className="h-3 w-3 mr-1" />
        新增
      </Button>
    </div>
  );
};

export default HROvertimeHeader;

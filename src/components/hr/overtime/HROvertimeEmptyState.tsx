
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HROvertimeEmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-gray-500 text-sm">
          沒有找到相關的加班記錄
        </div>
      </CardContent>
    </Card>
  );
};

export default HROvertimeEmptyState;

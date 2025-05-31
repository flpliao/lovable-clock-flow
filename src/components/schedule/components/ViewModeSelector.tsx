
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: 'self' | 'subordinates' | 'all';
  onViewModeChange: (value: 'self' | 'subordinates' | 'all') => void;
  hasSubordinates: boolean;
}

const ViewModeSelector = ({ viewMode, onViewModeChange, hasSubordinates }: ViewModeSelectorProps) => {
  if (!hasSubordinates) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          查看範圍
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={viewMode} onValueChange={onViewModeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">僅自己的排班</SelectItem>
            <SelectItem value="subordinates">僅下屬的排班</SelectItem>
            <SelectItem value="all">自己和下屬的排班</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ViewModeSelector;

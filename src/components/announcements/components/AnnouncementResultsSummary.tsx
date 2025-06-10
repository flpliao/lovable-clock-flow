
import React from 'react';
import { Button } from '@/components/ui/button';

interface AnnouncementResultsSummaryProps {
  totalCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  loading: boolean;
}

const AnnouncementResultsSummary: React.FC<AnnouncementResultsSummaryProps> = ({
  totalCount,
  hasActiveFilters,
  clearFilters,
  loading
}) => {
  if (loading) return null;

  return (
    <div className="text-sm text-gray-700 font-medium px-1 drop-shadow-sm">
      共 {totalCount} 則公告
      {hasActiveFilters && (
        <Button 
          variant="link" 
          size="sm" 
          onClick={clearFilters}
          className="ml-2 h-auto p-0 text-sm text-blue-600 font-medium"
        >
          清除所有篩選
        </Button>
      )}
    </div>
  );
};

export default AnnouncementResultsSummary;

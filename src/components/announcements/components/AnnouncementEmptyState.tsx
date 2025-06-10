
import React from 'react';
import { Button } from '@/components/ui/button';
import { visionProStyles } from '@/utils/visionProStyles';

interface AnnouncementEmptyStateProps {
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const AnnouncementEmptyState: React.FC<AnnouncementEmptyStateProps> = ({
  hasActiveFilters,
  clearFilters
}) => {
  return (
    <div className={`text-center py-12 ${visionProStyles.featureCard}`}>
      <div className="text-base mb-2 text-gray-800 font-bold drop-shadow-sm">沒有找到符合條件的公告</div>
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="mt-4 bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-semibold hover:bg-white/80 shadow-md"
        >
          查看所有公告
        </Button>
      )}
    </div>
  );
};

export default AnnouncementEmptyState;

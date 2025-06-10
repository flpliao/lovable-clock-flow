
import React from 'react';
import { FileText, Search } from 'lucide-react';
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
    <div className={`${visionProStyles.liquidGlassCard} p-12 text-center border border-white/40 shadow-xl`}>
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className={visionProStyles.coloredIconContainer.gray}>
            {hasActiveFilters ? (
              <Search className="h-8 w-8" />
            ) : (
              <FileText className="h-8 w-8" />
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            {hasActiveFilters ? '沒有找到符合條件的公告' : '暫無公告'}
          </h3>
          <p className="text-gray-600 font-medium max-w-md mx-auto">
            {hasActiveFilters 
              ? '請嘗試調整搜尋條件或清除篩選器以查看更多結果'
              : '目前還沒有任何公司公告，請稍後再來查看'
            }
          </p>
        </div>
        
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            className={`${visionProStyles.glassButton} border-white/50 text-gray-800 hover:bg-white/50 shadow-lg px-6 py-3`}
          >
            清除所有篩選
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementEmptyState;

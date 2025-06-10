
import React from 'react';
import { FileText, Eye } from 'lucide-react';
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
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-teal-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-teal-400/50 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {hasActiveFilters ? '篩選結果' : '所有公告'}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              共找到 <span className="font-bold text-gray-800">{totalCount}</span> 則公告
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="backdrop-blur-xl bg-white/30 border-white/40 text-gray-800 hover:bg-white/50 shadow-md rounded-xl"
          >
            <Eye className="h-4 w-4 mr-2" />
            查看所有公告
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementResultsSummary;

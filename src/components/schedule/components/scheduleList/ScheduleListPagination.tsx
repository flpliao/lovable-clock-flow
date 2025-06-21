
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleListPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const ScheduleListPagination: React.FC<ScheduleListPaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  onPreviousPage,
  onNextPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white/80 font-medium drop-shadow-md">
        第 {currentPage} 頁，共 {totalPages} 頁 (總共 {totalRecords} 筆記錄)
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-white/80 text-sm font-medium px-3">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ScheduleListPagination;

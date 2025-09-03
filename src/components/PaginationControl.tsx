import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl = ({ currentPage, totalPages, onPageChange }: PaginationControlProps) => {
  // 生成頁數按鈕的邏輯
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 7; // 最多顯示7個頁數按鈕

    if (totalPages <= maxVisiblePages) {
      // 如果總頁數不超過最大顯示數量，顯示所有頁數
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 複雜的分頁邏輯
      if (currentPage <= 4) {
        // 當前頁在前4頁，顯示前5頁 + 省略號 + 最後一頁
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 當前頁在後4頁，顯示第一頁 + 省略號 + 後5頁
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 當前頁在中間，顯示第一頁 + 省略號 + 當前頁前後2頁 + 省略號 + 最後一頁
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="py-4">
      <Pagination>
        <PaginationContent>
          {/* 上一頁按鈕 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`${
                currentPage <= 1
                  ? 'opacity-50 pointer-events-none'
                  : 'bg-white/30 hover:bg-white/50 text-white border-white/40 hover:border-white/60'
              } backdrop-blur-sm border rounded-lg transition-all duration-200`}
            />
          </PaginationItem>

          {/* 頁數按鈕 */}
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis className="text-white/60 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2" />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className={`${
                    currentPage === page
                      ? 'bg-white/70 text-gray-900 border-white/80 shadow-lg'
                      : 'bg-white/30 text-white border-white/40 hover:bg-white/50 hover:border-white/60'
                  } backdrop-blur-sm border rounded-lg transition-all duration-200 font-medium`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* 下一頁按鈕 */}
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={`${
                currentPage >= totalPages
                  ? 'opacity-50 pointer-events-none'
                  : 'bg-white/30 hover:bg-white/50 text-white border-white/40 hover:border-white/60'
              } backdrop-blur-sm border rounded-lg transition-all duration-200`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControl;

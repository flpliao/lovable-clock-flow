
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationControlProps) => {
  return (
    <div className="py-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)} 
              className={`${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''} bg-transparent hover:bg-gray-800 text-white`}
            />
          </PaginationItem>
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)} 
              className={`${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''} bg-transparent hover:bg-gray-800 text-white`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControl;

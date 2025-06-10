
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AnnouncementSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  clearFilters: () => void;
}

const AnnouncementSearchSection: React.FC<AnnouncementSearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  clearFilters
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
        <Input
          placeholder="搜尋公告標題或內容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-medium placeholder:text-gray-600 shadow-md drop-shadow-sm"
        />
      </div>

      {/* Filter section */}
      <div className="flex gap-3">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1 h-12 text-base bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-semibold hover:bg-white/80 shadow-md drop-shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              篩選分類
              {selectedCategory !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full shadow-sm">
                  1
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[300px]">
            <SheetHeader>
              <SheetTitle>篩選公告</SheetTitle>
              <SheetDescription>
                選擇您想查看的公告分類
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分類</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={clearFilters} variant="outline" className="flex-1">
                  清除篩選
                </Button>
                <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                  確定
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop filter */}
        <div className="hidden sm:block flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12 text-base bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-medium shadow-md drop-shadow-sm">
              <SelectValue placeholder="選擇分類" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分類</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSearchSection;


import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnnouncementSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const AnnouncementSearchFilter: React.FC<AnnouncementSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 搜尋框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="搜尋公告標題或內容..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 backdrop-blur-xl bg-white/30 border-white/40 text-gray-800 placeholder:text-gray-600 font-medium shadow-lg h-12"
          />
        </div>
        
        {/* 分類篩選 */}
        <div className="w-full sm:w-48">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="backdrop-blur-xl bg-white/30 border-white/40 text-gray-800 font-medium shadow-lg h-12">
              <SelectValue placeholder="選擇分類" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-white/90 border-white/50">
              <SelectItem value="all">全部分類</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSearchFilter;

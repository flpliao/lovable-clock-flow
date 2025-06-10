
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { visionProStyles } from '@/utils/visionProStyles';

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
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'HR':
        return visionProStyles.coloredIconContainer.blue;
      case 'Administration':
        return visionProStyles.coloredIconContainer.orange;
      case 'Meeting':
        return visionProStyles.coloredIconContainer.green;
      case 'Official':
        return visionProStyles.coloredIconContainer.red;
      default:
        return visionProStyles.coloredIconContainer.gray;
    }
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className={`${visionProStyles.liquidGlassCard} p-6 space-y-6 border border-white/40 shadow-xl`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className={visionProStyles.iconContainer}>
            <Search className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        <Input
          type="text"
          placeholder="搜尋公告標題或內容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 pr-4 py-3 text-base bg-white/70 border-white/50 rounded-xl shadow-md backdrop-blur-xl focus:bg-white/80 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
        />
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-3">
            <div className={visionProStyles.coloredIconContainer.indigo}>
              <Filter className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-gray-800">篩選條件</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white/70 border-white/50 rounded-xl shadow-md backdrop-blur-xl hover:bg-white/80 transition-all duration-300">
              <SelectValue placeholder="選擇分類" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 border-white/50 rounded-xl shadow-xl backdrop-blur-xl">
              <SelectItem value="all" className="rounded-lg">所有分類</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="rounded-lg">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            {searchQuery && (
              <Badge className="bg-white/80 text-gray-800 border-white/50 rounded-full px-3 py-1 shadow-md backdrop-blur-xl">
                搜尋: {searchQuery}
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge className={`rounded-full px-3 py-1 shadow-md ${getCategoryColor(selectedCategory)}`}>
                {selectedCategory}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={`${visionProStyles.glassButton} border-white/40 text-gray-800 hover:bg-white/40 rounded-full px-3 py-1 text-xs`}
            >
              <X className="h-3 w-3 mr-1" />
              清除篩選
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementSearchSection;

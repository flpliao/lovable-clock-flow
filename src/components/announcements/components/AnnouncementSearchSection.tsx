
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
        return 'bg-blue-500/20 text-blue-700 border-blue-300/30';
      case 'Administration':
        return 'bg-orange-500/20 text-orange-700 border-orange-300/30';
      case 'Meeting':
        return 'bg-green-500/20 text-green-700 border-green-300/30';
      case 'Official':
        return 'bg-red-500/20 text-red-700 border-red-300/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300/30';
    }
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className="p-2 bg-white/40 rounded-lg backdrop-blur-xl">
            <Search className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        <Input
          type="text"
          placeholder="搜尋公告標題或內容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-16 pr-4 py-3 text-base bg-white/30 border-white/40 rounded-2xl shadow-md backdrop-blur-xl focus:bg-white/40 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
        />
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/80 rounded-lg shadow-lg backdrop-blur-xl border border-indigo-400/50 text-white">
              <Filter className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-gray-800">篩選條件</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white/30 border-white/40 rounded-2xl shadow-md backdrop-blur-xl hover:bg-white/40 transition-all duration-300">
              <SelectValue placeholder="選擇分類" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 border-white/50 rounded-2xl shadow-xl backdrop-blur-xl">
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
              <Badge className="bg-white/40 text-gray-800 border-white/40 rounded-full px-3 py-1 shadow-md backdrop-blur-xl">
                搜尋: {searchQuery}
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge className={`rounded-full px-3 py-1 shadow-md backdrop-blur-xl ${getCategoryColor(selectedCategory)}`}>
                {selectedCategory}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="backdrop-blur-xl bg-white/30 border-white/40 text-gray-800 hover:bg-white/50 rounded-full px-3 py-1 text-xs"
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

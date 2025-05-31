
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { usePositionManagementContext } from './PositionManagementContext';

const PositionFilters = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    sortBy, 
    setSortBy, 
    sortOrder, 
    setSortOrder 
  } = usePositionManagementContext();

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-3 w-3" />;
    } else {
      return <ArrowDown className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-3">
      {/* 搜尋框 */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
        <Input
          placeholder="搜尋職位名稱或說明..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-7 h-7 text-xs"
        />
      </div>
      
      {/* 排序選擇 */}
      <div className="flex gap-1">
        <Select value={sortBy} onValueChange={(value: 'name' | 'level') => setSortBy(value)}>
          <SelectTrigger className="w-auto h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">按名稱</SelectItem>
            <SelectItem value="level">按職級</SelectItem>
          </SelectContent>
        </Select>
        
        {/* 排序方向 */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleSortOrder}
          className="h-7 px-2"
        >
          {getSortIcon()}
        </Button>
      </div>
    </div>
  );
};

export default PositionFilters;

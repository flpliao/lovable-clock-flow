import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { usePositionManagementContext } from './PositionManagementContext';

const PositionFilters = () => {
  const { searchTerm, setSearchTerm, sortOrder, setSortOrder } = usePositionManagementContext();

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else {
      return <ArrowDown className="h-4 w-4" />;
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 搜尋框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜尋職位名稱或說明..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/60 border-white/40 text-gray-900 placeholder:text-gray-600 focus:bg-white/70 focus:border-white/60"
          />
        </div>

        {/* 排序控制 */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-700 font-medium">按名稱</span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="px-3 bg-white/60 border-white/40 text-gray-900 hover:bg-white/70"
          >
            {getSortIcon()}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PositionFilters;

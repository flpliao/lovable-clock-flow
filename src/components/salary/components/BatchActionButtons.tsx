import { Button } from '@/components/ui/button';
import { Salary, SalaryStatus } from '@/types/salary';
import { CheckSquare, Square } from 'lucide-react';
import React from 'react';

interface BatchActionButtonsProps {
  isBatchMode: boolean;
  selectedSalaries: Set<string>;
  salaries: Salary[];
  onToggleSelectAll: () => void;
  onBatchPublish: () => void;
  onToggleBatchMode: () => void;
}

const BatchActionButtons: React.FC<BatchActionButtonsProps> = ({
  isBatchMode,
  selectedSalaries,
  salaries,
  onToggleSelectAll,
  onBatchPublish,
  onToggleBatchMode,
}) => {
  if (!isBatchMode) {
    return null;
  }

  const draftSalariesCount = salaries.filter(s => s.status === SalaryStatus.DRAFT).length;
  const isAllSelected = selectedSalaries.size === draftSalariesCount;

  return (
    <>
      <Button
        size="sm"
        onClick={onToggleSelectAll}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isAllSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        全選草稿
      </Button>
      <Button
        size="sm"
        onClick={onBatchPublish}
        disabled={selectedSalaries.size === 0}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium"
      >
        發布選中 ({selectedSalaries.size})
      </Button>
      <Button
        size="sm"
        onClick={onToggleBatchMode}
        variant="outline"
        className="bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600 hover:text-white"
      >
        取消
      </Button>
    </>
  );
};

export default BatchActionButtons;

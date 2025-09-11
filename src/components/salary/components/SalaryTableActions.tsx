import DeleteButton from '@/components/common/buttons/DeleteButton';
import { Button } from '@/components/ui/button';
import { Salary } from '@/types/salary';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

interface SalaryTableActionsProps {
  salary: Salary;
  onEdit: (salary: Salary) => void;
  onDelete: (slug: string) => void;
  disabled?: boolean;
}

const SalaryTableActions: React.FC<SalaryTableActionsProps> = ({
  salary,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(salary)} disabled={disabled}>
        <Edit className="h-4 w-4" />
      </Button>

      <DeleteButton
        size="sm"
        className="text-red-600"
        onClick={() => onDelete(salary.slug)}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </DeleteButton>
    </div>
  );
};

export default SalaryTableActions;


import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartmentFilterProps {
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  departments: string[];
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({ 
  departmentFilter, 
  setDepartmentFilter, 
  departments 
}) => {
  return (
    <Select 
      value={departmentFilter} 
      onValueChange={setDepartmentFilter}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選擇部門" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">全部部門</SelectItem>
        {departments.map(dept => (
          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DepartmentFilter;

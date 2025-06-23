
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { Department } from '@/components/departments/types';

interface DepartmentLocationSelectorProps {
  departments: Department[];
  selectedDepartmentId: string | null;
  onDepartmentChange: (departmentId: string | null) => void;
}

const DepartmentLocationSelector: React.FC<DepartmentLocationSelectorProps> = ({
  departments,
  selectedDepartmentId,
  onDepartmentChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-white/90 text-sm">
        <Building2 className="h-4 w-4" />
        <span>選擇打卡位置:</span>
      </div>
      <Select 
        value={selectedDepartmentId || "headquarters"} 
        onValueChange={(value) => onDepartmentChange(value === "headquarters" ? null : value)}
      >
        <SelectTrigger className="bg-white/20 border-white/30 text-white">
          <SelectValue placeholder="選擇部門位置" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 max-h-60 overflow-y-auto">
          <SelectItem value="headquarters">總公司</SelectItem>
          {departments
            .filter(dept => dept.gps_status === 'converted' && dept.latitude && dept.longitude)
            .map(dept => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DepartmentLocationSelector;

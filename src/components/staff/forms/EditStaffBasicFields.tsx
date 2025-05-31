
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '../types';
import { departments } from '../StaffConstants';
import { usePositions } from '../hooks/usePositions';

interface EditStaffBasicFieldsProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
}

export const EditStaffBasicFields: React.FC<EditStaffBasicFieldsProps> = ({
  currentStaff,
  setCurrentStaff
}) => {
  const { getPositionNames } = usePositions();
  const positions = getPositionNames();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          姓名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={currentStaff.name || ''}
          onChange={(e) => setCurrentStaff({...currentStaff, name: e.target.value})}
          className="col-span-3"
          placeholder="請輸入姓名"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="position" className="text-right">
          職位 <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={currentStaff.position || ''} 
          onValueChange={(value) => setCurrentStaff({...currentStaff, position: value})}
        >
          <SelectTrigger className="col-span-3" id="position">
            <SelectValue placeholder="選擇職位" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">
          部門 <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={currentStaff.department || ''} 
          onValueChange={(value) => setCurrentStaff({...currentStaff, department: value})}
        >
          <SelectTrigger className="col-span-3" id="department">
            <SelectValue placeholder="選擇部門" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contact" className="text-right">
          聯絡電話 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact"
          value={currentStaff.contact || ''}
          onChange={(e) => setCurrentStaff({...currentStaff, contact: e.target.value})}
          className="col-span-3"
          placeholder="請輸入聯絡電話"
        />
      </div>
    </>
  );
};

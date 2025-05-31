
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewStaff } from '../types';
import { departments } from '../StaffConstants';
import { usePositions } from '../hooks/usePositions';

interface StaffBasicFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffBasicFields: React.FC<StaffBasicFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { getPositionNames } = usePositions();
  const positions = getPositionNames();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="name" className="text-right text-xs">
          姓名
        </Label>
        <Input
          id="name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
          className="col-span-3 h-8 text-xs"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="position" className="text-right text-xs">
          職位
        </Label>
        <Select 
          value={newStaff.position} 
          onValueChange={(value) => setNewStaff({...newStaff, position: value})}
        >
          <SelectTrigger className="col-span-3 h-8 text-xs" id="position">
            <SelectValue placeholder="選擇職位" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((position) => (
              <SelectItem key={position} value={position} className="text-xs">
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="department" className="text-right text-xs">
          部門
        </Label>
        <Select 
          value={newStaff.department} 
          onValueChange={(value) => setNewStaff({...newStaff, department: value})}
        >
          <SelectTrigger className="col-span-3 h-8 text-xs" id="department">
            <SelectValue placeholder="選擇部門" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department} value={department} className="text-xs">
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="contact" className="text-right text-xs">
          電話
        </Label>
        <Input
          id="contact"
          value={newStaff.contact}
          onChange={(e) => setNewStaff({...newStaff, contact: e.target.value})}
          className="col-span-3 h-8 text-xs"
        />
      </div>
    </>
  );
};

export default StaffBasicFields;

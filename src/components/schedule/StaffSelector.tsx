
import React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

interface StaffSelectorProps {
  control: Control<any>;
}

const StaffSelector = ({ control }: StaffSelectorProps) => {
  const { staffList } = useStaffManagementContext();

  return (
    <FormField
      control={control}
      name="userId"
      rules={{ required: '請選擇員工' }}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-12 text-sm border-2 border-white/30 rounded-xl bg-white/20 text-white backdrop-blur-xl">
                <SelectValue placeholder="請選擇要排班的員工" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                {staffList.map((staffMember) => (
                  <SelectItem 
                    key={staffMember.id} 
                    value={staffMember.id}
                    className="py-3 px-4 text-sm hover:bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{staffMember.name}</span>
                      <span className="text-xs text-gray-500">{staffMember.position}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StaffSelector;

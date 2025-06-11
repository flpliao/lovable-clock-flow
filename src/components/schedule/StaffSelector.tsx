
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
              <SelectTrigger className="h-14 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder:text-white/70">
                <SelectValue placeholder="請選擇要排班的員工" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-2xl shadow-xl z-50">
                {staffList.map((staffMember) => (
                  <SelectItem 
                    key={staffMember.id} 
                    value={staffMember.id}
                    className="py-4 px-6 text-lg hover:bg-gray-50 rounded-xl text-black"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-black">{staffMember.name}</span>
                      <span className="text-sm text-gray-500">{staffMember.position}</span>
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

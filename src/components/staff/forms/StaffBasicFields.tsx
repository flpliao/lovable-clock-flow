
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NewStaff } from '../types';

interface StaffBasicFieldsProps {
  form?: UseFormReturn<any>;
  newStaff?: NewStaff;
  setNewStaff?: (staff: NewStaff) => void;
}

export function StaffBasicFields({ form, newStaff, setNewStaff }: StaffBasicFieldsProps) {
  // 如果有 form 就使用 form 模式，否則使用 newStaff 模式
  if (form) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>員工姓名 *</FormLabel>
              <FormControl>
                <Input placeholder="請輸入員工姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>職位 *</FormLabel>
              <FormControl>
                <Input placeholder="請輸入職位" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯絡電話 *</FormLabel>
              <FormControl>
                <Input placeholder="請輸入聯絡電話" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hire_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>入職日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy年MM月dd日")
                      ) : (
                        <span>請選擇入職日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  // 舊版本兼容模式
  if (!newStaff || !setNewStaff) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">姓名 *</label>
        <Input
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          placeholder="請輸入姓名"
          className="h-8 text-xs"
        />
      </div>
      <div>
        <label className="text-xs font-medium">職位 *</label>
        <Input
          value={newStaff.position}
          onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
          placeholder="請輸入職位"
          className="h-8 text-xs"
        />
      </div>
      <div className="col-span-2">
        <label className="text-xs font-medium">聯絡電話 *</label>
        <Input
          value={newStaff.contact}
          onChange={(e) => setNewStaff({ ...newStaff, contact: e.target.value })}
          placeholder="請輸入聯絡電話"
          className="h-8 text-xs"
        />
      </div>
      <div className="col-span-2">
        <label className="text-xs font-medium">入職日期</label>
        <Input
          type="date"
          value={newStaff.hire_date || ''}
          onChange={(e) => setNewStaff({ ...newStaff, hire_date: e.target.value })}
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}

// 為了向後兼容，也提供默認導出
export default StaffBasicFields;

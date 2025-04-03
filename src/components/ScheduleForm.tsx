
import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// 模擬的用戶數據
const mockUsers = [
  { id: '1', name: '王小明', position: '主管', department: '人資部' },
  { id: '2', name: '李小華', position: '工程師', department: '技術部' },
  { id: '3', name: '張小美', position: '設計師', department: '設計部' },
];

type FormValues = {
  userId: string;
  workDate: Date;
  startTime: string;
  endTime: string;
};

const ScheduleForm = () => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      userId: '',
      startTime: '09:00',
      endTime: '18:00',
    },
  });

  const onSubmit = (data: FormValues) => {
    // 在真實情況下，您會將這些數據發送到伺服器
    console.log('排班數據：', {
      ...data,
      workDate: data.workDate ? format(data.workDate, 'yyyy-MM-dd') : '',
    });
    
    toast({
      title: "排班成功",
      description: `已為 ${getUserName(data.userId)} 在 ${format(data.workDate, 'yyyy年MM月dd日', { locale: zhTW })} 安排班次。`,
    });
    
    form.reset();
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>創建新排班</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>選擇員工</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇員工" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>工作日期</FormLabel>
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
                            format(field.value, 'PPP', { locale: zhTW })
                          ) : (
                            <span>選擇日期</span>
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
                        locale={zhTW}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始時間</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>結束時間</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              提交排班
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;

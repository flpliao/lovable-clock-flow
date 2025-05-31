
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { timeSlotService, TimeSlot, CreateTimeSlot } from '@/services/timeSlotService';
import AddTimeSlotDialog from './timeslot/AddTimeSlotDialog';
import EditTimeSlotDialog from './timeslot/EditTimeSlotDialog';

const TimeSlotManagement = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const { toast } = useToast();
  const { currentUser } = useUser();

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await timeSlotService.getAllTimeSlots();
      setTimeSlots(data);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      toast({
        title: "載入失敗",
        description: error instanceof Error ? error.message : "載入時間段失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (timeSlotData: Omit<CreateTimeSlot, 'created_by'>) => {
    if (!currentUser) return;

    try {
      const createData: CreateTimeSlot = {
        ...timeSlotData,
        created_by: currentUser.id,
      };
      await timeSlotService.createTimeSlot(createData);
      toast({
        title: "新增成功",
        description: "時間段已成功新增",
      });
      loadTimeSlots();
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to add time slot:', error);
      toast({
        title: "新增失敗",
        description: error instanceof Error ? error.message : "新增時間段失敗",
        variant: "destructive",
      });
    }
  };

  const handleEditTimeSlot = async (id: string, updates: Partial<CreateTimeSlot>) => {
    try {
      await timeSlotService.updateTimeSlot(id, updates);
      toast({
        title: "更新成功",
        description: "時間段已成功更新",
      });
      loadTimeSlots();
      setEditingTimeSlot(null);
    } catch (error) {
      console.error('Failed to update time slot:', error);
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "更新時間段失敗",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (!confirm('確定要刪除這個時間段嗎？')) return;

    try {
      await timeSlotService.deleteTimeSlot(id);
      toast({
        title: "刪除成功",
        description: "時間段已成功刪除",
      });
      loadTimeSlots();
    } catch (error) {
      console.error('Failed to delete time slot:', error);
      toast({
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "刪除時間段失敗",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            時間段管理
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增時間段
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">載入中...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名稱</TableHead>
                <TableHead>開始時間</TableHead>
                <TableHead>結束時間</TableHead>
                <TableHead>需要打卡</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>排序</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow key={timeSlot.id}>
                  <TableCell className="font-medium">{timeSlot.name}</TableCell>
                  <TableCell>{timeSlot.start_time}</TableCell>
                  <TableCell>{timeSlot.end_time}</TableCell>
                  <TableCell>
                    <Badge variant={timeSlot.requires_checkin ? 'default' : 'secondary'}>
                      {timeSlot.requires_checkin ? '需要' : '不需要'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={timeSlot.is_active ? 'default' : 'destructive'}>
                      {timeSlot.is_active ? '啟用' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell>{timeSlot.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTimeSlot(timeSlot)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <AddTimeSlotDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddTimeSlot}
        />

        {editingTimeSlot && (
          <EditTimeSlotDialog
            open={!!editingTimeSlot}
            onOpenChange={(open) => !open && setEditingTimeSlot(null)}
            timeSlot={editingTimeSlot}
            onSubmit={(updates) => handleEditTimeSlot(editingTimeSlot.id, updates)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotManagement;


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TimeSlot } from '@/services/timeSlotService';
import { useTimeSlotOperations } from './timeslot/hooks/useTimeSlotOperations';
import TimeSlotHeader from './timeslot/TimeSlotHeader';
import TimeSlotTable from './timeslot/TimeSlotTable';
import AddTimeSlotDialog from './timeslot/AddTimeSlotDialog';
import EditTimeSlotDialog from './timeslot/EditTimeSlotDialog';

const TimeSlotManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  
  const {
    timeSlots,
    loading,
    handleAddTimeSlot,
    handleEditTimeSlot,
    handleDeleteTimeSlot,
  } = useTimeSlotOperations();

  const onAddTimeSlot = async (timeSlotData: any) => {
    await handleAddTimeSlot(timeSlotData);
    setShowAddDialog(false);
  };

  const onEditTimeSlot = async (updates: any) => {
    if (editingTimeSlot) {
      await handleEditTimeSlot(editingTimeSlot.id, updates);
      setEditingTimeSlot(null);
    }
  };

  return (
    <Card>
      <TimeSlotHeader onAddTimeSlot={() => setShowAddDialog(true)} />
      
      <CardContent>
        <TimeSlotTable
          timeSlots={timeSlots}
          loading={loading}
          onEdit={setEditingTimeSlot}
          onDelete={handleDeleteTimeSlot}
        />

        <AddTimeSlotDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={onAddTimeSlot}
        />

        {editingTimeSlot && (
          <EditTimeSlotDialog
            open={!!editingTimeSlot}
            onOpenChange={(open) => !open && setEditingTimeSlot(null)}
            timeSlot={editingTimeSlot}
            onSubmit={onEditTimeSlot}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotManagement;

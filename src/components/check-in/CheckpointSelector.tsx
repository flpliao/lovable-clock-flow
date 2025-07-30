import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCheckInPoints } from '@/hooks/useCheckInPoints';
import { MapPin } from 'lucide-react';
import React, { useEffect } from 'react';

interface CheckpointSelectorProps {
  selectedCheckpointId: string | null;
  onCheckpointChange: (checkpointId: string | null) => void;
}

const CheckpointSelector: React.FC<CheckpointSelectorProps> = ({
  selectedCheckpointId,
  onCheckpointChange,
}) => {
  const { data: checkInPoints, loadCheckInPoints, isLoading } = useCheckInPoints();

  useEffect(() => {
    loadCheckInPoints();
  }, []);

  // 預設選擇第一個 checkpoint
  useEffect(() => {
    if (selectedCheckpointId === null && checkInPoints && checkInPoints.length > 0) {
      onCheckpointChange(checkInPoints[0].id);
    }
    // 只在 checkpoints 載入或 selectedCheckpointId 變動時觸發
  }, [selectedCheckpointId, checkInPoints, onCheckpointChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-white/90 text-sm">
        <MapPin className="h-4 w-4" />
        <span>選擇打卡點:</span>
      </div>
      <Select
        value={
          selectedCheckpointId !== null
            ? String(selectedCheckpointId)
            : checkInPoints[0]
              ? String(checkInPoints[0].id)
              : 'none'
        }
        onValueChange={value => onCheckpointChange(value === 'none' ? null : value)}
        disabled={isLoading}
      >
        <SelectTrigger className="bg-white/20 border-white/30 text-white">
          <SelectValue placeholder="選擇打卡點" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 max-h-60 overflow-y-auto">
          {checkInPoints
            .filter(cp => !cp.disabled_at && cp.latitude && cp.longitude)
            .map(cp => (
              <SelectItem key={cp.id} value={String(cp.id)}>
                {cp.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CheckpointSelector;

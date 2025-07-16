import { useCheckpoints } from '@/components/company/components/useCheckpoints';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import React, { useEffect } from 'react';

interface CheckpointSelectorProps {
  selectedCheckpointId: number | null;
  onCheckpointChange: (checkpointId: number | null) => void;
}

const CheckpointSelector: React.FC<CheckpointSelectorProps> = ({
  selectedCheckpointId,
  onCheckpointChange,
}) => {
  const { data: checkpoints, loadCheckpoints, loading } = useCheckpoints();

  useEffect(() => {
    loadCheckpoints();
  }, []);

  // 預設選擇第一個 checkpoint
  useEffect(() => {
    if (selectedCheckpointId === null && checkpoints && checkpoints.length > 0) {
      onCheckpointChange(checkpoints[0].id);
    }
    // 只在 checkpoints 載入或 selectedCheckpointId 變動時觸發
  }, [selectedCheckpointId, checkpoints, onCheckpointChange]);

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
            : checkpoints[0]
              ? String(checkpoints[0].id)
              : 'none'
        }
        onValueChange={value => onCheckpointChange(value === 'none' ? null : Number(value))}
        disabled={loading}
      >
        <SelectTrigger className="bg-white/20 border-white/30 text-white">
          <SelectValue placeholder="選擇打卡點" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 max-h-60 overflow-y-auto">
          {checkpoints
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

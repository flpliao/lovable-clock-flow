import { CheckpointService, type Checkpoint } from '@/services/checkpointService';
import { useCheckpointStore } from '@/stores/checkpointStore';
import { useState } from 'react';

// 重新導出 Checkpoint 介面，保持向後相容性
export type { Checkpoint } from '@/services/checkpointService';

export function useCheckpoints() {
  const [loading, setLoading] = useState(false);
  const {
    checkpoints: data,
    setCheckpoints,
    addCheckpoint: addToStore,
    updateCheckpoint: updateInStore,
    removeCheckpoint: removeFromStore,
  } = useCheckpointStore();

  const loadCheckpoints = async () => {
    if (data.length > 0) return;

    setLoading(true);
    try {
      const checkpoints = await CheckpointService.loadCheckpoints();
      setCheckpoints(checkpoints);
    } catch (error) {
      console.error('載入打卡點失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCheckpoint = async (checkpoint: Omit<Checkpoint, 'id' | 'created_at'>) => {
    try {
      const newCheckpoints = await CheckpointService.addCheckpoint(checkpoint);
      addToStore(newCheckpoints[0]);
    } catch (error) {
      console.error('新增打卡點失敗:', error);
      throw error;
    }
  };

  const updateCheckpoint = async (id: number, checkpoint: Partial<Checkpoint>) => {
    try {
      const updatedCheckpoints = await CheckpointService.updateCheckpoint(id, checkpoint);
      updateInStore(id, updatedCheckpoints[0]);
    } catch (error) {
      console.error('更新打卡點失敗:', error);
      throw error;
    }
  };

  const deleteCheckpoint = async (id: number) => {
    try {
      await CheckpointService.deleteCheckpoint(id);
      removeFromStore(id);
    } catch (error) {
      console.error('刪除打卡點失敗:', error);
      throw error;
    }
  };

  return {
    data,
    loading,
    loadCheckpoints: loadCheckpoints,
    addCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
  };
}

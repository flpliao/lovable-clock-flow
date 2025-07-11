import { Checkpoint, deleteCheckpoint } from './useCheckpoints';
import { Button } from '@/components/ui/button';
import { MapPin, Edit, Trash2, Clock } from 'lucide-react';

interface Props {
  data: Checkpoint[];
  loading: boolean;
  refresh: () => void;
  onEdit?: (checkpoint: Checkpoint) => void;
}

const CheckpointTable = ({ data, loading, refresh, onEdit }: Props) => {
  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除此打卡點嗎？')) return;
    try {
      await deleteCheckpoint(id);
      refresh();
    } catch {
      alert('刪除失敗');
    }
  };

  if (loading) return <div className="text-white">載入中...</div>;

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 mx-auto text-white/50 mb-4" />
        <p className="text-white/70">尚未建立打卡點</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                名稱
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">緯度</th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">經度</th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                建立時間
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">狀態</th>
            <th className="text-right py-3 px-4 text-white/80 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map(cp => (
            <tr
              key={cp.id}
              className="border-b border-white/10 hover:bg-white/10 transition-colors"
            >
              <td className="py-3 px-4 text-white font-medium">{cp.name}</td>
              <td className="py-3 px-4 text-white/80">{cp.latitude}</td>
              <td className="py-3 px-4 text-white/80">{cp.longitude}</td>
              <td className="py-3 px-4 text-white/80">
                {cp.created_at ? new Date(cp.created_at).toLocaleString() : '-'}
              </td>
              <td className="py-3 px-4 text-white/80">
                {cp.disabled_at ? (
                  <span className="text-red-400 font-semibold">停用</span>
                ) : (
                  <span className="text-green-400 font-semibold">啟用</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg"
                    onClick={() => onEdit?.(cp)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg"
                    onClick={() => handleDelete(cp.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckpointTable;

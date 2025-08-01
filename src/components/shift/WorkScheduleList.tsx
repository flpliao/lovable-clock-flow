import { Button } from '@/components/ui/button';
import { WorkSchedule, WorkScheduleStatus } from '@/types/workSchedule';
import { Clock, Edit, Plus, Trash2 } from 'lucide-react';

interface WorkScheduleListProps {
  workSchedules: WorkSchedule[];
  onAddWorkSchedule?: () => void;
  onEditWorkSchedule?: (workSchedule: WorkSchedule) => void;
  onDeleteWorkSchedule?: (slug: string) => void;
}

const WorkScheduleList = ({
  workSchedules,
  onAddWorkSchedule,
  onEditWorkSchedule,
  onDeleteWorkSchedule,
}: WorkScheduleListProps) => {
  const getStatusDisplay = (status: WorkScheduleStatus) => {
    switch (status) {
      case WorkScheduleStatus.WORK:
        return { text: '上班日', className: 'bg-blue-500/20 text-blue-700' };
      case WorkScheduleStatus.OFF:
        return { text: '休息日', className: 'bg-gray-500/20 text-gray-700' };
      default:
        return { text: '未知', className: 'bg-gray-500/20 text-gray-700' };
    }
  };

  return (
    <div className="md:ml-12 bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">工作時程 ({workSchedules.length})</h4>
        {onAddWorkSchedule && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddWorkSchedule}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Plus className="h-3 w-3 mr-1" />
            新增工作時程
          </Button>
        )}
      </div>

      {workSchedules.length > 0 ? (
        <>
          {/* 桌面版表格 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-3 py-2 text-left text-white/80 text-xs font-medium">順序</th>
                  <th className="px-3 py-2 text-left text-white/80 text-xs font-medium">狀態</th>
                  <th className="px-3 py-2 text-left text-white/80 text-xs font-medium">
                    上班時間
                  </th>
                  <th className="px-3 py-2 text-left text-white/80 text-xs font-medium">
                    下班時間
                  </th>
                  <th className="px-3 py-2 text-left text-white/80 text-xs font-medium">
                    加班開始
                  </th>
                  {(onEditWorkSchedule || onDeleteWorkSchedule) && (
                    <th className="px-3 py-2 text-left text-white/80 text-xs font-medium">操作</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {workSchedules.map((workSchedule, index) => {
                  const statusDisplay = getStatusDisplay(workSchedule.status);
                  return (
                    <tr key={workSchedule.slug} className="hover:bg-white/5">
                      <td className="px-3 py-2 text-white text-sm">{index + 1}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${statusDisplay.className}`}
                        >
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-white text-sm">{workSchedule.clock_in_time}</td>
                      <td className="px-3 py-2 text-white text-sm">
                        {workSchedule.clock_out_time}
                      </td>
                      <td className="px-3 py-2 text-white text-sm">
                        {workSchedule.ot_start_after_hours}:
                        {workSchedule.ot_start_after_minutes.toString().padStart(2, '0')}
                      </td>
                      {(onEditWorkSchedule || onDeleteWorkSchedule) && (
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            {onEditWorkSchedule && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditWorkSchedule(workSchedule)}
                                className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {onDeleteWorkSchedule && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteWorkSchedule(workSchedule.slug)}
                                className="h-6 w-6 p-0 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 手機版卡片 */}
          <div className="md:hidden space-y-3">
            {workSchedules.map((workSchedule, index) => {
              const statusDisplay = getStatusDisplay(workSchedule.status);
              return (
                <div
                  key={workSchedule.slug}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-xs">#{index + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${statusDisplay.className}`}>
                        {statusDisplay.text}
                      </span>
                    </div>
                    {(onEditWorkSchedule || onDeleteWorkSchedule) && (
                      <div className="flex gap-1">
                        {onEditWorkSchedule && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditWorkSchedule(workSchedule)}
                            className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {onDeleteWorkSchedule && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteWorkSchedule(workSchedule.slug)}
                            className="h-6 w-6 p-0 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-white/60">上班時間：</span>
                      <span className="text-white">{workSchedule.clock_in_time}</span>
                    </div>
                    <div>
                      <span className="text-white/60">下班時間：</span>
                      <span className="text-white">{workSchedule.clock_out_time}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white/60">加班開始：</span>
                      <span className="text-white">
                        {workSchedule.ot_start_after_hours}:
                        {workSchedule.ot_start_after_minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-white/60">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">尚無工作時程設定</p>
          <p className="text-xs">請新增工作時程</p>
        </div>
      )}
    </div>
  );
};

export default WorkScheduleList;

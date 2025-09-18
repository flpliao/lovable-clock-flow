import { EmptyState } from '@/components/common/EmptyState';
import DeleteButton from '@/components/common/buttons/DeleteButton';
import EditButton from '@/components/common/buttons/EditButton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaidType } from '@/constants/leave';
import type { LeaveType } from '@/types/leaveType';
import { Edit, Trash2 } from 'lucide-react';

interface LeaveTypeTableProps {
  leaveTypes: LeaveType[];
  onEdit: (leaveType: LeaveType) => void;
  onDelete: (leaveType: LeaveType) => void;
}

export function LeaveTypeTable({ leaveTypes, onEdit, onDelete }: LeaveTypeTableProps) {
  return (
    <>
      {/* 添加水平滾動容器 */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow className="border-white/30 hover:bg-white/20 transition-colors">
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">
                  名稱
                </TableHead>
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                  最大天數
                </TableHead>
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[80px] whitespace-nowrap">
                  是否給薪
                </TableHead>
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                  年度重置
                </TableHead>
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                  需要附件
                </TableHead>
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">
                  啟用狀態
                </TableHead>
                <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveTypes.map(leaveType => (
                <TableRow
                  key={leaveType.slug}
                  className="border-white/30 hover:bg-white/40 transition-all duration-200"
                >
                  <TableCell className="font-semibold text-slate-800 py-3 px-4 whitespace-nowrap">
                    <span className="truncate block max-w-[120px]" title={leaveType.name}>
                      {leaveType.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-800 font-medium py-3 px-4 whitespace-nowrap">
                    {leaveType.max_per_year ? `${leaveType.max_per_year}天` : '無限制'}
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge
                      className={
                        leaveType.paid_type === PaidType.PAID
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium px-2 py-1 rounded-lg'
                          : leaveType.paid_type === PaidType.HALF
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 font-medium px-2 py-1 rounded-lg'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2 py-1 rounded-lg'
                      }
                    >
                      {leaveType.paid_type === PaidType.PAID
                        ? '有薪'
                        : leaveType.paid_type === PaidType.HALF
                          ? '半薪'
                          : '無薪'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={
                        leaveType.annual_reset
                          ? 'border-blue-300 text-blue-800 bg-blue-50 font-medium px-2 py-1 rounded-lg'
                          : 'border-slate-300 text-slate-700 bg-slate-50 font-medium px-2 py-1 rounded-lg'
                      }
                    >
                      {leaveType.annual_reset ? '是' : '否'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={
                        leaveType.requires_attachment
                          ? 'border-blue-300 text-blue-800 bg-blue-50 font-medium px-2 py-1 rounded-lg'
                          : 'border-slate-300 text-slate-700 bg-slate-50 font-medium px-2 py-1 rounded-lg'
                      }
                    >
                      {leaveType.requires_attachment ? '是' : '否'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={
                        leaveType.is_active
                          ? 'border-blue-300 text-blue-800 bg-blue-50 font-medium px-2 py-1 rounded-lg'
                          : 'border-slate-300 text-slate-700 bg-slate-50 font-medium px-2 py-1 rounded-lg'
                      }
                    >
                      {leaveType.is_active ? '啟用' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 flex-nowrap">
                      <EditButton
                        size="sm"
                        onClick={() => onEdit(leaveType)}
                        className="hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 flex-shrink-0 bg-transparent hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4" />
                      </EditButton>
                      <DeleteButton
                        size="sm"
                        onClick={() => onDelete(leaveType)}
                        className="hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-transparent hover:border-red-200 transition-all duration-200 flex-shrink-0 bg-transparent hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </DeleteButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <EmptyState data={leaveTypes} message="沒有找到相關的假別記錄" />
    </>
  );
}

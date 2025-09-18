import DeleteButton from '@/components/common/buttons/DeleteButton';
import EditButton from '@/components/common/buttons/EditButton';
import { EmptyState } from '@/components/common/EmptyState';
import { PropertyBadge } from '@/components/common/PropertyBadge';
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
  // 輔助函數：根據薪資類型獲取狀態和文字
  const getPaidTypeInfo = (paidType: PaidType) => {
    switch (paidType) {
      case PaidType.PAID:
        return { status: 'success' as const, text: '有薪' };
      case PaidType.HALF:
        return { status: 'warning' as const, text: '半薪' };
      default:
        return { status: 'neutral' as const, text: '無薪' };
    }
  };
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
                    {(() => {
                      const { status, text } = getPaidTypeInfo(leaveType.paid_type);
                      return <PropertyBadge status={status}>{text}</PropertyBadge>;
                    })()}
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <PropertyBadge status={leaveType.annual_reset ? 'success' : 'neutral'}>
                      {leaveType.annual_reset ? '是' : '否'}
                    </PropertyBadge>
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <PropertyBadge status={leaveType.requires_attachment ? 'success' : 'neutral'}>
                      {leaveType.requires_attachment ? '是' : '否'}
                    </PropertyBadge>
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <PropertyBadge status={leaveType.is_active ? 'info' : 'error'}>
                      {leaveType.is_active ? '啟用' : '停用'}
                    </PropertyBadge>
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

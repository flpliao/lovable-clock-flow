
import { Staff } from '@/components/staff/types';
import { getCheckInRecords, saveCheckInRecord } from './checkInUtils';
import { CheckInRecord } from '@/types';

/**
 * 当员工数据变化时同步相关数据
 * 这个函数将确保当员工名称、部门等信息变化时，关联的数据也会更新
 */
export const syncStaffDataChanges = (oldStaff: Staff, newStaff: Staff) => {
  // 如果员工ID变化，这个函数不适用 - 需要更复杂的合并策略
  if (oldStaff.id !== newStaff.id) {
    console.warn('尝试同步不同ID的员工数据，跳过同步');
    return;
  }
  
  // 如果员工基本数据未变化，不需要同步
  if (
    oldStaff.name === newStaff.name && 
    oldStaff.department === newStaff.department &&
    oldStaff.position === newStaff.position
  ) {
    return;
  }
  
  // 更新打卡记录中的员工信息
  syncCheckInRecords(newStaff);
  
  // 这里可以添加其他数据类型的同步 
  // 例如: 同步请假记录、同步排班信息等
  
  console.log(`已同步员工 ${newStaff.id} (${newStaff.name}) 的所有相关数据`);
};

/**
 * 同步打卡记录
 * 注意：目前我们只是存储员工ID作为关联，而不是员工的其他信息
 * 在实际应用中可能需要存储员工的额外信息，如姓名、部门等
 */
const syncCheckInRecords = (staff: Staff) => {
  // 此功能预留，打卡记录仅存储员工ID，不存储其他信息
  // 如果未来需要在打卡记录中添加更多员工信息，可在此处实现
};

/**
 * 当员工被删除时，处理关联数据
 * 可选策略：
 * 1. 删除所有关联数据（如打卡记录）
 * 2. 保留数据但标记为"已删除员工"
 * 3. 转移数据到其他员工
 */
export const handleStaffDeletion = (staffId: string, strategy: 'delete' | 'mark' | 'transfer' = 'mark', transferToId?: string) => {
  switch (strategy) {
    case 'delete':
      // 删除所有关联的打卡记录
      deleteAllCheckInRecords(staffId);
      break;
    
    case 'mark':
      // 标记为已删除员工的打卡记录
      markCheckInRecordsAsDeletedStaff(staffId);
      break;
      
    case 'transfer':
      // 转移到其他员工
      if (transferToId) {
        transferCheckInRecords(staffId, transferToId);
      } else {
        console.error('转移员工数据时需要提供目标员工ID');
      }
      break;
  }
};

/**
 * 删除员工的所有打卡记录
 */
const deleteAllCheckInRecords = (staffId: string) => {
  const allRecords = getCheckInRecords();
  const filteredRecords = allRecords.filter(record => record.userId !== staffId);
  localStorage.setItem('checkInRecords', JSON.stringify(filteredRecords));
  console.log(`已删除员工 ${staffId} 的所有打卡记录`);
};

/**
 * 标记员工打卡记录为已删除员工
 */
const markCheckInRecordsAsDeletedStaff = (staffId: string) => {
  const allRecords = getCheckInRecords();
  const updatedRecords = allRecords.map(record => {
    if (record.userId === staffId) {
      return {
        ...record,
        details: {
          ...record.details,
          deletedStaff: true
        }
      };
    }
    return record;
  });
  
  localStorage.setItem('checkInRecords', JSON.stringify(updatedRecords));
  console.log(`已标记员工 ${staffId} 的所有打卡记录为已删除员工`);
};

/**
 * 转移员工打卡记录到其他员工
 */
const transferCheckInRecords = (fromStaffId: string, toStaffId: string) => {
  const allRecords = getCheckInRecords();
  const updatedRecords = allRecords.map(record => {
    if (record.userId === fromStaffId) {
      return {
        ...record,
        userId: toStaffId
      };
    }
    return record;
  });
  
  localStorage.setItem('checkInRecords', JSON.stringify(updatedRecords));
  console.log(`已将员工 ${fromStaffId} 的所有打卡记录转移至员工 ${toStaffId}`);
};

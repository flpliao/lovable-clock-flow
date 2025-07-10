# 篩選服務抽離重構總結

## 📋 重構概述

本次重構將原本分散在各組件中的篩選邏輯抽離到統一的服務層，建立了可擴展、可維護的篩選服務架構。

## 🏗️ 新的架構設計

### 1. 服務目錄結構

```
src/services/filter/
├── BaseFilterService.ts          # 基礎篩選服務類別
├── StaffFilterService.ts         # 員工篩選服務
├── OvertimeFilterService.ts      # 加班篩選服務
├── PositionFilterService.ts      # 職位篩選服務
├── AnnouncementFilterService.ts  # 公告篩選服務
└── index.ts                      # 統一導出檔案
```

### 2. 核心組件

#### BaseFilterService (基礎服務類別)

- 提供通用的篩選邏輯
- 支援本地篩選、分頁、排序功能
- 定義統一的介面和抽象方法

```typescript
export abstract class BaseFilterService<T> {
  abstract filter(request: ApiFilterRequest): Promise<ApiFilterResponse<T>>;

  // 通用方法
  protected applyLocalFilter(
    data: T[],
    conditionGroups: FilterGroup[],
    fieldMapper: (item: T, field: string) => string
  ): T[];
  protected applyPagination<T>(data: T[], page: number, pageSize: number): PaginationResult;
  protected applySorting<T>(data: T[], sortBy?: string, sortOrder?: 'asc' | 'desc'): T[];
}
```

#### 具體服務實作

每個服務都繼承 `BaseFilterService` 並實作特定的篩選邏輯：

```typescript
export class StaffFilterService extends BaseFilterService<Staff> {
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<Staff>> {
    // 實作員工特定的篩選邏輯
  }

  // 提供選項方法
  getRoleOptions(): FilterOption[];
  getDepartmentOptions(): FilterOption[];
  getPositionOptions(): FilterOption[];
}
```

### 3. 服務註冊和動態載入

#### 服務映射表

```typescript
export const filterServiceInstances = {
  staff: () => import('./StaffFilterService').then(m => m.staffFilterService),
  overtime: () => import('./OvertimeFilterService').then(m => m.overtimeFilterService),
  position: () => import('./PositionFilterService').then(m => m.positionFilterService),
  announcement: () => import('./AnnouncementFilterService').then(m => m.announcementFilterService),
} as const;
```

#### 動態服務載入

```typescript
// 在 useAdvancedFilter 中
if (serviceType) {
  const serviceInstance = await filterServiceInstances[serviceType]();
  response = (await serviceInstance.filter(request)) as ApiFilterResponse<T>;
}
```

## 🔄 使用方式變更

### 舊方式（直接傳入服務）

```typescript
const { filteredData, loading } = useAdvancedFilter({
  data: staffList,
  searchFields,
  operators,
  apiService: staffFilterService, // 直接傳入服務實例
});
```

### 新方式（使用服務類型）

```typescript
const { filteredData, loading } = useAdvancedFilter({
  data: staffList,
  searchFields,
  operators,
  serviceType: 'staff', // 使用服務類型，自動載入對應服務
});
```

## 📊 已改造的組件

| 組件         | 檔案路徑                                                      | 服務類型       | 狀態      |
| ------------ | ------------------------------------------------------------- | -------------- | --------- |
| 員工管理     | `src/components/staff/StaffManagement.tsx`                    | `staff`        | ✅ 已完成 |
| 加班歷史     | `src/components/overtime/OvertimeHistory.tsx`                 | `overtime`     | ✅ 已完成 |
| 職位篩選     | `src/components/positions/PositionFilters.tsx`                | `position`     | 🔄 待更新 |
| 薪資結構管理 | `src/components/hr/SalaryStructureManagement.tsx`             | -              | 🔄 待更新 |
| 薪資管理     | `src/components/hr/PayrollManagement.tsx`                     | -              | 🔄 待更新 |
| 部門表格     | `src/components/departments/DepartmentTable.tsx`              | -              | 🔄 待更新 |
| 出勤異常管理 | `src/components/attendance/AttendanceExceptionManagement.tsx` | -              | 🔄 待更新 |
| 公告管理     | `src/components/announcements/AnnouncementManagement.tsx`     | `announcement` | 🔄 待更新 |
| 公告列表     | `src/components/announcements/AnnouncementList.tsx`           | `announcement` | 🔄 待更新 |

## 🎯 重構優勢

### 1. 代碼組織性

- **統一管理**: 所有篩選邏輯集中在 `services/filter` 目錄
- **職責分離**: 每個服務專注於特定領域的篩選邏輯
- **可維護性**: 修改篩選邏輯時只需更新對應服務

### 2. 可擴展性

- **易於新增**: 新增篩選服務只需繼承 `BaseFilterService`
- **動態載入**: 支援按需載入服務，減少初始包大小
- **類型安全**: 完整的 TypeScript 類型支援

### 3. 可重用性

- **通用邏輯**: 基礎服務提供通用的篩選、分頁、排序功能
- **選項提供**: 統一的選項介面，方便下拉選單使用
- **介面一致**: 所有服務實作相同的介面

### 4. 未來擴展

- **Laravel 整合**: 可以輕鬆替換為 Laravel API 服務
- **快取機制**: 可以在基礎服務中添加快取邏輯
- **效能優化**: 可以實作更複雜的查詢優化

## 🚀 後續步驟

### 1. 完成剩餘組件改造

```bash
# 更新職位篩選
src/components/positions/PositionFilters.tsx -> serviceType: 'position'

# 更新公告相關組件
src/components/announcements/AnnouncementManagement.tsx -> serviceType: 'announcement'
src/components/announcements/AnnouncementList.tsx -> serviceType: 'announcement'
```

### 2. 新增更多篩選服務

```typescript
// 可以新增的服務
export class DepartmentFilterService extends BaseFilterService<Department>
export class LeaveFilterService extends BaseFilterService<LeaveRequest>
export class PayrollFilterService extends BaseFilterService<PayrollRecord>
```

### 3. 實作真正的 API 整合

```typescript
// 在具體服務中替換模擬資料
async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<T>> {
  // 替換為真正的 API 呼叫
  const response = await fetch('/api/staff/filter', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  return response.json();
}
```

## 📝 使用範例

### 基本使用

```typescript
import { useAdvancedFilter } from '@/components/common/AdvancedFilter';

const MyComponent = () => {
  const { filteredData, loading, conditionGroups } = useAdvancedFilter({
    searchFields: [
      { value: 'name', label: '姓名', type: 'input' },
      { value: 'department', label: '部門', type: 'select', options: departmentOptions },
    ],
    operators: [
      { value: 'contains', label: '包含' },
      { value: 'equals', label: '等於' },
    ],
    serviceType: 'staff', // 自動使用 StaffFilterService
    initialPageSize: 20,
    enablePagination: true,
  });

  return (
    <div>
      {loading ? <Loading /> : <DataTable data={filteredData} />}
    </div>
  );
};
```

### 自訂服務

```typescript
// 如果需要自訂服務，仍可使用 apiService 參數
const customService = {
  async filter(request: ApiFilterRequest) {
    // 自訂篩選邏輯
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  },
};

const { filteredData } = useAdvancedFilter({
  apiService: customService,
  // ... 其他配置
});
```

## 🔧 技術細節

### 類型定義

```typescript
// 服務類型
export type FilterServiceType = 'staff' | 'overtime' | 'position' | 'announcement';

// 選項介面
export interface FilterOption {
  value: string;
  label: string;
}

// 選項提供者
export interface OptionsProvider {
  getOptions(): FilterOption[];
}
```

### 錯誤處理

```typescript
// 在基礎服務中統一的錯誤處理
try {
  // 篩選邏輯
} catch (error) {
  console.error('篩選失敗:', error);
  throw error;
}
```

### 效能考量

- **動態載入**: 服務按需載入，減少初始包大小
- **快取機制**: 可以在基礎服務中添加結果快取
- **分頁優化**: 支援服務端分頁，減少資料傳輸

## 📚 相關文件

- [API 篩選架構設計](./API_FILTER_ARCHITECTURE.md)
- [AdvancedFilter 組件使用指南](./ADVANCED_FILTER_USAGE.md)
- [混合模式篩選說明](./MIXED_FILTER_MODE.md)

---

**總結**: 本次重構成功建立了統一、可擴展的篩選服務架構，為未來的 Laravel 後端整合奠定了堅實的基礎。

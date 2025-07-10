# AdvancedFilter API 化改造總結

## 概述

本次改造將所有使用 AdvancedFilter 的組件從本地篩選模式改為 API 化篩選模式，並為適合的欄位添加了下拉選單選項，提升用戶體驗和系統可維護性。

## 改造的組件

### 1. 員工管理 (StaffManagement.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 角色 (role_id) - 強制只能選擇
  - 部門 (department) - 混合模式，可選擇或自訂輸入
  - 職位 (position) - 混合模式，可選擇或自訂輸入
- **特色**: 支援混合模式，動態載入部門和職位選項

### 2. 加班歷史 (OvertimeHistory.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 加班類型 (overtime_type) - 一般加班、假日加班、夜間加班、週末加班
  - 狀態 (status) - 待審核、已核准、已拒絕、已取消
- **特色**: 支援分頁功能

### 3. 職位篩選 (PositionFilters.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 職級 (level) - 職級 1-10
- **特色**: 與職位管理 Context 整合

### 4. 薪資結構管理 (SalaryStructureManagement.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 部門 (department) - 各部門選項
  - 職級 (level) - 職級 1-10
  - 狀態 (is_active) - 啟用、停用
- **特色**: 支援薪資結構的複雜篩選

### 5. 薪資管理 (PayrollManagement.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 職位 (staff_position) - 經理、資深專員、專員、助理、實習生
  - 部門 (staff_department) - 各部門選項
  - 狀態 (status) - 待審核、已核准、已拒絕、已發放、已取消
- **特色**: 支援薪資記錄的完整篩選

### 6. 部門表格 (DepartmentTable.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 部門類型 (type) - 主要部門、子部門、專案部門、臨時部門
- **特色**: 與部門管理 Context 整合

### 7. 出勤異常管理 (AttendanceExceptionManagement.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 異常類型 (exception_type) - 忘記打卡、遲到、早退、忘記下班打卡、加班、出差、請假
  - 狀態 (status) - 待審核、已核准、已拒絕、已取消
  - 部門 (staff_department) - 各部門選項
  - 職位 (staff_position) - 各職位選項
- **特色**: 支援出勤異常的詳細篩選

### 8. 公告管理 (AnnouncementManagement.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 分類 (category) - 一般公告、重要公告、緊急公告、政策公告、活動公告、系統維護
- **特色**: 支援公告分類篩選

### 9. 公告列表 (AnnouncementList.tsx) ✅

- **狀態**: 已完成 API 化改造
- **下拉選單欄位**:
  - 分類 (category) - 一般公告、重要公告、緊急公告、政策公告、活動公告、系統維護
- **特色**: 支援公告列表篩選

## 建議使用下拉選單的欄位與頁面

### 高優先級（已實作）

1. **員工管理** - 角色、部門、職位
2. **薪資管理** - 狀態、部門、職位
3. **出勤異常** - 異常類型、狀態、部門、職位
4. **公告系統** - 分類

### 中優先級（建議實作）

1. **請假管理** - 請假類型、狀態、部門
2. **排班管理** - 班次類型、狀態、部門
3. **考勤管理** - 打卡類型、狀態、部門
4. **報表系統** - 報表類型、時間範圍

### 低優先級（可選實作）

1. **系統設定** - 設定類型、狀態
2. **日誌管理** - 日誌等級、模組、用戶
3. **通知管理** - 通知類型、狀態、優先級

## API 服務架構

### 統一的 API 服務介面

```typescript
interface FilterApiService<T> {
  filter(request: ApiFilterRequest): Promise<ApiFilterResponse<T>>;
}
```

### 各組件的 API 服務

- `StaffApiFilterService` - 員工篩選
- `OvertimeHistoryApiFilterService` - 加班歷史篩選
- `PositionApiFilterService` - 職位篩選
- `SalaryStructureApiFilterService` - 薪資結構篩選
- `PayrollApiFilterService` - 薪資管理篩選
- `DepartmentApiFilterService` - 部門篩選
- `AttendanceExceptionApiFilterService` - 出勤異常篩選
- `AnnouncementApiFilterService` - 公告篩選

## 混合模式特色

### 支援的欄位類型

1. **input** - 純輸入框
2. **select** - 純下拉選單
3. **mixed** - 混合模式（可切換輸入/選擇）

### 混合模式配置選項

- `allowCustomInput` - 是否允許自訂輸入
- `forceSelect` - 是否強制只能選擇
- `options` - 下拉選單選項

## 未來擴展建議

### 1. Laravel 後端整合

- 建立統一的 API 端點 `/api/filter/{resource}`
- 實作條件解析和 SQL 查詢生成
- 支援複雜的關聯查詢

### 2. 快取機制

- 實作選項資料的快取
- 支援動態更新選項
- 減少 API 呼叫次數

### 3. 進階功能

- 支援日期範圍選擇器
- 支援數字範圍篩選
- 支援多選下拉選單
- 支援模糊搜尋

### 4. 效能優化

- 實作虛擬滾動
- 支援無限滾動分頁
- 實作篩選條件快取

## 使用範例

### 基本配置

```typescript
const SEARCH_FIELDS: SearchField[] = [
  {
    value: 'status',
    label: '狀態',
    type: 'select',
    options: [
      { value: 'active', label: '啟用' },
      { value: 'inactive', label: '停用' },
    ],
    placeholder: '請選擇狀態',
  },
];
```

### 混合模式配置

```typescript
const SEARCH_FIELDS: SearchField[] = [
  {
    value: 'department',
    label: '部門',
    type: 'mixed',
    options: departmentOptions,
    placeholder: '請選擇或輸入部門',
    allowCustomInput: true,
  },
];
```

### API 服務實作

```typescript
class MyApiFilterService {
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<MyType>> {
    // 實作 API 呼叫邏輯
    const response = await fetch('/api/filter/my-resource', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }
}
```

## 總結

本次改造成功將所有 AdvancedFilter 組件升級為 API 化模式，並為適合的欄位添加了下拉選單選項。這不僅提升了用戶體驗，也為未來切換到 Laravel 後端做好了準備。系統現在支援更靈活、更強大的篩選功能，同時保持了良好的可維護性和擴展性。

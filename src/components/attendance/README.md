# 打卡記錄管理 - 元件化架構

本模組參考公司單位管理的架構模式，進行了完整的元件化重構。

## 📁 架構結構

```
src/
├── stores/
│   └── attendanceRecordStore.ts          # Zustand Store - 純狀態管理
├── services/
│   └── attendanceRecordService.ts        # Service層 - API調用和數據處理
├── hooks/
│   └── useAttendanceRecords.ts           # 自定義Hook - 商業邏輯
├── components/
│   ├── attendance/
│   │   ├── AttendanceFilters.tsx         # 篩選組件
│   │   ├── AttendanceRecordTable.tsx     # 正常記錄表格
│   │   ├── AttendanceAnomalyTable.tsx    # 異常記錄表格
│   │   └── README.md                     # 說明文件
│   └── AttendanceRecordManagement.tsx    # 主組件 (1387行 → 178行)
```

## 🏗️ 設計模式

### 1. **Store 層 (State Management)**

- **職責**: 純狀態管理，不包含商業邏輯
- **使用**: Zustand
- **特點**:
  - 管理所有UI狀態和資料狀態
  - 提供簡單的CRUD操作
  - 支援篩選條件和分頁狀態

### 2. **Service 層 (Data Layer)**

- **職責**: API調用、數據轉換、權限檢查
- **特點**:
  - 靜態方法設計
  - 完整的錯誤處理
  - 權限控制邏輯

### 3. **Hook 層 (Business Logic)**

- **職責**: 連接Store和Service，處理商業邏輯
- **特點**:
  - 封裝複雜的業務流程
  - 提供統一的API給組件
  - 管理組件生命週期

### 4. **Component 層 (Presentation)**

- **職責**: UI渲染和用戶交互
- **特點**:
  - 單一職責原則
  - 通過props接收數據和回調
  - 可重用性高

## 🔄 數據流

```
User Interaction
      ↓
UI Components (props/callbacks)
      ↓
useAttendanceRecords Hook (business logic)
      ↓
AttendanceRecordService (API calls)
      ↓
AttendanceRecordStore (state updates)
      ↓
UI Components (re-render)
```

## 📊 重構成果

### 性能提升

- **代碼行數**: 1387行 → 178行 (87% 減少)
- **組件複雜度**: 大幅降低
- **可維護性**: 顯著提升

### 結構優化

- ✅ 關注點分離
- ✅ 單一職責原則
- ✅ 可重用組件
- ✅ 狀態管理優化
- ✅ 錯誤處理集中化

### 開發體驗

- 🔧 更容易測試
- 🔧 更好的類型安全
- 🔧 更清晰的代碼結構
- 🔧 更簡單的功能擴展

## 🚀 使用方式

```tsx
// 在其他組件中使用
import AttendanceRecordManagement from '@/components/AttendanceRecordManagement';

function SomePage() {
  return <AttendanceRecordManagement />;
}
```

## 🔧 擴展指南

### 添加新功能

1. 在`attendanceRecordStore.ts`中添加新的狀態
2. 在`attendanceRecordService.ts`中添加新的API方法
3. 在`useAttendanceRecords.ts`中添加新的業務邏輯
4. 創建新的UI組件或修改現有組件

### 添加新的篩選條件

1. 更新`FilterConditions`類型
2. 修改`AttendanceFilters`組件
3. 更新`useAttendanceRecords`中的篩選邏輯

### 添加新的操作按鈕

1. 在Service層添加對應的API方法
2. 在Hook中添加業務邏輯
3. 在對應的Table組件中添加UI元素

## 📝 注意事項

- Store只負責狀態管理，不包含商業邏輯
- Service層處理所有API調用和數據轉換
- Hook層封裝業務邏輯，提供統一接口
- 組件層專注於UI渲染和交互
- 保持單向數據流

這種架構模式確保了代碼的可維護性、可測試性和可擴展性。

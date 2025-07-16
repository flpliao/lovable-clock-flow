# 常用 Prompts

## 常用簡短指令

- `cc` - 生成 commit 訊息
- `review` - 程式碼審查
- `debug` - 除錯協助
- `help` - 顯示所有可用的 prompts

## Git Commit 訊息生成

```prompt
請先列出當前的程式碼變更內容，然後根據以下規範幫我生成一個 Git 提交訊息：

1. 檢查變更：
- 已暫存的變更（staged changes）
- 未暫存的變更（unstaged changes）
- 新增的檔案（untracked files）
- 刪除的檔案（deleted files）

2. 列出修改細項：
- 針對每個修改的檔案，簡要說明主要變更內容
- 如果是重構，說明重構的目的和影響
- 如果是新增功能，說明功能用途
- 如果是修復錯誤，說明錯誤類型和解決方式

2.1. 若有貼上 git status、git diff、或指定檔案/行數（如 lines=...），請以這些內容為主，優先針對指定範圍產生 commit 訊息。

3. 格式：
```

<type>: <subject>

<description>
```

4. Type 類型：

- feat: 新功能
- fix: 修復問題
- docs: 文件變更
- style: 程式碼格式修改
- refactor: 重構程式碼
- perf: 改善效能
- test: 測試相關
- chore: 建置/工具/庫等修改

5. Subject 要求：

- 簡潔明瞭
- 使用中文
- 不超過 50 字
- 結尾不加句號

6. Description 要求：

- 詳細說明變更的原因和目的
- 使用中文
- 可以分點說明

請先列出變更內容和修改細項，再提供對應的 commit 訊息（包含 subject 和 description）。

````

## 程式碼審查

```prompt
請幫我審查以下程式碼變更，並提供以下方面的建議：

1. 程式碼品質
2. 潛在問題
3. 效能考量
4. 安全性問題
5. 最佳實踐建議
````

## 除錯協助

```prompt
請幫我分析以下錯誤訊息和程式碼，並提供：

1. 錯誤原因分析
2. 可能的解決方案
3. 防止類似問題的建議
```

## 使用方式

1. 在 Cursor 中將此文件作為參考（可保持開啟狀態或隨時查看）
2. 使用簡短指令或完整指令：
   - 簡短指令：直接輸入 `cc`、`review`、`debug` 等
   - 完整指令：輸入 `請使用 xxx prompt`（例如：`請使用 commit prompt`）
3. 輸入 `help` 可以查看所有可用的 prompts

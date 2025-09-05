// 出勤資料快取服務
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // 存活時間（毫秒）
}

class AttendanceCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5分鐘預設快取時間

  // 設定快取
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // 取得快取
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 檢查是否過期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // 清除快取
  clear(): void {
    this.cache.clear();
  }

  // 清除特定快取
  delete(key: string): void {
    this.cache.delete(key);
  }

  // 生成快取鍵
  generateKey(prefix: string, ...params: (string | number)[]): string {
    return `${prefix}:${params.join(':')}`;
  }
}

export const attendanceCache = new AttendanceCache();

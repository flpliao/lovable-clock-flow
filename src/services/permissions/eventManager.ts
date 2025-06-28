
export class PermissionEventManager {
  private eventListeners: Set<() => void> = new Set();

  initializeEventListeners(): void {
    // 監聽權限更新事件
    window.addEventListener('permissionUpdated', this.handlePermissionUpdate.bind(this));
    
    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // 頁面變為可見時，清除快取以確保權限同步
        this.notifyListeners();
      }
    });
  }

  private handlePermissionUpdate(event: CustomEvent): void {
    const { operation, roleData } = event.detail;
    console.log('🔔 權限更新事件:', operation, roleData);
    
    // 通知所有監聽器
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.eventListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('權限更新監聽器錯誤:', error);
      }
    });
  }

  addPermissionUpdateListener(listener: () => void): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  forceReload(): void {
    console.log('🔄 強制重新載入權限');
    window.dispatchEvent(new CustomEvent('permissionForceReload'));
  }
}

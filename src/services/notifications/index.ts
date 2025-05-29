
import { NotificationDatabaseOperations } from './notificationDatabaseOperations';
import { NotificationBulkOperations } from './notificationBulkOperations';
import { NotificationDatabaseTesting } from './notificationDatabaseTesting';

export { NotificationDatabaseOperations } from './notificationDatabaseOperations';
export { NotificationBulkOperations } from './notificationBulkOperations';
export { NotificationDatabaseTesting } from './notificationDatabaseTesting';

// Legacy compatibility export
export class NotificationDatabaseService {
  static loadNotifications = NotificationDatabaseOperations.loadNotifications;
  static addNotification = NotificationDatabaseOperations.addNotification;
  static markNotificationAsRead = NotificationDatabaseOperations.markNotificationAsRead;
  static markAllNotificationsAsRead = NotificationDatabaseOperations.markAllNotificationsAsRead;
  static clearAllNotifications = NotificationDatabaseOperations.clearAllNotifications;
  static createBulkNotifications = NotificationBulkOperations.createBulkNotifications;
  static testDatabaseConnection = NotificationDatabaseTesting.testDatabaseConnection;
}

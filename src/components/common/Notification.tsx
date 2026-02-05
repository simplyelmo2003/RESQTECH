import React from 'react';
import { useNotification } from '@/hooks/useNotifications';
import { Notification as NotificationType } from '@/types/common'; // Renamed to avoid confusion

interface NotificationItemProps {
  notification: NotificationType;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useNotification();

  const getBackgroundColor = (type: NotificationType['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'info':
        return 'bg-info';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div
      className={`relative flex items-center justify-between p-4 rounded-lg shadow-md text-white mb-3 transition-all duration-300 ease-in-out transform translate-x-0 pointer-events-auto ${getBackgroundColor(notification.type)}`}
      role="alert"
    >
      <div className="flex items-center">
        {/* You can add icons here based on notification.type */}
        <span className="font-semibold text-sm mr-2">
          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}:
        </span>
        <p className="text-sm">{notification.message}</p>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 pointer-events-auto"
        aria-label="Close notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  // Prevent multiple notifications from overlapping if they are too wide
  // and ensure they are positioned nicely
  return (
    <div className="fixed top-4 right-4 z-[1000] w-full max-w-sm pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
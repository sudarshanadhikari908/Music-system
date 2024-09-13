import { notification } from 'antd';

let currentNotificationKey: string | null = null;

const showNotification = (
  type: 'success' | 'error' | 'warning', 
  message: string, 
  description?: string
) => {
  if (currentNotificationKey) {
    notification.destroy();
  }

  currentNotificationKey = `${type}-${Date.now()}`;

  notification[type]({
    key: currentNotificationKey,
    message,
    description,
    placement: 'topRight', 
  });
};

export default showNotification;

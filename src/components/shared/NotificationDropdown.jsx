import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotificationSummary, markNotificationAsRead } from '../../services/notificationService';
import { connectRealtime } from '../../services/realtimeService';

function NotificationDropdown({ user }) {
  const [summary, setSummary] = useState({ unreadCount: 0, recentNotifications: [] });

  useEffect(() => {
    let mounted = true;
    let subscription;

    const loadSummary = async () => {
      try {
        const data = await getNotificationSummary();
        if (mounted) {
          setSummary(data);
        }
      } catch {
        // Keep navbar resilient if notifications fail.
      }
    };

    loadSummary();

    if (user?.id) {
      const client = connectRealtime();
      const onConnect = () => {
        subscription = client.subscribe(`/topic/users/${user.id}/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          setSummary((current) => ({
            unreadCount: current.unreadCount + (notification.read ? 0 : 1),
            recentNotifications: [notification, ...current.recentNotifications].slice(0, 5),
          }));
        });
      };
      if (client.connected) {
        onConnect();
      } else {
        const previous = client.onConnect;
        client.onConnect = (frame) => {
          previous?.(frame);
          onConnect();
        };
      }
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [user?.id]);

  const handleRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setSummary((current) => ({
        unreadCount: Math.max(0, current.unreadCount - 1),
        recentNotifications: current.recentNotifications.map((notification) => (
          notification.id === notificationId ? { ...notification, read: true } : notification
        )),
      }));
    } catch {
      // Silent by design in navbar.
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-notification position-relative"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Notifications
        {summary.unreadCount > 0 ? <span className="notification-count">{summary.unreadCount}</span> : null}
      </button>
      <div className="dropdown-menu dropdown-menu-end notification-menu p-0 overflow-hidden">
        <div className="notification-header p-3">
          <div className="fw-bold">Updates</div>
          <div className="small text-secondary">Reviews, comments, and assignment alerts</div>
        </div>
        {!summary.recentNotifications.length ? (
          <div className="p-3 small text-secondary">No notifications yet.</div>
        ) : (
          <div className="d-flex flex-column">
            {summary.recentNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link || '/dashboard'}
                className={`notification-item text-decoration-none ${notification.read ? 'is-read' : ''}`}
                onClick={() => handleRead(notification.id)}
              >
                <div className="fw-semibold text-body">{notification.title}</div>
                <div className="small text-secondary">{notification.message}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;

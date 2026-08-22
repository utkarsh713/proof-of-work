import { useState } from "react";
import {
  FiBell,
  FiCpu,
  FiUsers,
  FiMapPin,
  FiTool,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiSettings,
  FiArrowRight,
} from "react-icons/fi";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "ai",
      title: "AI Verification Completed",
      message:
        "AI analysis for Road Repair - Sector 18 has been completed with 94% confidence.",
      time: "10 minutes ago",
      unread: true,
      icon: <FiCpu />,
    },
    {
      id: 2,
      type: "citizen",
      title: "Citizen Verification Received",
      message:
        "A citizen has verified that the public work appears to be completed.",
      time: "42 minutes ago",
      unread: true,
      icon: <FiUsers />,
    },
    {
      id: 3,
      type: "gps",
      title: "GPS Location Captured",
      message:
        "Evidence location has been successfully captured and verified.",
      time: "2 hours ago",
      unread: true,
      icon: <FiMapPin />,
    },
    {
      id: 4,
      type: "work",
      title: "Work Registered",
      message:
        "Your public work submission has been successfully registered.",
      time: "Yesterday",
      unread: false,
      icon: <FiTool />,
    },
    {
      id: 5,
      type: "report",
      title: "Verification Review Required",
      message:
        "A submitted work requires additional evidence review.",
      time: "Yesterday",
      unread: false,
      icon: <FiAlertTriangle />,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const clearNotification = (id) => {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        {/* HEADER */}
        <div className="notifications-header">

          <div>
            <p className="page-label">
              ACTIVITY CENTER
            </p>

            <h1>
              Notifications<span>.</span>
            </h1>

            <p>
              Stay updated about your public work verification.
            </p>
          </div>

          <div className="notification-count">
            <FiBell />

            <div>
              <strong>{unreadCount}</strong>
              <span>Unread updates</span>
            </div>
          </div>

        </div>


        {/* ACTION BAR */}
        <div className="notifications-actions">

          <div className="notification-summary">

            <div className="notification-summary-icon">
              <FiBell />
            </div>

            <div>
              <strong>
                {notifications.length} Notifications
              </strong>

              <p>
                {unreadCount} unread updates waiting for you
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={markAllAsRead}
            className="mark-all-button"
          >
            <FiCheck />
            Mark all as read
          </button>

        </div>


        {/* NOTIFICATION LIST */}
        <section className="notifications-card">

          {notifications.length === 0 ? (

            <div className="notifications-empty">

              <div className="empty-icon">
                <FiCheck />
              </div>

              <h2>
                You're all caught up
              </h2>

              <p>
                There are no new notifications right now.
              </p>

            </div>

          ) : (

            <div className="notification-list">

              {notifications.map((notification) => (

                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.unread ? "unread" : ""
                  }`}
                >

                  <div
                    className={`notification-icon ${notification.type}`}
                  >
                    {notification.icon}
                  </div>


                  <div className="notification-content">

                    <div className="notification-title-row">

                      <h3>
                        {notification.title}
                      </h3>

                      {notification.unread && (
                        <span className="unread-dot" />
                      )}

                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <span className="notification-time">
                      {notification.time}
                    </span>

                  </div>


                  <div className="notification-buttons">

                    {notification.unread && (

                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        title="Mark as read"
                        className="read-button"
                      >
                        <FiCheck />
                      </button>

                    )}

                    <button
                      type="button"
                      onClick={() =>
                        clearNotification(notification.id)
                      }
                      title="Remove notification"
                      className="delete-button"
                    >
                      <FiX />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* SETTINGS */}
        <section className="notification-settings-preview">

          <div className="notification-settings-icon">
            <FiSettings />
          </div>

          <div>
            <h3>
              Notification Preferences
            </h3>

            <p>
              Control which verification updates you receive.
            </p>
          </div>

          <button type="button">
            Manage Settings
            <FiArrowRight />
          </button>

        </section>

      </div>
    </div>
  );
}

export default Notifications;
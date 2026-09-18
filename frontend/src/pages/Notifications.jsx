import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBell,
  FiCheck,
  FiSettings,
  FiArrowRight,
} from "react-icons/fi";

import { getNotifications, markAsRead as apiMarkAsRead } from "../api/notificationApi";
import { EndpointNotConfiguredError } from "../api/apiClient";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      setUnavailable(false);

      const data = await getNotifications();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof EndpointNotConfiguredError) {
        // Honest empty state — no backend endpoint yet.
        setUnavailable(true);
        setNotifications([]);
      } else {
        console.error("Failed to load notifications:", err);
        setError(err?.message || "Unable to load notifications.");
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiMarkAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, unread: false }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => n.unread)
        .map((n) => apiMarkAsRead(n.id).catch(() => null))
    );

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false }))
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        {/* HEADER */}
        <div className="notifications-header">

          <div>
            <p className="page-label">ACTIVITY CENTER</p>

            <h1>
              Notifications<span>.</span>
            </h1>

            <p>Stay updated about your public work verification.</p>
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
              <strong>{notifications.length} Notifications</strong>
              <p>{unreadCount} unread updates waiting for you</p>
            </div>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="mark-all-button"
            disabled={unreadCount === 0}
          >
            <FiCheck />
            {unreadCount === 0 ? "All caught up" : "Mark all as read"}
          </button>

        </div>

        {/* NOTIFICATION LIST */}
        <section className="notifications-card">

          {loading ? (

            <div className="notifications-empty">
              <h2>Loading notifications…</h2>
            </div>

          ) : error ? (

            <div className="notifications-empty">
              <h2>Unable to load notifications</h2>
              <p>{error}</p>
            </div>

          ) : unavailable || notifications.length === 0 ? (

            <div className="notifications-empty">
              <div className="empty-icon">
                <FiCheck />
              </div>

              <h2>No notifications yet.</h2>

              <p>
                {unavailable
                  ? "The notifications backend endpoint isn't connected yet."
                  : "There are no new notifications right now."}
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

                  <div className={`notification-icon ${notification.type || ""}`}>
                    <FiBell />
                  </div>

                  <div className="notification-content">

                    <div className="notification-title-row">
                      <h3>{notification.title}</h3>

                      {notification.unread && <span className="unread-dot" />}
                    </div>

                    <p>{notification.message}</p>

                    <span className="notification-time">
                      {notification.time || notification.createdAt}
                    </span>

                  </div>

                  <div className="notification-buttons">

                    {notification.unread && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                        className="read-button"
                      >
                        <FiCheck />
                      </button>
                    )}

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

          <div className="notification-settings-content">
            <h3>Notification Preferences</h3>
            <p>Control which verification updates you receive.</p>
          </div>

          <button
            type="button"
            className="manage-settings-btn"
            onClick={() => navigate("/settings")}
          >
            Manage Settings
            <FiArrowRight />
          </button>

        </section>

      </div>
    </div>
  );
}

export default Notifications;

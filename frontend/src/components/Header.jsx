import { useNavigate } from "react-router-dom";
import { Search, Bell, Plus } from "lucide-react";

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Header() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const firstName =
    (currentUser?.name || currentUser?.fullName || "").split(" ")[0] || "there";

  return (
    <header className="dashboard-header">

      <div className="header-welcome">
        <h1 className="header-greeting">
          {getGreeting()}, {firstName}
        </h1>

        <p className="header-subtitle">
          Here's what's happening with your public work today.
        </p>
      </div>

      <div className="header-actions">

        <div className="search-box">
          <Search size={15} className="search-icon" />

          <input type="text" placeholder="Search works, locations..." />
        </div>

        <button
          type="button"
          className="notification-button"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          type="button"
          className="register-header-button"
          onClick={() => navigate("/register-work")}
        >
          <Plus size={16} style={{ marginRight: 6 }} />
          Register Work
        </button>

      </div>

    </header>
  );
}

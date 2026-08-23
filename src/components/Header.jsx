import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  // Get logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.username ||
    "User";

  return (
    <header className="dashboard-header">

      {/* Welcome */}
      <div className="header-welcome">
        <p className="header-greeting">
          Welcome back, {userName}! 👋
        </p>

        <p className="header-subtitle">
          Let's make public works truly transparent.
        </p>
      </div>

      {/* Header Actions */}
      <div className="header-actions">

        {/* Search */}
        <div className="search-box">
          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search works, locations..."
          />
        </div>

        {/* Notifications */}
        <button
          className="notification-button"
          onClick={() => navigate("/notifications")}
          type="button"
        >
          🔔

          <span className="notification-dot">
            3
          </span>
        </button>

        {/* Register Work */}
        <button
          className="register-header-button"
          onClick={() => navigate("/register-work")}
          type="button"
        >
          <span>＋</span>
          Register New Work
        </button>

      </div>

    </header>
  );
}

export default Header;
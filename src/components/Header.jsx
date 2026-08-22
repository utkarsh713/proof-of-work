function Header() {
  return (
    <header className="dashboard-header">

      {/* Welcome */}
      <div className="header-welcome">
        <p className="header-greeting">
          Welcome back, Anjali! 👋
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


        {/* Notification */}
        <button className="notification-button">
          🔔

          <span className="notification-dot">
            3
          </span>
        </button>


        {/* Register Work */}
        <button
          className="register-header-button"
          onClick={() => {
            window.location.href = "/register-work";
          }}
        >
          <span>＋</span>
          Register New Work
        </button>

      </div>

    </header>
  );
}

export default Header;
import { NavLink } from "react-router-dom";

function Sidebar() {
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // User details
  const userName =
    user.name ||
    user.fullName ||
    "User";

  const userRole =
    user.role ||
    "Citizen";

  // First letter for avatar
  const firstLetter = userName
    .charAt(0)
    .toUpperCase();

  const menuItems = [
    {
      label: "Dashboard",
      icon: "⌂",
      path: "/dashboard",
    },
    {
      label: "Register Work",
      icon: "▣",
      path: "/register-work",
    },
    {
      label: "My Submissions",
      icon: "▤",
      path: "/my-submissions",
    },
    {
      label: "AI Verification",
      icon: "✦",
      path: "/ai-verification",
    },
    {
      label: "Map View",
      icon: "⌖",
      path: "/map",
    },
    {
      label: "Reports",
      icon: "▥",
      path: "/reports",
    },
    {
      label: "Analytics",
      icon: "◒",
      path: "/analytics",
    },
    {
      label: "Notifications",
      icon: "♢",
      path: "/notifications",
    },
    {
      label: "Settings",
      icon: "⚙",
      path: "/settings",
    },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">

        <div className="logo-shield">
          ✓
        </div>

        <div className="logo-text">
          <h2>
            Proof-of-<span>Work</span>
          </h2>

          <p>
            FOR PUBLIC SERVICES
          </p>
        </div>

      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => (

          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span className="sidebar-label">
              {item.label}
            </span>


            {/* Notification Badge */}
            {item.label === "Notifications" && (
              <span className="notification-badge">
                3
              </span>
            )}

          </NavLink>

        ))}

      </nav>


      {/* USER PROFILE */}
      <div className="sidebar-bottom">

        <div className="profile-card">

          {/* USER AVATAR */}
          <div className="profile-avatar">
            {firstLetter}
          </div>


          {/* USER INFORMATION */}
          <div className="profile-info">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>

        </div>


        {/* VIEW PROFILE */}
        <NavLink
          to="/settings"
          className="profile-button"
        >
          View Profile
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;
import { NavLink } from "react-router-dom";

function Sidebar() {
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
      label: "Citizen Verification",
      icon: "♟",
      path: "/citizen-verification",
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
            for Public Services
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

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">

            <strong>
              Anjali Yadav
            </strong>

            <span>
              Citizen
            </span>

          </div>

        </div>


        <button className="profile-button">
          View Profile
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
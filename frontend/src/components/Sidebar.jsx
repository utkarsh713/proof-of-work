import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  ScanSearch,
  MessageSquareText,
  Map,
  BarChart3,
  FileBarChart2,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/register-work", label: "Register Work", icon: FilePlus2 },
  { to: "/my-submissions", label: "My Submissions", icon: FileText },
  { to: "/ai-verification", label: "AI Verification", icon: ScanSearch },
  { to: "/citizen-feedback", label: "Citizen Feedback", icon: MessageSquareText },
  { to: "/map", label: "Map", icon: Map },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const displayName = currentUser?.name || currentUser?.fullName || "Guest";
  const displayRole = currentUser?.role || "Citizen";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">
        <div className="logo-shield">P/W</div>

        <div className="logo-text">
          <h2>
            PROOF<span>/WORK</span>
          </h2>

          <p>Public Accountability</p>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">
              <Icon size={18} />
            </span>

            <span className="sidebar-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* PROFILE */}

      <div className="sidebar-bottom">
        <div className="profile-card">
          <div className="profile-avatar">{initial}</div>

          <div className="profile-info">
            <strong>{displayName}</strong>
            <span>{displayRole}</span>
          </div>
        </div>

        <button
          type="button"
          className="profile-button"
          onClick={() => navigate("/profile")}
        >
          View Profile
        </button>
      </div>

    </aside>
  );
}

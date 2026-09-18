import React, { useEffect, useState } from "react";
import "../index.css";

import {
  User,
  Bell,
  Shield,
  Activity,
  Camera,
  Check,
  Lock,
  Mail,
  Smartphone,
  Eye,
  Moon,
  Sun,
  Monitor,
  Save,
  ChevronRight,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState({
    name: "User",
    email: "",
    phone: "",
    location: "",
  });

  const [notifications, setNotifications] = useState({
    project: true,
    verification: true,
    email: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    visibility: true,
  });

  const [theme, setTheme] = useState("system");
  const [saved, setSaved] = useState(false);

  // LOAD LOGGED-IN USER
  useEffect(() => {
    try {
      const savedUser =
        JSON.parse(localStorage.getItem("currentUser")) ||
        JSON.parse(localStorage.getItem("user"));

      if (savedUser) {
        setUser({
          name:
            savedUser.name ||
            savedUser.fullName ||
            savedUser.username ||
            "User",

          email: savedUser.email || "",

          phone: savedUser.phone || "",

          location:
            savedUser.location ||
            savedUser.address ||
            "",
        });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  // SAVE PROFILE
  const handleSaveProfile = () => {
    try {
      const currentUser =
        JSON.parse(localStorage.getItem("currentUser")) || {};

      const updatedUser = {
        ...currentUser,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const updateNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateSecurity = (key) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Activity,
    },
  ];

  const Toggle = ({ enabled, onClick }) => (
    <button
      type="button"
      className={`settings-toggle ${
        enabled ? "enabled" : ""
      }`}
      onClick={onClick}
    >
      <span />
    </button>
  );

  return (
    <div className="settings-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="settings-sidebar">

        {/* USER */}

        <div className="settings-user">

          <div className="settings-avatar">

            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}

            <button
              type="button"
              className="camera-btn"
            >
              <Camera size={16} />
            </button>

          </div>

          <div>

            <h3>{user.name}</h3>

            <p>Citizen Account</p>

          </div>

        </div>

        <div className="settings-divider" />

        {/* MENU */}

        <nav className="settings-nav">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`settings-nav-item ${
                  activeTab === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(item.id)
                }
              >

                <Icon size={22} />

                <span>
                  {item.label}
                </span>

                {activeTab === item.id && (
                  <ChevronRight
                    className="nav-arrow"
                    size={20}
                  />
                )}

              </button>
            );
          })}

        </nav>

        {/* BOTTOM */}

        <div className="settings-secured">

          <div>
            <Lock size={16} />
            <strong>Data secured</strong>
          </div>

          <p>
            Proof-of-Work Security System
          </p>

        </div>

      </aside>


      {/* ================= MAIN PANEL ================= */}

      <main className="settings-panel">


        {/* =====================================================
            PROFILE
        ===================================================== */}

        {activeTab === "profile" && (

          <section className="settings-content">

            <div className="settings-header">

              <span>
                PERSONAL INFORMATION
              </span>

              <h1>
                Profile Settings
              </h1>

              <p>
                Manage your account information and identity.
              </p>

            </div>


            <div className="profile-form">

              <div className="settings-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                />

              </div>


              <div className="settings-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter your email"
                />

              </div>


              <div className="settings-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+91 00000 00000"
                />

              </div>


              <div className="settings-field">

                <label>
                  Primary Location
                </label>

                <input
                  type="text"
                  value={user.location}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter your location"
                />

              </div>

            </div>


            <div className="settings-footer">

              <p>

                <Check size={18} />

                {saved
                  ? "Changes saved successfully"
                  : "Changes are saved securely"}

              </p>


              <button
                className="save-settings-btn"
                onClick={handleSaveProfile}
              >

                <Save size={16} />

                SAVE CHANGES

              </button>

            </div>

          </section>

        )}


        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        {activeTab === "notifications" && (

          <section className="settings-content">

            <div className="settings-header center-header">

              <div className="big-settings-icon">
                <Bell size={42} />
              </div>

              <h1>
                Notification Settings
              </h1>

              <p>
                Choose what updates you want to receive.
              </p>

            </div>


            <div className="settings-options">

              <div className="toggle-row">

                <div className="toggle-left">

                  <div className="toggle-icon">
                    <Activity size={22} />
                  </div>

                  <div>

                    <h3>
                      Project Updates
                    </h3>

                    <p>
                      Get updates about your public work projects.
                    </p>

                  </div>

                </div>

                <Toggle
                  enabled={notifications.project}
                  onClick={() =>
                    updateNotification("project")
                  }
                />

              </div>


              <div className="toggle-row">

                <div className="toggle-left">

                  <div className="toggle-icon">
                    <Check size={22} />
                  </div>

                  <div>

                    <h3>
                      Verification Updates
                    </h3>

                    <p>
                      Receive AI and verification status updates.
                    </p>

                  </div>

                </div>

                <Toggle
                  enabled={notifications.verification}
                  onClick={() =>
                    updateNotification("verification")
                  }
                />

              </div>


              <div className="toggle-row">

                <div className="toggle-left">

                  <div className="toggle-icon">
                    <Mail size={22} />
                  </div>

                  <div>

                    <h3>
                      Email Notifications
                    </h3>

                    <p>
                      Receive important updates by email.
                    </p>

                  </div>

                </div>

                <Toggle
                  enabled={notifications.email}
                  onClick={() =>
                    updateNotification("email")
                  }
                />

              </div>

            </div>

          </section>

        )}


        {/* =====================================================
            SECURITY
        ===================================================== */}

        {activeTab === "security" && (

          <section className="settings-content">

            <div className="settings-header center-header">

              <div className="big-settings-icon">
                <Shield size={42} />
              </div>

              <h1>
                Security Settings
              </h1>

              <p>
                Manage your account security preferences.
              </p>

            </div>


            <div className="settings-options">

              <div className="toggle-row">

                <div className="toggle-left">

                  <div className="toggle-icon">
                    <Smartphone size={22} />
                  </div>

                  <div>

                    <h3>
                      Two-Factor Authentication
                    </h3>

                    <p>
                      Add an extra layer of security to your account.
                    </p>

                  </div>

                </div>

                <Toggle
                  enabled={security.twoFactor}
                  onClick={() =>
                    updateSecurity("twoFactor")
                  }
                />

              </div>


              <div className="toggle-row">

                <div className="toggle-left">

                  <div className="toggle-icon">
                    <Bell size={22} />
                  </div>

                  <div>

                    <h3>
                      Login Alerts
                    </h3>

                    <p>
                      Get notified when a new device signs in.
                    </p>

                  </div>

                </div>

                <Toggle
                  enabled={security.loginAlerts}
                  onClick={() =>
                    updateSecurity("loginAlerts")
                  }
                />

              </div>


              <div className="toggle-row">

                <div className="toggle-left">

                  <div className="toggle-icon">
                    <Eye size={22} />
                  </div>

                  <div>

                    <h3>
                      Account Visibility
                    </h3>

                    <p>
                      Control how your profile is visible.
                    </p>

                  </div>

                </div>

                <Toggle
                  enabled={security.visibility}
                  onClick={() =>
                    updateSecurity("visibility")
                  }
                />

              </div>

            </div>

          </section>

        )}


        {/* =====================================================
            PREFERENCES
        ===================================================== */}

        {activeTab === "preferences" && (

          <section className="settings-content">

            <div className="settings-header center-header">

              <div className="big-settings-icon">
                <Activity size={42} />
              </div>

              <h1>
                Preferences
              </h1>

              <p>
                Customize your Proof-of-Work experience.
              </p>

            </div>


            <div className="preference-theme">

              <div>

                <h3>
                  Appearance
                </h3>

                <p>
                  Choose how Proof-of-Work looks for you.
                </p>

              </div>


              <div className="theme-options">

                <button
                  type="button"
                  className={`theme-btn ${
                    theme === "light"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTheme("light")
                  }
                >

                  <Sun size={18} />

                  Light

                </button>


                <button
                  type="button"
                  className={`theme-btn ${
                    theme === "dark"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTheme("dark")
                  }
                >

                  <Moon size={18} />

                  Dark

                </button>


                <button
                  type="button"
                  className={`theme-btn ${
                    theme === "system"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTheme("system")
                  }
                >

                  <Monitor size={18} />

                  System

                </button>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}
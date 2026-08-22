import { useState } from "react";
import {
  FiUser,
  FiBell,
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMoon,
  FiSun,
  FiGlobe,
  FiMapPin,
  FiCamera,
  FiChevronRight,
  FiCheck,
  FiTrash2,
  FiSave,
  FiSmartphone,
  FiMail,
  FiDatabase,
  FiActivity,
  FiZap,
} from "react-icons/fi";

import "../index.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    verificationAlerts: true,
    citizenUpdates: false,
    locationAccess: true,
    darkMode: true,
    twoFactor: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSetting = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <FiUser />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell />,
    },
    {
      id: "security",
      label: "Security",
      icon: <FiShield />,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <FiActivity />,
    },
  ];

  return (
    <div className="settings-page">

      {/* HERO */}

      <section className="settings-hero">

        <div className="settings-hero-content">

          <div className="settings-eyebrow">
            <FiZap />
            PLATFORM CONTROL CENTER
          </div>

          <h1>
            Settings &
            <span> Preferences.</span>
          </h1>

          <p>
            Manage your Proof-of-Work account, security,
            notifications and platform experience.
          </p>

        </div>


        <div className="settings-status-card">

          <div className="settings-status-icon">
            <FiShield />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>
            <strong>Protected</strong>
          </div>

          <div className="status-pulse"></div>

        </div>

      </section>


      <div className="settings-layout">

        {/* SIDEBAR */}

        <aside className="settings-navigation">

          <div className="settings-user-preview">

            <div className="settings-avatar">
              A
              <button>
                <FiCamera />
              </button>
            </div>

            <div>
              <h3>Anjali Yadav</h3>
              <p>Citizen Account</p>
            </div>

          </div>


          <div className="settings-tabs">

            {tabs.map((tab) => (

              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >

                <span className="settings-tab-icon">
                  {tab.icon}
                </span>

                {tab.label}

                {activeTab === tab.id && (
                  <FiChevronRight className="tab-arrow" />
                )}

              </button>

            ))}

          </div>


          <div className="settings-sidebar-bottom">

            <div>
              <FiDatabase />
              <span>
                Data secured
              </span>
            </div>

            <small>
              Proof-of-Work Security System
            </small>

          </div>

        </aside>


        {/* CONTENT */}

        <main className="settings-content">

          {/* PROFILE */}

          {activeTab === "profile" && (

            <div className="settings-panel">

              <div className="settings-panel-header">

                <div>
                  <p className="section-label">
                    PERSONAL INFORMATION
                  </p>

                  <h2>
                    Profile Settings
                  </h2>

                  <p>
                    Manage your account information and identity.
                  </p>
                </div>

                <div className="panel-header-icon">
                  <FiUser />
                </div>

              </div>


              <div className="settings-form-grid">

                <div className="settings-input-group">

                  <label>
                    Full Name
                  </label>

                  <div className="settings-input">
                    <FiUser />

                    <input
                      type="text"
                      defaultValue="Anjali Yadav"
                    />
                  </div>

                </div>


                <div className="settings-input-group">

                  <label>
                    Email Address
                  </label>

                  <div className="settings-input">
                    <FiMail />

                    <input
                      type="email"
                      defaultValue="anjali@example.com"
                    />
                  </div>

                </div>


                <div className="settings-input-group">

                  <label>
                    Phone Number
                  </label>

                  <div className="settings-input">
                    <FiSmartphone />

                    <input
                      type="text"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                </div>


                <div className="settings-input-group">

                  <label>
                    Primary Location
                  </label>

                  <div className="settings-input">
                    <FiMapPin />

                    <input
                      type="text"
                      placeholder="Delhi, India"
                    />
                  </div>

                </div>

              </div>


              <div className="settings-save-row">

                <div>
                  <FiCheck />
                  Changes are saved securely
                </div>

                <button
                  className="settings-save-btn"
                  onClick={handleSave}
                >
                  <FiSave />

                  {saved
                    ? "SAVED SUCCESSFULLY"
                    : "SAVE CHANGES"}
                </button>

              </div>

            </div>

          )}


          {/* NOTIFICATIONS */}

          {activeTab === "notifications" && (

            <div className="settings-panel">

              <div className="settings-panel-header">

                <div>
                  <p className="section-label">
                    NOTIFICATION CENTER
                  </p>

                  <h2>
                    Notification Preferences
                  </h2>

                  <p>
                    Control how you receive important updates.
                  </p>
                </div>

                <div className="panel-header-icon">
                  <FiBell />
                </div>

              </div>


              <div className="settings-options-list">

                <SettingToggle
                  icon={<FiMail />}
                  title="Email Notifications"
                  description="Receive important updates through email."
                  enabled={settings.emailNotifications}
                  onToggle={() =>
                    toggleSetting("emailNotifications")
                  }
                />

                <SettingToggle
                  icon={<FiSmartphone />}
                  title="Push Notifications"
                  description="Receive instant platform alerts."
                  enabled={settings.pushNotifications}
                  onToggle={() =>
                    toggleSetting("pushNotifications")
                  }
                />

                <SettingToggle
                  icon={<FiCheck />}
                  title="Verification Updates"
                  description="Get notified when work verification changes."
                  enabled={settings.verificationAlerts}
                  onToggle={() =>
                    toggleSetting("verificationAlerts")
                  }
                />

                <SettingToggle
                  icon={<FiUser />}
                  title="Citizen Activity"
                  description="Receive updates about citizen verification."
                  enabled={settings.citizenUpdates}
                  onToggle={() =>
                    toggleSetting("citizenUpdates")
                  }
                />

              </div>

            </div>

          )}


          {/* SECURITY */}

          {activeTab === "security" && (

            <div className="settings-panel">

              <div className="settings-panel-header">

                <div>
                  <p className="section-label">
                    ACCOUNT SECURITY
                  </p>

                  <h2>
                    Security & Privacy
                  </h2>

                  <p>
                    Protect your account and manage access.
                  </p>
                </div>

                <div className="panel-header-icon security-icon">
                  <FiShield />
                </div>

              </div>


              <div className="security-card">

                <div className="security-card-icon">
                  <FiLock />
                </div>

                <div className="security-card-content">

                  <h3>
                    Change Password
                  </h3>

                  <p>
                    Use a strong password to keep your account secure.
                  </p>

                  <div className="password-settings-input">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                    />

                    <button
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword
                        ? <FiEyeOff />
                        : <FiEye />
                      }
                    </button>

                  </div>

                </div>

              </div>


              <div className="settings-options-list">

                <SettingToggle
                  icon={<FiShield />}
                  title="Two-Factor Authentication"
                  description="Add an additional security layer."
                  enabled={settings.twoFactor}
                  onToggle={() =>
                    toggleSetting("twoFactor")
                  }
                />

                <SettingToggle
                  icon={<FiMapPin />}
                  title="Location Access"
                  description="Allow GPS verification for evidence."
                  enabled={settings.locationAccess}
                  onToggle={() =>
                    toggleSetting("locationAccess")
                  }
                />

              </div>


              <div className="danger-zone">

                <div>

                  <span>
                    <FiTrash2 />
                    DANGER ZONE
                  </span>

                  <h3>
                    Delete Account
                  </h3>

                  <p>
                    Permanently remove your account and stored data.
                  </p>

                </div>

                <button>
                  DELETE ACCOUNT
                </button>

              </div>

            </div>

          )}


          {/* PREFERENCES */}

          {activeTab === "preferences" && (

            <div className="settings-panel">

              <div className="settings-panel-header">

                <div>
                  <p className="section-label">
                    PLATFORM EXPERIENCE
                  </p>

                  <h2>
                    Preferences
                  </h2>

                  <p>
                    Customize how Proof-of-Work works for you.
                  </p>
                </div>

                <div className="panel-header-icon">
                  <FiActivity />
                </div>

              </div>


              <div className="settings-options-list">

                <SettingToggle
                  icon={
                    settings.darkMode
                      ? <FiMoon />
                      : <FiSun />
                  }
                  title="Dark Interface"
                  description="Use the cinematic dark Proof-of-Work theme."
                  enabled={settings.darkMode}
                  onToggle={() =>
                    toggleSetting("darkMode")
                  }
                />

                <div className="setting-option language-option">

                  <div className="setting-option-left">

                    <div className="setting-option-icon">
                      <FiGlobe />
                    </div>

                    <div>
                      <h3>
                        Platform Language
                      </h3>

                      <p>
                        Select your preferred language.
                      </p>
                    </div>

                  </div>

                  <select>
                    <option>
                      English
                    </option>

                    <option>
                      Hindi
                    </option>

                  </select>

                </div>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}


function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onToggle,
}) {
  return (

    <div className="setting-option">

      <div className="setting-option-left">

        <div className="setting-option-icon">
          {icon}
        </div>

        <div>
          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>
        </div>

      </div>


      <button
        className={`settings-toggle ${
          enabled ? "enabled" : ""
        }`}
        onClick={onToggle}
      >

        <span></span>

      </button>

    </div>

  );
}

export default Settings;
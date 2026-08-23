import React, { useState } from "react";
import { Save, Check } from "lucide-react";
import "./ProfileSettings.css";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    fullName: "Anjali Yadav",
    email: "anjali@example.com",
    phone: "+91 00000 00000",
    location: "Delhi, India",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="profile-page">
      <main className="profile-container">
        <div className="profile-header">
          <span className="eyebrow">PERSONAL INFORMATION</span>

          <h1>Profile Settings</h1>

          <p>Manage your account information and identity.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Primary Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-footer">
            <div className="secure-status">
              <Check size={18} />
              <span>
                {saved ? "Changes saved successfully" : "Changes are saved securely"}
              </span>
            </div>

            <button type="submit" className="save-button">
              <Save size={17} />
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
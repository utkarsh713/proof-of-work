import { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";

function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Get saved password
    const savedPassword = localStorage.getItem("userPassword");

    // If no password exists yet, create a demo password
    const actualPassword = savedPassword || "123456";

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (currentPassword !== actualPassword) {
      setMessage("Current password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    // Save new password
    localStorage.setItem("userPassword", newPassword);

    setMessage("Password changed successfully!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="security-page">

      <div className="security-header">
        <p className="page-label">ACCOUNT SECURITY</p>

        <h1>Security & Privacy</h1>

        <p>
          Protect your account and manage access.
        </p>
      </div>


      {/* CHANGE PASSWORD */}
      <form
        className="change-password-card"
        onSubmit={handleChangePassword}
      >

        <div className="security-icon">
          <FiLock />
        </div>


        <div className="password-content">

          <h3>Change Password</h3>

          <p>
            Use a strong password to keep your account secure.
          </p>


          {/* CURRENT PASSWORD */}
          <div className="password-input-wrapper">

            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="password-eye"
              onClick={() =>
                setShowCurrent(!showCurrent)
              }
            >
              {showCurrent ? <FiEyeOff /> : <FiEye />}
            </button>

          </div>


          {/* NEW PASSWORD */}
          <div className="password-input-wrapper">

            <input
              type={showNew ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="password-eye"
              onClick={() =>
                setShowNew(!showNew)
              }
            >
              {showNew ? <FiEyeOff /> : <FiEye />}
            </button>

          </div>


          {/* CONFIRM PASSWORD */}
          <input
            className="confirm-password-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />


          {message && (
            <div
              className={`password-message ${
                message.includes("successfully")
                  ? "success"
                  : "error"
              }`}
            >
              {message.includes("successfully")
                ? <FiCheck />
                : <FiX />}

              {message}
            </div>
          )}


          <button
            type="submit"
            className="change-password-btn"
          >
            <FiLock />
            Change Password
          </button>

        </div>

      </form>

    </div>
  );
}

export default Security;
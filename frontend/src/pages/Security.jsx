import { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";

import { changePassword } from "../api/authApi";
import { EndpointNotConfiguredError } from "../api/apiClient";

function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" | "success"
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all password fields.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      // Real password change happens on the Spring Boot
      // backend — the frontend never validates the current
      // password itself. See src/api/authApi.js for the
      // integration point once the backend endpoint exists.
      await changePassword({ currentPassword, newPassword });

      setMessage("Password changed successfully!");
      setMessageType("success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);

      if (err instanceof EndpointNotConfiguredError) {
        setMessage(
          "Password change isn't connected to a backend yet."
        );
      } else {
        setMessage(err?.message || "Could not change password.");
      }

      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
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
              className={`password-message ${messageType}`}
            >
              {messageType === "success"
                ? <FiCheck />
                : <FiX />}

              {message}
            </div>
          )}


          <button
            type="submit"
            className="change-password-btn"
            disabled={submitting}
          >
            <FiLock />
            {submitting ? "Changing..." : "Change Password"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default Security;

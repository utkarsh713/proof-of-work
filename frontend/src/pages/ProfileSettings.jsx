import React, { useEffect, useState } from "react";
import { Save, Check, X } from "lucide-react";
import "./ProfileSettings.css";

const API_BASE_URL = "http://localhost:8080";


// =========================================================
// GET LOGGED-IN USER FROM LOCAL STORAGE
// =========================================================

function getStoredUser() {
  try {
    const raw = localStorage.getItem("currentUser");

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error("Unable to read currentUser:", error);
    return null;
  }
}


// =========================================================
// PROFILE SETTINGS
// =========================================================

export default function ProfileSettings() {

  // -------------------------------------------------------
  // PROFILE STATE
  // -------------------------------------------------------

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });


  // -------------------------------------------------------
  // USER ID
  // -------------------------------------------------------

  const [userId, setUserId] = useState(null);


  // -------------------------------------------------------
  // UI STATES
  // -------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");


  // =======================================================
  // LOAD PROFILE FROM BACKEND
  // =======================================================

  useEffect(() => {

    const storedUser = getStoredUser();

    if (!storedUser || !storedUser.id) {

      setError(
        "User session not found. Please login again."
      );

      setLoading(false);

      return;
    }


    const id = storedUser.id;

    setUserId(id);


    // -----------------------------------------------------
    // GET USER FROM SPRING BOOT
    // -----------------------------------------------------

    fetch(`${API_BASE_URL}/api/users/${id}`)
      .then(async (response) => {

        const data = await response.json();

        if (!response.ok) {

          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        return data;
      })

      .then((data) => {

        setProfile({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
        });

        setError("");
      })

      .catch((err) => {

        console.error("Profile loading error:", err);

        setError(
          err.message || "Unable to load profile."
        );
      })

      .finally(() => {

        setLoading(false);
      });

  }, []);


  // =======================================================
  // HANDLE INPUT CHANGE
  // =======================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };


  // =======================================================
  // SAVE PROFILE
  // =======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaved(false);
    setError("");


    // -----------------------------------------------------
    // CHECK USER ID
    // -----------------------------------------------------

    if (!userId) {

      setError(
        "User session not found. Please login again."
      );

      return;
    }


    // -----------------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------------

    if (!profile.fullName.trim()) {

      setError("Full name is required.");

      return;
    }


    if (!profile.email.trim()) {

      setError("Email address is required.");

      return;
    }


    setSaving(true);


    try {

      // ---------------------------------------------------
      // SEND UPDATE TO SPRING BOOT
      // ---------------------------------------------------

      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: profile.fullName.trim(),
            email: profile.email.trim(),
            phone: profile.phone.trim(),
            location: profile.location.trim(),
          }),
        }
      );


      const data = await response.json();


      // ---------------------------------------------------
      // HANDLE BACKEND ERROR
      // ---------------------------------------------------

      if (!response.ok) {

        throw new Error(
          data.message || "Failed to update profile."
        );
      }


      // ---------------------------------------------------
      // UPDATE FRONTEND PROFILE WITH BACKEND RESPONSE
      // ---------------------------------------------------

      if (data.user) {

        const updatedProfile = {
          fullName: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
        };

        setProfile(updatedProfile);


        // -----------------------------------------------
        // UPDATE LOCAL STORAGE
        // -----------------------------------------------

        const currentUser = getStoredUser();

        if (currentUser) {

          const updatedUser = {
            ...currentUser,

            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            location: data.user.location,
            role: data.user.role,
          };

          localStorage.setItem(
            "currentUser",
            JSON.stringify(updatedUser)
          );
        }
      }


      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------

      setSaved(true);
      setError("");

    } catch (err) {

      console.error("Profile update error:", err);

      setSaved(false);

      setError(
        err.message || "Unable to update profile."
      );

    } finally {

      setSaving(false);
    }
  };


  // =======================================================
  // LOADING UI
  // =======================================================

  if (loading) {

    return (
      <div className="profile-page">

        <main className="profile-container">

          <div className="profile-header">

            <span className="eyebrow">
              PERSONAL INFORMATION
            </span>

            <h1>Profile Settings</h1>

            <p>
              Loading your account information...
            </p>

          </div>

        </main>

      </div>
    );
  }


  // =======================================================
  // MAIN UI
  // =======================================================

  return (

    <div className="profile-page">

      <main className="profile-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="profile-header">

          <span className="eyebrow">
            PERSONAL INFORMATION
          </span>

          <h1>
            Profile Settings
          </h1>

          <p>
            Manage your account information and identity.
          </p>

        </div>


        {/* =================================================
            PROFILE FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">


            {/* =============================================
                FULL NAME
            ============================================= */}

            <div className="input-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={saving}
              />

            </div>


            {/* =============================================
                EMAIL
            ============================================= */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={saving}
              />

            </div>


            {/* =============================================
                PHONE
            ============================================= */}

            <div className="input-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={saving}
              />

            </div>


            {/* =============================================
                LOCATION
            ============================================= */}

            <div className="input-group">

              <label>
                Primary Location
              </label>

              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Enter your location"
                disabled={saving}
              />

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="profile-footer">


            {/* =============================================
                STATUS MESSAGE
            ============================================= */}

            <div className="secure-status">

              {error ? (

                <>
                  <X size={18} />

                  <span>
                    {error}
                  </span>
                </>

              ) : saved ? (

                <>
                  <Check size={18} />

                  <span>
                    Changes saved successfully
                  </span>
                </>

              ) : (

                <>
                  <Check size={18} />

                  <span>
                    Your profile is connected to the backend
                  </span>
                </>

              )}

            </div>


            {/* =============================================
                SAVE BUTTON
            ============================================= */}

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >

              <Save size={17} />

              <span>
                {saving
                  ? "SAVING..."
                  : "SAVE CHANGES"
                }
              </span>

            </button>

          </div>

        </form>

      </main>

    </div>
  );
} 
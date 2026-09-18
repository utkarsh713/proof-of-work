import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { createWork } from "../api/workApi";

export default function RegisterWork() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  // =========================
  // FORM STATE
  // =========================

  const [workName, setWorkName] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  // =========================
  // EVIDENCE STATE
  // =========================

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);

  // =========================
  // GPS STATE
  // =========================

  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // =========================
  // SUBMIT STATE
  // =========================

  const [submitting, setSubmitting] = useState(false);

  // =========================
  // FILE TO BASE64
  // =========================

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

  // =========================
  // BEFORE IMAGE
  // =========================

  const handleBeforeImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Before image must be smaller than 5MB.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setBeforeImage(base64);
      setBeforePreview(base64);
    } catch (error) {
      console.error(error);
      alert("Unable to load the Before image.");
    }
  };

  // =========================
  // AFTER IMAGE
  // =========================

  const handleAfterImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("After image must be smaller than 5MB.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setAfterImage(base64);
      setAfterPreview(base64);
    } catch (error) {
      console.error(error);
      alert("Unable to load the After image.");
    }
  };

  // =========================
  // GPS
  // =========================

  const handleCaptureGPS = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setGpsLoading(false);
      },
      (error) => {
        console.error(error);

        setGpsLoading(false);

        setLocationError(
          "Unable to capture location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!workName.trim()) {
      alert("Please enter the work name.");
      return;
    }

    if (!department) {
      alert("Please select a department.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!workLocation.trim()) {
      alert("Please enter the work location.");
      return;
    }

    if (!estimatedCost) {
      alert("Please enter the estimated cost.");
      return;
    }

    if (!beforeImage) {
      alert("Please upload the Before Work image.");
      return;
    }

    if (!afterImage) {
      alert("Please upload the After Work image.");
      return;
    }

    if (!gpsLocation) {
      alert("Please capture the GPS location.");
      return;
    }

    setSubmitting(true);

    try {
      // Send only user-entered data. The backend assigns
      // the work id and the initial verification status —
      // the frontend never decides that.
      const payload = {
        title: workName.trim(),
        department,
        description: description.trim(),
        location: workLocation.trim(),
        estimatedCost: Number(estimatedCost),
        beforeImage,
        afterImage,
        gpsLocation,
      };

      const createdWork = await createWork(payload);

      // Notify other components (e.g. Dashboard) that a
      // work was created so they can refetch from the API.
      window.dispatchEvent(new Event("workRegistered"));

      navigate("/dashboard", {
        state: { justRegistered: createdWork },
      });
    } catch (error) {
      console.error("Register work error:", error);

      setSubmitError(
        error?.message ||
          "Could not register the work. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="work-page">

      <form
        className="work-card"
        onSubmit={handleSubmit}
      >

        {/* =========================
            TOP BAR
        ========================= */}

        <div className="work-topbar">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <span className="secure-label">
            SECURE PUBLIC RECORD
          </span>

        </div>

        {/* =========================
            HEADER
        ========================= */}

        <div className="work-header">

          <div>
            <p className="page-label">
              PUBLIC WORK REGISTRATION
            </p>

            <h1>
              Register Public Work
            </h1>

            <p>
              Submit project information,
              evidence and location proof.
            </p>
          </div>

          <div className="work-icon">
            ✓
          </div>

        </div>

        {submitError && (
          <div className="gps-error" role="alert">
            {submitError}
          </div>
        )}

        {/* =========================
            STEP 01
        ========================= */}

        <section className="work-section">

          <div className="work-section-heading">

            <div className="work-section-number">
              01
            </div>

            <div>
              <h2>
                Project Information
              </h2>

              <p>
                Enter the basic details of
                the public work.
              </p>
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="workName">
                Work Name
              </label>

              <input
                id="workName"
                type="text"
                placeholder="e.g. Road Reconstruction"
                value={workName}
                onChange={(e) =>
                  setWorkName(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="department">
                Department
              </label>

              <select
                id="department"
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >

                <option value="">
                  Select Department
                </option>

                <option value="Public Works Department">
                  Public Works Department
                </option>

                <option value="Municipal Corporation">
                  Municipal Corporation
                </option>

                <option value="Water Department">
                  Water Department
                </option>

                <option value="Electricity Department">
                  Electricity Department
                </option>

              </select>

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Describe the public work..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="workLocation">
                Work Location
              </label>

              <input
                id="workLocation"
                type="text"
                placeholder="e.g. Sarita Vihar, Delhi"
                value={workLocation}
                onChange={(e) =>
                  setWorkLocation(e.target.value)
                }
              />

            </div>

          </div>

          <div className="form-group">

            <label htmlFor="estimatedCost">
              Estimated Cost
            </label>

            <div className="cost-input">

              <span>₹</span>

              <input
                id="estimatedCost"
                type="number"
                min="0"
                placeholder="Enter project cost"
                value={estimatedCost}
                onChange={(e) =>
                  setEstimatedCost(e.target.value)
                }
              />

            </div>

          </div>

        </section>

        {/* =========================
            STEP 02
        ========================= */}

        <section className="work-section">

          <div className="work-section-heading">

            <div className="work-section-number">
              02
            </div>

            <div>
              <h2>
                Visual Evidence
              </h2>

              <p>
                Upload Before and After proof.
              </p>
            </div>

          </div>

          <div className="evidence-upload-grid">

            {/* BEFORE */}

            <div className="evidence-upload-card">

              <div className="upload-card-header">

                <span>
                  BEFORE WORK
                </span>

                <span className="upload-type before">
                  BEFORE
                </span>

              </div>

              {beforePreview ? (
                <div className="upload-preview">

                  <img
                    src={beforePreview}
                    alt="Before work preview"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setBeforeImage(null);
                      setBeforePreview(null);
                    }}
                  >
                    Remove
                  </button>

                </div>
              ) : (
                <label
                  className="upload-dropzone"
                  htmlFor="before-file"
                >

                  <div className="upload-big-icon">
                    ↑
                  </div>

                  <strong>
                    Upload Before Photo
                  </strong>

                  <span>
                    JPG, PNG, WEBP · Max 5MB
                  </span>

                  <span className="choose-file">
                    Choose File
                  </span>

                </label>
              )}

              <input
                id="before-file"
                type="file"
                accept="image/*"
                onChange={handleBeforeImage}
                hidden
              />

            </div>

            {/* AFTER */}

            <div className="evidence-upload-card">

              <div className="upload-card-header">

                <span>
                  AFTER WORK
                </span>

                <span className="upload-type after">
                  AFTER
                </span>

              </div>

              {afterPreview ? (
                <div className="upload-preview">

                  <img
                    src={afterPreview}
                    alt="After work preview"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setAfterImage(null);
                      setAfterPreview(null);
                    }}
                  >
                    Remove
                  </button>

                </div>
              ) : (
                <label
                  className="upload-dropzone"
                  htmlFor="after-file"
                >

                  <div className="upload-big-icon">
                    ↑
                  </div>

                  <strong>
                    Upload After Photo
                  </strong>

                  <span>
                    JPG, PNG, WEBP · Max 5MB
                  </span>

                  <span className="choose-file">
                    Choose File
                  </span>

                </label>
              )}

              <input
                id="after-file"
                type="file"
                accept="image/*"
                onChange={handleAfterImage}
                hidden
              />

            </div>

          </div>

        </section>

        {/* =========================
            STEP 03
        ========================= */}

        <section className="work-section">

          <div className="work-section-heading">

            <div className="work-section-number">
              03
            </div>

            <div>
              <h2>
                Location Verification
              </h2>

              <p>
                Capture the real-world GPS
                coordinates of the work.
              </p>
            </div>

          </div>

          <div className="gps-card">

            <div className="gps-main">

              <div className="gps-icon">
                📍
              </div>

              <div>

                <h3>
                  GPS Location
                </h3>

                {gpsLocation ? (
                  <p>
                    Location captured successfully.
                    <br />

                    <strong>
                      {gpsLocation.latitude.toFixed(6)}
                      {" , "}
                      {gpsLocation.longitude.toFixed(6)}
                    </strong>
                  </p>
                ) : (
                  <p>
                    Capture your current location
                    to verify the work site.
                  </p>
                )}

              </div>

            </div>

            <button
              type="button"
              className="location-button"
              onClick={handleCaptureGPS}
              disabled={gpsLoading}
            >
              {gpsLoading
                ? "Capturing..."
                : gpsLocation
                ? "Location Captured"
                : "Capture GPS"}
            </button>

          </div>

          {locationError && (
            <div className="gps-error">
              {locationError}
            </div>
          )}

        </section>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="register-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="register-work-button"
            disabled={submitting}
          >
            {submitting
              ? "Registering..."
              : "Register Work"}

            <span>→</span>
          </button>

        </div>

      </form>

    </div>
  );
}
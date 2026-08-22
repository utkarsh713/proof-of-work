import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../index.css";

function RegisterWork() {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const [gpsLocation, setGpsLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const [workName, setWorkName] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  // =========================
  // GPS
  // =========================

  const captureGPS = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "GPS is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocationError(
          "Unable to get your location. Please allow location access."
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
  // BEFORE IMAGE
  // =========================

  const handleBeforeImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check image size
    if (file.size > 10 * 1024 * 1024) {
      alert("Before image must be smaller than 10MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setBeforeImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // AFTER IMAGE
  // =========================

  const handleAfterImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check image size
    if (file.size > 10 * 1024 * 1024) {
      alert("After image must be smaller than 10MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAfterImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation

    if (!workName.trim()) {
      alert("Please enter the work name.");
      return;
    }

    if (!department) {
      alert("Please select a department.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter the work description.");
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
      alert("Please upload the Before Work photo.");
      return;
    }

    if (!afterImage) {
      alert("Please upload the After Work photo.");
      return;
    }

    if (!gpsLocation) {
      alert("Please capture your GPS location.");
      return;
    }

    // Create work object

    const work = {
      id: `PW-${Date.now()}`,

      workName,
      department,
      description,
      workLocation,
      estimatedCost,

      gpsLocation,

      beforeImage,
      afterImage,

      status: "Under Verification",

      aiScore: 94,

      createdAt: new Date().toISOString(),
    };

    // Save to browser storage

    localStorage.setItem(
      "registeredWork",
      JSON.stringify(work)
    );

    // Also keep a submissions list

    const existingSubmissions =
      JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );

    existingSubmissions.unshift(work);

    localStorage.setItem(
      "submissions",
      JSON.stringify(existingSubmissions)
    );

    // Go to dashboard

    navigate("/dashboard");
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="work-page">

      <div className="work-card">

        {/* =========================
            TOP BAR
        ========================== */}

        <div className="work-topbar">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <span className="secure-label">
            🛡️ SECURE REGISTRATION
          </span>

        </div>


        {/* =========================
            HEADER
        ========================== */}

        <div className="work-header">

          <div>

            <p className="page-label">
              PUBLIC SERVICE
            </p>

            <h1>
              Register Public Work
            </h1>

            <p>
              Submit details and evidence to verify
              a public project.
            </p>

          </div>

          <div className="work-icon">
            🏗️
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* =========================
              WORK INFORMATION
          ========================== */}

          <div className="work-section">

            <div className="work-section-heading">

              <div className="work-section-number">
                01
              </div>

              <div>

                <h2>
                  Work Information
                </h2>

                <p>
                  Tell us about the public work.
                </p>

              </div>

            </div>


            <div className="form-row">

              {/* WORK NAME */}

              <div className="form-group">

                <label>
                  Work Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Road Repair - Sector 18"
                  value={workName}
                  onChange={(e) =>
                    setWorkName(e.target.value)
                  }
                  required
                />

              </div>


              {/* DEPARTMENT */}

              <div className="form-group">

                <label>
                  Department
                </label>

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Select department
                  </option>

                  <option value="Municipal Corporation">
                    Municipal Corporation
                  </option>

                  <option value="Public Works Department">
                    Public Works Department
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


            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Work Description
              </label>

              <textarea
                rows="4"
                placeholder="Describe the public work..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

            </div>


            {/* LOCATION + COST */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Enter work location"
                  value={workLocation}
                  onChange={(e) =>
                    setWorkLocation(e.target.value)
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Estimated Cost
                </label>

                <div className="cost-input">

                  <span>₹</span>

                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={estimatedCost}
                    onChange={(e) =>
                      setEstimatedCost(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =========================
              EVIDENCE
          ========================== */}

          <div className="work-section">

            <div className="work-section-heading">

              <div className="work-section-number">
                02
              </div>

              <div>

                <h2>
                  Evidence
                </h2>

                <p>
                  Upload before and after evidence.
                </p>

              </div>

            </div>


            <div className="evidence-upload-grid">

              {/* =========================
                  BEFORE
              ========================== */}

              <div className="evidence-upload-card">

                <div className="upload-card-header">

                  <span className="upload-type before">
                    BEFORE
                  </span>

                  <span>
                    Required
                  </span>

                </div>


                {beforeImage ? (

                  <div className="upload-preview">

                    <img
                      src={beforeImage}
                      alt="Before work"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setBeforeImage(null)
                      }
                    >
                      Remove
                    </button>

                  </div>

                ) : (

                  <label className="upload-dropzone">

                    <div className="upload-big-icon">
                      📷
                    </div>

                    <strong>
                      Upload Before Photo
                    </strong>

                    <span>
                      JPG, PNG up to 10MB
                    </span>

                    <span className="choose-file">
                      Choose File
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleBeforeImage}
                    />

                  </label>

                )}

              </div>


              {/* =========================
                  AFTER
              ========================== */}

              <div className="evidence-upload-card">

                <div className="upload-card-header">

                  <span className="upload-type after">
                    AFTER
                  </span>

                  <span>
                    Required
                  </span>

                </div>


                {afterImage ? (

                  <div className="upload-preview">

                    <img
                      src={afterImage}
                      alt="After work"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setAfterImage(null)
                      }
                    >
                      Remove
                    </button>

                  </div>

                ) : (

                  <label className="upload-dropzone">

                    <div className="upload-big-icon">
                      📸
                    </div>

                    <strong>
                      Upload After Photo
                    </strong>

                    <span>
                      JPG, PNG up to 10MB
                    </span>

                    <span className="choose-file">
                      Choose File
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAfterImage}
                    />

                  </label>

                )}

              </div>

            </div>

          </div>


          {/* =========================
              GPS
          ========================== */}

          <div className="work-section">

            <div className="work-section-heading">

              <div className="work-section-number">
                03
              </div>

              <div>

                <h2>
                  Location Verification
                </h2>

                <p>
                  Verify where the public work is located.
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

                  <p>
                    Capture your current location
                    with the evidence.
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="location-button"
                onClick={captureGPS}
              >
                {gpsLocation
                  ? "✓ Location Captured"
                  : "Capture GPS"}
              </button>

            </div>


            {/* GPS SUCCESS */}

            {gpsLocation && (

              <div className="gps-success">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Location successfully captured
                  </strong>

                  <small>
                    Latitude:{" "}
                    {gpsLocation.latitude.toFixed(6)}
                    {"  •  "}
                    Longitude:{" "}
                    {gpsLocation.longitude.toFixed(6)}
                  </small>

                </div>

              </div>

            )}


            {/* GPS ERROR */}

            {locationError && (

              <div className="gps-error">
                ⚠️ {locationError}
              </div>

            )}

          </div>


          {/* =========================
              ACTIONS
          ========================== */}

          <div className="form-actions">

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
              className="submit-button"
            >
              Register Work
              <span>→</span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default RegisterWork;
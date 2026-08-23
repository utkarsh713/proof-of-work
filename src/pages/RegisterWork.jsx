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

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);

  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleBeforeImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Before image must be smaller than 10MB.");
      return;
    }

    try {
      const base64 = await convertToBase64(file);

      setBeforeImage(base64);
      setBeforePreview(base64);
    } catch (error) {
      console.error(error);
      alert("Failed to upload Before image.");
    }
  };

  const handleAfterImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("After image must be smaller than 10MB.");
      return;
    }

    try {
      const base64 = await convertToBase64(file);

      setAfterImage(base64);
      setAfterPreview(base64);
    } catch (error) {
      console.error(error);
      alert("Failed to upload After image.");
    }
  };

  const handleCaptureGPS = () => {
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

      (error) => {
        console.error(error);

        setGpsLoading(false);

        alert(
          "Unable to capture your location. Please allow location permission."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    setSubmitting(true);

    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null"
      );

      const work = {
        id: `PW-${Date.now()}`,

        userId: currentUser?.id || "guest-user",

        workName: workName.trim(),
        title: workName.trim(),

        department,

        description: description.trim(),

        workLocation: workLocation.trim(),

        estimatedCost: Number(estimatedCost),

        gpsLocation,

      beforeImage,
      afterImage,

      status: "Under Verification",

      aiScore: 94,

        createdAt: new Date().toISOString(),
      };

      // Get existing works
      const existingWorks = JSON.parse(
        localStorage.getItem("works") || "[]"
      );

      // Add new work
      const updatedWorks = [
        work,
        ...existingWorks,
      ];

      // IMPORTANT: Save to works for Dashboard
      localStorage.setItem(
        "works",
        JSON.stringify(updatedWorks)
      );

      // Optional submissions storage
      localStorage.setItem(
        "submissions",
        JSON.stringify(updatedWorks)
      );

      // Save latest work
      localStorage.setItem(
        "registeredWork",
        JSON.stringify(work)
      );

      // Notify Dashboard
      window.dispatchEvent(
        new Event("workRegistered")
      );

      alert("Work registered successfully!");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      alert("Something went wrong while registering work.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="work-page">

      <div className="register-page-bg"></div>

      <form
        className="register-work-form"
        onSubmit={handleSubmit}
      >

        {/* PAGE HEADER */}

        <div className="work-header">

          <div>

            <span className="register-kicker">
              PUBLIC WORK SUBMISSION
            </span>

            <h1>
              Register Public Work
            </h1>

            <p>
              Submit details and evidence to verify
              a public project.
            </p>
          </div>

          <div className="register-progress">

            <div className="progress-label">
              <span>Submission Progress</span>
              <strong>
                {[
                  workName,
                  department,
                  description,
                  workLocation,
                  estimatedCost,
                  beforeImage,
                  afterImage,
                  gpsLocation,
                ].filter(Boolean).length * 12.5}%
              </strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    [
                      workName,
                      department,
                      description,
                      workLocation,
                      estimatedCost,
                      beforeImage,
                      afterImage,
                      gpsLocation,
                    ].filter(Boolean).length * 12.5
                  }%`,
                }}
              ></div>
            </div>

          </div>

        </div>


        {/* STEP 01 */}

          <div className="work-section">

            <div className="work-section-heading">

              <div className="work-section-number">
                01
              </div>

            <div>
              <span className="step-kicker">
                PROJECT DETAILS
              </span>

                <h2>
                  Work Information
                </h2>

              <p>
                Provide the essential information about
                the public project.
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


              <div className="form-group">

                <label>
                  Department
                </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >

                <option value="">
                  Select Department
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


            <div className="form-group">

              <label>
                Work Description
              </label>

              <div className="input-prefix">
                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter estimated cost"
                  value={estimatedCost}
                  onChange={(e) =>
                    setEstimatedCost(e.target.value)
                  }
                />

            </div>

            </div>


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


        {/* STEP 02 */}

          <div className="work-section">

            <div className="work-section-heading">

              <div className="work-section-number">
                02
              </div>

            <div>
              <span className="step-kicker">
                VISUAL PROOF
              </span>

                <h2>
                  Evidence
                </h2>

              <p>
                Upload before and after photographs
                to show the transformation.
              </p>
            </div>

          </div>


            <div className="evidence-upload-grid">

            <div className="evidence-upload before-upload">

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
                    src={beforePreview}
                    alt="Before Work"
                  />

                  <div className="preview-overlay">

                    <span>BEFORE WORK</span>

                    <label
                      htmlFor="before-upload"
                    >
                      Change Photo
                    </label>

                  </div>

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

              <div></div>

              <span>→</span>

              <small>TRANSFORMATION</small>

                </div>

            {/* AFTER */}

            <div className="evidence-upload after-upload">

              <input
                type="file"
                accept="image/*"
                id="after-upload"
                hidden
                onChange={handleAfterImage}
              />

              {afterPreview ? (

                  <div className="upload-preview">

                  <img
                    src={afterPreview}
                    alt="After Work"
                  />

                  <div className="preview-overlay">

                    <span>AFTER WORK</span>

                    <label
                      htmlFor="after-upload"
                    >
                      Change Photo
                    </label>

                  </div>

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


        {/* STEP 03 */}

          <div className="work-section">

            <div className="work-section-heading">

              <div className="work-section-number">
                03
              </div>

            <div>
              <span className="step-kicker">
                LOCATION PROOF
              </span>

                <h2>
                  Location Verification
                </h2>

              <p>
                Capture the GPS coordinates of the
                public work location.
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

                <p className="gps-success">

                  ✓ Coordinates captured

                  <span>
                    {gpsLocation.latitude.toFixed(5)},
                    {" "}
                    {gpsLocation.longitude.toFixed(5)}
                  </span>

                </p>

              ) : (

                <p>
                  Verify the physical location
                  of this public project.
                </p>

              )}

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

        </section>


        {/* ACTIONS */}

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
              : "Register Work"
            }

            <span>→</span>

          </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default RegisterWork;
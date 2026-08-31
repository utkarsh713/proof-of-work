import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import EvidenceCard from "../components/EvidenceCard";
import { getWorks } from "../api/workApi";
import { API_BASE_URL } from "../api/apiClient";

// ======================================================
// HELPERS
// ======================================================

function getStorageData(key, fallback = null) {
  try {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error reading localStorage key: ${key}`, error);

    return fallback;
  }
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase();
}

function getWorkTitle(work) {
  return (
    work?.title ||
    work?.workName ||
    "Untitled Work"
  );
}

function getWorkLocation(work) {
  return (
    work?.location ||
    work?.workLocation ||
    "Not specified"
  );
}

function formatCost(cost) {
  if (
    cost === null ||
    cost === undefined ||
    cost === ""
  ) {
    return "Not specified";
  }

  const numericCost = Number(cost);

  if (Number.isNaN(numericCost)) {
    return cost;
  }

  return numericCost.toLocaleString("en-IN");
}

// ======================================================
// DASHBOARD
// ======================================================

export default function Dashboard() {
  // ----------------------------------------------------
  // Current User
  // ----------------------------------------------------

  const [currentUser] = useState(() =>
    getStorageData("currentUser", null)
  );

  // ----------------------------------------------------
  // Backend Works
  // ----------------------------------------------------

  const [works, setWorks] = useState([]);

  // ----------------------------------------------------
  // UI States
  // ----------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ====================================================
  // FETCH WORKS FROM SPRING BOOT
  // ====================================================

  useEffect(() => {
    let isMounted = true;

    async function fetchWorks() {
      try {
        setLoading(true);
        setError("");

        const backendWorks = await getWorks();

        if (isMounted) {
          setWorks(backendWorks);
        }
      } catch (err) {
        console.error("Failed to fetch works:", err);

        if (isMounted) {
          setError(
            err.message ||
              "Unable to connect with backend."
          );

          setWorks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWorks();

    window.addEventListener("workRegistered", fetchWorks);

    return () => {
      isMounted = false;
      window.removeEventListener("workRegistered", fetchWorks);
    };
  }, []);

  // ====================================================
  // WORK STATISTICS
  // ====================================================

  const totalWorks = works.length;

  const completedWorks = useMemo(() => {
    return works.filter((work) => {
      const status = normalizeStatus(work.status);

      return (
        status === "completed" ||
        status === "verified"
      );
    }).length;
  }, [works]);

  const underVerificationWorks = useMemo(() => {
    return works.filter((work) => {
      const status = normalizeStatus(work.status);

      return (
        status === "" ||
        status === "pending" ||
        status === "registered" ||
        status === "under verification" ||
        status === "under review"
      );
    }).length;
  }, [works]);

  const issuesWorks = useMemo(() => {
    return works.filter((work) => {
      const status = normalizeStatus(work.status);

      return (
        status === "issue" ||
        status === "issues found" ||
        status === "rejected" ||
        status === "failed"
      );
    }).length;
  }, [works]);

  // ====================================================
  // COMPLETION PERCENTAGE
  // ====================================================

  const completionPercentage =
    totalWorks === 0
      ? 0
      : Math.round(
          (completedWorks / totalWorks) * 100
        );

  // ====================================================
  // LATEST WORK
  // ====================================================

  const latestWork =
    works.length > 0
      ? works[works.length - 1]
      : null;

  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {
    return (
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Header />

          <section className="verification-progress">
            <div className="empty-state">
              <h3>Loading works...</h3>

              <p>
                Connecting to the verification
                backend.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ====================================================
  // MAIN DASHBOARD
  // ====================================================

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        {/* ==================================================
            BACKEND CONNECTION ERROR
        ================================================== */}

        {error && (
          <section className="verification-progress">
            <div className="empty-state">
              <h3>Backend connection failed</h3>

              <p>
                {error}
              </p>

              <p>
                Make sure your Spring Boot backend is
                running and the API URL is correct:
              </p>

              <strong>
                {API_BASE_URL}
              </strong>
            </div>
          </section>
        )}

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section className="stats-grid">
          <StatCard
            title="Total Works"
            value={totalWorks}
            change={
              totalWorks === 0
                ? "No works registered"
                : `${totalWorks} work${
                    totalWorks > 1 ? "s" : ""
                  } registered`
            }
            icon="📋"
          />

          <StatCard
            title="Completed"
            value={completedWorks}
            change={
              completedWorks === 0
                ? "No completed works"
                : `${completionPercentage}% completed`
            }
            icon="✓"
          />

          <StatCard
            title="Under Verification"
            value={underVerificationWorks}
            change={
              underVerificationWorks === 0
                ? "No works under verification"
                : "Awaiting verification"
            }
            icon="⏳"
          />

          <StatCard
            title="Reported Issues"
            value={issuesWorks}
            change={
              issuesWorks === 0
                ? "No issues reported"
                : "Requires attention"
            }
            icon="!"
          />
        </section>

        {/* ==================================================
            VERIFICATION PROGRESS
        ================================================== */}

        <section className="verification-progress">
          <div className="verification-header">
            <div>
              <p className="page-label">
                VERIFICATION JOURNEY
              </p>

              <h2>
                Work Verification Progress
              </h2>
            </div>

            <div className="progress-percentage">
              {completionPercentage}%
            </div>
          </div>

          {totalWorks === 0 ? (
            <div className="empty-state">
              <h3>
                No work registered yet
              </h3>

              <p>
                Register your first public work
                to begin the verification process.
              </p>
            </div>
          ) : (
            <div className="verification-summary">
              <div>
                <strong>
                  {totalWorks}
                </strong>

                <span>
                  Total Works
                </span>
              </div>

              <div>
                <strong>
                  {completedWorks}
                </strong>

                <span>
                  Completed
                </span>
              </div>

              <div>
                <strong>
                  {underVerificationWorks}
                </strong>

                <span>
                  Under Verification
                </span>
              </div>

              <div>
                <strong>
                  {issuesWorks}
                </strong>

                <span>
                  Issues Found
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================
            LATEST REGISTERED WORK
        ================================================== */}

        {latestWork ? (
          <section className="registered-work-card">
            <div className="registered-work-header">
              <div>
                <p className="page-label">
                  RECENTLY REGISTERED
                </p>

                <h2>
                  {getWorkTitle(latestWork)}
                </h2>
              </div>

              <span className="work-status">
                {normalizeStatus(
                  latestWork.status
                ) === "verified" ||
                normalizeStatus(
                  latestWork.status
                ) === "completed"
                  ? "✓"
                  : "⏳"}{" "}
                {latestWork.status ||
                  "Under Verification"}
              </span>
            </div>

            {/* ==================================================
                WORK DETAILS
            ================================================== */}

            <div className="registered-work-details">
              <div>
                <strong>
                  Department
                </strong>

                <p>
                  🏢{" "}
                  {latestWork.department ||
                    "Not specified"}
                </p>
              </div>

              <div>
                <strong>
                  Location
                </strong>

                <p>
                  📍{" "}
                  {getWorkLocation(
                    latestWork
                  )}
                </p>
              </div>

              <div>
                <strong>
                  Estimated Cost
                </strong>

                <p>
                  💰 ₹
                  {formatCost(
                    latestWork.estimatedCost
                  )}
                </p>
              </div>
            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div className="work-description">
              <strong>
                Description
              </strong>

              <p>
                {latestWork.description ||
                  "No description provided"}
              </p>
            </div>

            {/* ==================================================
                BEFORE / AFTER EVIDENCE
            ================================================== */}

            {(latestWork.beforeImage ||
              latestWork.afterImage) && (
              <div className="registered-evidence">
                {latestWork.beforeImage && (
                  <div>
                    <p>
                      Before Evidence
                    </p>

                    <img
                      src={
                        latestWork.beforeImage
                      }
                      alt="Before evidence"
                    />
                  </div>
                )}

                {latestWork.afterImage && (
                  <div>
                    <p>
                      After Evidence
                    </p>

                    <img
                      src={
                        latestWork.afterImage
                      }
                      alt="After evidence"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                GPS
            ================================================== */}

            {latestWork.gpsLocation && (
              <div className="registered-gps">
                <span>
                  📍 GPS Location
                </span>

                <span>
                  {latestWork.gpsLocation
                    .latitude !==
                    null &&
                  latestWork.gpsLocation
                    .latitude !==
                    undefined
                    ? Number(
                        latestWork.gpsLocation
                          .latitude
                      ).toFixed(6)
                    : "N/A"}

                  {" , "}

                  {latestWork.gpsLocation
                    .longitude !==
                    null &&
                  latestWork.gpsLocation
                    .longitude !==
                    undefined
                    ? Number(
                        latestWork.gpsLocation
                          .longitude
                      ).toFixed(6)
                    : "N/A"}
                </span>
              </div>
            )}

            {/* ==================================================
                WORK ID
            ================================================== */}

            {latestWork.id && (
              <div className="registered-gps">
                <span>
                  Work ID
                </span>

                <span>
                  #{latestWork.id}
                </span>
              </div>
            )}
          </section>
        ) : (
          <section className="registered-work-card empty-work">
            <p className="page-label">
              YOUR WORK
            </p>

            <h2>
              No work registered yet
            </h2>

            <p>
              Your registered public work will
              appear here after you register it.
            </p>
          </section>
        )}

        {/* ==================================================
            EVIDENCE CARD
        ================================================== */}

        <EvidenceCard
          registeredWork={latestWork}
        />
      </main>
    </div>
  );
} 
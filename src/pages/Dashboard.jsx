import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import EvidenceCard from "../components/EvidenceCard";

function getStorageData(key, fallback = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const [currentUser] = useState(() =>
    getStorageData("currentUser", null)
  );

  const [works] = useState(() =>
    getStorageData("works", [])
  );

  const [registeredWork] = useState(() =>
    getStorageData("registeredWork", null)
  );

  let userWorks = [];

  if (currentUser?.id) {
    userWorks = works.filter(
      (work) =>
        String(work.userId) === String(currentUser.id)
    );
  }

  if (userWorks.length === 0 && registeredWork) {
    userWorks = [registeredWork];
  }

  const totalWorks = userWorks.length;

  const completedWorks = userWorks.filter((work) => {
    const status = work.status?.toLowerCase() || "";

    return status === "completed" || status === "verified";
  }).length;

  const underVerificationWorks = userWorks.filter((work) => {
    const status = work.status?.toLowerCase() || "";

    return (
      status === "" ||
      status === "pending" ||
      status === "under verification" ||
      status === "under review"
    );
  }).length;

  const issuesWorks = userWorks.filter((work) => {
    const status = work.status?.toLowerCase() || "";

    return (
      status === "issue" ||
      status === "issues found" ||
      status === "rejected"
    );
  }).length;

  const completionPercentage =
    totalWorks === 0
      ? 0
      : Math.round((completedWorks / totalWorks) * 100);

  const latestWork =
    userWorks.length > 0
      ? userWorks[userWorks.length - 1]
      : null;

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        {/* Statistics */}
        <section className="stats-grid">
          <StatCard
            title="Total Works"
            value={totalWorks}
            change={
              totalWorks === 0
                ? "No works added yet"
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

        {/* Verification Progress */}
        <section className="verification-progress">
          <div className="verification-header">
            <div>
              <p className="page-label">
                VERIFICATION JOURNEY
              </p>

              <h2>Work Verification Progress</h2>
            </div>

            <div className="progress-percentage">
              {completionPercentage}%
            </div>
          </div>

          {totalWorks === 0 ? (
            <div className="empty-state">
              <h3>No work registered yet</h3>

              <p>
                Register your first public work to begin
                the verification process.
              </p>
            </div>
          ) : (
            <div className="verification-summary">
              <div>
                <strong>{totalWorks}</strong>
                <span>Total Works</span>
              </div>

              <div>
                <strong>{completedWorks}</strong>
                <span>Completed</span>
              </div>

              <div>
                <strong>{underVerificationWorks}</strong>
                <span>Under Verification</span>
              </div>

              <div>
                <strong>{issuesWorks}</strong>
                <span>Issues Found</span>
              </div>
            </div>
          )}
        </section>

        {/* Latest Work */}
        {latestWork ? (
          <section className="registered-work-card">
            <div className="registered-work-header">
              <div>
                <p className="page-label">
                  RECENTLY REGISTERED
                </p>

                <h2>
                  {latestWork.workName ||
                    latestWork.title ||
                    "Untitled Work"}
                </h2>
              </div>

              <span className="work-status">
                ⏳ {latestWork.status || "Under Verification"}
              </span>
            </div>

            <div className="registered-work-details">
              <div>
                <strong>Department</strong>
                <p>
                  🏢 {latestWork.department || "Not specified"}
                </p>
              </div>

              <div>
                <strong>Location</strong>
                <p>
                  📍{" "}
                  {latestWork.workLocation ||
                    latestWork.location ||
                    "Not specified"}
                </p>
              </div>

              <div>
                <strong>Estimated Cost</strong>
                <p>
                  💰 ₹
                  {latestWork.estimatedCost ||
                    latestWork.budget ||
                    "Not specified"}
                </p>
              </div>
            </div>

            <div className="work-description">
              <strong>Description</strong>

              <p>
                {latestWork.description ||
                  "No description provided"}
              </p>
            </div>

            {(latestWork.beforeImage ||
              latestWork.afterImage) && (
              <div className="registered-evidence">
                {latestWork.beforeImage && (
                  <div>
                    <p>Before Evidence</p>

                    <img
                      src={latestWork.beforeImage}
                      alt="Before evidence"
                    />
                  </div>
                )}

                {latestWork.afterImage && (
                  <div>
                    <p>After Evidence</p>

                    <img
                      src={latestWork.afterImage}
                      alt="After evidence"
                    />
                  </div>
                )}
              </div>
            )}

            {latestWork.gpsLocation && (
              <div className="registered-gps">
                <span>📍 GPS Verified</span>

                <span>
                  {latestWork.gpsLocation.latitude?.toFixed(6)}
                  {" , "}
                  {latestWork.gpsLocation.longitude?.toFixed(6)}
                </span>
              </div>
            )}
          </section>
        ) : (
          <section className="registered-work-card empty-work">
            <p className="page-label">YOUR WORK</p>

            <h2>No work registered yet</h2>

            <p>
              Your registered public work will appear here
              after you register it.
            </p>
          </section>
        )}

        <EvidenceCard registeredWork={latestWork} />
      </main>
    </div>
  );
}
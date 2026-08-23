import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import StatCard from "./components/StatCard.jsx";
import EvidenceCard from "./components/EvidenceCard.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RegisterWork from "./pages/RegisterWork.jsx";
import MySubmissions from "./pages/MySubmissions.jsx";
import AIVerification from "./pages/AIVerification.jsx";
import CitizenFeedback from "./pages/citizenFeedback.jsx";
import MapView from "./pages/MapView.jsx";
import Reports from "./pages/Reports.jsx";
import Analytics from "./pages/Analytics.jsx";
import Notifications from "./pages/Notifications.jsx";
import Settings from "./pages/Settings.jsx";


function Dashboard() {

  // =========================
  // GET LOGGED-IN USER
  // =========================

  const [currentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });


  // =========================
  // GET ALL REGISTERED WORKS
  // =========================

  const [works] = useState(() => {
    try {
      const savedWorks = localStorage.getItem("works");

      return savedWorks
        ? JSON.parse(savedWorks)
        : [];
    } catch {
      return [];
    }
  });


  // =========================
  // GET SINGLE REGISTERED WORK
  // =========================

  const [registeredWork] = useState(() => {
    try {
      const savedWork =
        localStorage.getItem("registeredWork");

      return savedWork
        ? JSON.parse(savedWork)
        : null;
    } catch {
      return null;
    }
  });


  // =========================
  // GET CURRENT USER WORKS
  // =========================

  let userWorks = [];

  if (currentUser?.id) {

    userWorks = works.filter(
      (work) =>
        String(work.userId) ===
        String(currentUser.id)
    );

  }


  // If RegisterWork saves only one work
  if (
    userWorks.length === 0 &&
    registeredWork
  ) {
    userWorks = [registeredWork];
  }


  // =========================
  // REAL STATISTICS
  // =========================

  const totalWorks = userWorks.length;


  const completedWorks = userWorks.filter((work) => {

    const status =
      work.status?.toLowerCase() || "";

    return (
      status === "completed" ||
      status === "verified"
    );

  }).length;


  const underVerificationWorks =
    userWorks.filter((work) => {

      const status =
        work.status?.toLowerCase() || "";

      return (
        status === "" ||
        status === "pending" ||
        status === "under verification" ||
        status === "under review"
      );

    }).length;


  const issuesWorks =
    userWorks.filter((work) => {

      const status =
        work.status?.toLowerCase() || "";

      return (
        status === "issue" ||
        status === "issues found" ||
        status === "rejected"
      );

    }).length;


  // =========================
  // COMPLETION PERCENTAGE
  // =========================

  const completionPercentage =
    totalWorks === 0
      ? 0
      : Math.round(
          (completedWorks / totalWorks) * 100
        );


  // =========================
  // LOGGED-IN USER NAME
  // =========================

  const userName =
    currentUser?.name ||
    currentUser?.fullName ||
    "User";


  // =========================
  // LATEST WORK
  // =========================

  const latestWork =
    userWorks.length > 0
      ? userWorks[userWorks.length - 1]
      : null;


  return (

    <div className="app">

      <Sidebar />

      <main className="main-content">

        <Header />


        


        {/* REAL STATISTICS */}

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


        {/* REAL VERIFICATION PROGRESS */}

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
                <strong>
                  {underVerificationWorks}
                </strong>
                <span>Under Verification</span>
              </div>

              <div>
                <strong>{issuesWorks}</strong>
                <span>Issues Found</span>
              </div>

            </div>

          )}

        </section>


        {/* LATEST REGISTERED WORK */}

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

                ⏳{" "}

                {latestWork.status ||
                  "Under Verification"}

              </span>

            </div>


            <div className="registered-work-details">

              <div>

                <strong>Department</strong>

                <p>
                  🏢{" "}

                  {latestWork.department ||
                    "Not specified"}
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


            {latestWork.gpsLocation && (

              <div className="registered-gps">

                📍 GPS Verified

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

            <p className="page-label">
              YOUR WORK
            </p>

            <h2>
              No work registered yet
            </h2>

            <p>
              Your registered public work will appear here
              after you register it.
            </p>

          </section>

        )}


        {/* EVIDENCE */}

        <EvidenceCard
          registeredWork={latestWork}
        />

      </main>

    </div>

  );

}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/register-work"
          element={<RegisterWork />}
        />

        <Route
          path="/my-submissions"
          element={<MySubmissions />}
        />

        <Route
          path="/ai-verification"
          element={<AIVerification />}
        />
                <Route
          path="/citizenFeedback"
          element={<CitizenFeedback />}
        />


        

        <Route
          path="/map"
          element={<MapView />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;
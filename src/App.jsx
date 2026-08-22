import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import StatCard from "./components/StatCard.jsx";
import VerificationProgress from "./components/VerificationProgress.jsx";
import EvidenceCard from "./components/EvidenceCard.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RegisterWork from "./pages/RegisterWork.jsx";
import MySubmissions from "./pages/MySubmissions.jsx";
import AIVerification from "./pages/AIVerification.jsx";
import CitizenEvidence from "./pages/citizen-Evidence.jsx";
import MapView from "./pages/MapView.jsx";
import Reports from "./pages/Reports.jsx";
import Analytics from "./pages/Analytics.jsx";
import Notifications from "./pages/Notifications.jsx";
import Settings from "./pages/Settings.jsx";

function Dashboard() {
  const [registeredWork] = useState(() => {
    try {
      const savedWork = localStorage.getItem("registeredWork");
      return savedWork ? JSON.parse(savedWork) : null;
    } catch {
      return null;
    }
  });

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="stats-grid">
          <StatCard
            title="Total Works"
            value="248"
            change="↑ 18.2% this month"
            icon="📋"
          />

          <StatCard
            title="Completed"
            value="156"
            change="↑ 12.4%"
            icon="✓"
          />

          <StatCard
            title="Under Verification"
            value="67"
            change="↑ 8.6%"
            icon="⏳"
          />

          <StatCard
            title="Reported Issues"
            value="25"
            change="↓ 5.3%"
            icon="!"
          />
        </section>

        <VerificationProgress />

        {registeredWork && (
          <section className="registered-work-card">
            <div className="registered-work-header">
              <div>
                <p className="page-label">RECENTLY REGISTERED</p>
                <h2>{registeredWork.workName}</h2>
              </div>

              <span className="work-status">
                ⏳ Under Verification
              </span>
            </div>

            <div className="registered-work-details">
              <div>
                <strong>Department</strong>
                <p>🏢 {registeredWork.department}</p>
              </div>

              <div>
                <strong>Location</strong>
                <p>📍 {registeredWork.workLocation}</p>
              </div>

              <div>
                <strong>Estimated Cost</strong>
                <p>💰 ₹{registeredWork.estimatedCost}</p>
              </div>
            </div>

            <div className="work-description">
              <strong>Description</strong>
              <p>{registeredWork.description}</p>
            </div>

            <div className="registered-evidence">
              {registeredWork.beforeImage && (
                <div>
                  <p>Before Evidence</p>
                  <img
                    src={registeredWork.beforeImage}
                    alt="Before evidence"
                  />
                </div>
              )}

              {registeredWork.afterImage && (
                <div>
                  <p>After Evidence</p>
                  <img
                    src={registeredWork.afterImage}
                    alt="After evidence"
                  />
                </div>
              )}
            </div>

            {registeredWork.gpsLocation && (
              <div className="registered-gps">
                📍 GPS Verified

                <span>
                  {registeredWork.gpsLocation.latitude?.toFixed(6)}
                  {" , "}
                  {registeredWork.gpsLocation.longitude?.toFixed(6)}
                </span>
              </div>
            )}
          </section>
        )}

        <EvidenceCard registeredWork={registeredWork} />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/register" element={<Register />} />

        <Route path="/register-work" element={<RegisterWork />} />

        <Route path="/my-submissions" element={<MySubmissions />} />

        <Route path="/ai-verification" element={<AIVerification />} />

        <Route
          path="/citizen-evidence"
          element={<CitizenEvidence />}
        />

        <Route path="/map" element={<MapView />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
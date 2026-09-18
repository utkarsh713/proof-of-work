import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RegisterWork from "./pages/RegisterWork";
import MySubmissions from "./pages/MySubmissions";
import AIVerification from "./pages/AIVerification";
import CitizenFeedback from "./pages/CitizenFeedback";
import MapView from "./pages/MapView";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import Security from "./pages/Security";

/* ---------------- APP ROUTES ---------------- */

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
        <Route path="/citizen-feedback" element={<CitizenFeedback />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/security" element={<Security />} />
        <Route
          path="*"
          element={
            <div style={{ padding: "60px", textAlign: "center", color: "#fff" }}>
              <h1>404</h1>
              <p>Page not found.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

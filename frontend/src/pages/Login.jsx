import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";

import "../index.css";
import Logo from "../components/Logo";
import heroVideo from "../assets/hero.mp4";
import { login } from "../api/authApi";
import { EndpointNotConfiguredError } from "../api/apiClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Validate fields
    if (!cleanEmail || !cleanPassword) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Real authentication happens on the Spring Boot
      // backend — the frontend never simulates a successful
      // login. See src/api/authApi.js for the integration
      // point once the backend endpoint exists.
      const response = await login({
        email: cleanEmail,
        password: cleanPassword,
      });

      // Session/UI-preference data only — actual auth state
      // (token) comes from the backend response.
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
      }

      if (response?.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.user)
        );
      }

      localStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof EndpointNotConfiguredError) {
        setError(
          "Login isn't connected to a backend yet. Ask the backend team to expose the authentication endpoint."
        );
      } else {
        setError(
          err?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================
          BACKGROUND VIDEO
      ====================================== */}

      <video
        className="login-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src={heroVideo}
          type="video/mp4"
        />

        Your browser does not support video playback.
      </video>

      {/* Dark overlay */}
      <div className="login-overlay" />

      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <div className="login-bg-content">

        <div className="login-bg-logo">
          <Logo />
        </div>

        <div className="login-message">

          <span className="eyebrow">
            WELCOME TO
          </span>

          <h1>
            PUBLIC WORK.
            <br />

            <span>
              PUBLIC PROOF.
            </span>
          </h1>

          <p className="login-hero-description">
            A transparent platform where public
            infrastructure meets verifiable,
            real-world evidence.
          </p>

        </div>

      </div>

      {/* =====================================
          RIGHT SIDE LOGIN
      ====================================== */}

      <div className="login-form-section">

        <div className="login-form-container">

          {/* Mobile Logo */}

          <div className="mobile-logo">
            P<span>/</span>W
          </div>

          {/* Heading */}

          <div className="form-heading">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Login to continue to Proof-of-Work
            </p>

          </div>

          {/* =====================================
              LOGIN FORM
          ====================================== */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />

            </div>

            {/* =====================================
                REMEMBER + FORGOT
            ====================================== */}

            <div className="forgot-row">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <Link to="/forgot-password">
                Forgot password?
              </Link>

            </div>

            {/* =====================================
                ERROR
            ====================================== */}

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =====================================
                LOGIN BUTTON
            ====================================== */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* =====================================
              DIVIDER
          ====================================== */}

          <div className="login-divider">

            <span />

            <p>
              OR CONTINUE WITH
            </p>

            <span />

          </div>

          {/* =====================================
              SOCIAL LOGIN
          ====================================== */}

          <div className="social-buttons">

            <button
              type="button"
              aria-label="Continue with Google"
            >
              <FcGoogle size={21} />
            </button>

            <button
              type="button"
              aria-label="Continue with Facebook"
            >
              <FaFacebookF
                size={18}
                color="#1877F2"
              />
            </button>

            <button
              type="button"
              aria-label="Continue with GitHub"
            >
              <FaGithub size={21} />
            </button>

          </div>

          {/* =====================================
              REGISTER
          ====================================== */}

          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}
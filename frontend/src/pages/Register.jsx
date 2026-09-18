import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiMapPin,
} from "react-icons/fi";

import Logo from "../components/Logo";
import heroVideo from "../assets/hero.mp4";

import "../index.css";
import { register } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  // ======================================================
  // PASSWORD VISIBILITY
  // ======================================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ======================================================
  // FORM STATE
  // ======================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  // ======================================================
  // UI STATE
  // ======================================================

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error when user starts correcting
    setError("");
  };

  // ======================================================
  // FORM SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // ----------------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------------

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const location = formData.location.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!location) {
      setError("Please enter your location.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    // ----------------------------------------------------
    // PASSWORD MATCH VALIDATION
    // ----------------------------------------------------

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ----------------------------------------------------
    // PASSWORD LENGTH
    // ----------------------------------------------------

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // ----------------------------------------------------
    // START SUBMITTING
    // ----------------------------------------------------

    setSubmitting(true);

    try {
      // ==================================================
      // REAL BACKEND REGISTRATION
      // ==================================================
      //
      // Role is intentionally NOT sent from the frontend.
      //
      // The current backend registration endpoint is being
      // used for Authority registration.
      //
      // Only the fields expected by the backend are sent.
      // ==================================================

      await register({
        name,
        email,
        location,
        password,
      });

      // --------------------------------------------------
      // SUCCESS
      // --------------------------------------------------

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess:
            "Authority account created successfully. Please login.",
        },
      });
    } catch (err) {
      console.error("Register error:", err);

      // --------------------------------------------------
      // BACKEND ERROR
      // --------------------------------------------------

      setError(
        err?.message ||
          "Could not create the account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="register-page">

      {/* ==================================================
          BACKGROUND VIDEO
      ================================================== */}

      <video
        className="register-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="register-overlay"></div>

      {/* ==================================================
          LEFT BRAND SIDE
      ================================================== */}

      <section className="register-brand-side">

        {/* LOGO */}

        <Link to="/" className="register-logo">
          <Logo />
        </Link>

        {/* BRAND CONTENT */}

        <div className="register-brand-content">

          <div className="register-eyebrow">
            <FiShield />
            SECURE PUBLIC TRANSPARENCY
          </div>

          <h1>
            BUILD TRUST.
            <br />

            <span>
              PROVE THE WORK.
            </span>
          </h1>

          <p>
            Join a transparent ecosystem where public
            infrastructure is backed by evidence,
            AI verification and citizen participation.
          </p>

        </div>

        {/* FEATURES */}

        <div className="register-features">

          {/* FEATURE 1 */}

          <div className="register-feature">

            <FiCheckCircle />

            <div>
              <strong>
                Evidence Based
              </strong>

              <span>
                Every project backed by proof
              </span>
            </div>

          </div>

          {/* FEATURE 2 */}

          <div className="register-feature">

            <FiShield />

            <div>
              <strong>
                AI Verified
              </strong>

              <span>
                Intelligent evidence verification
              </span>
            </div>

          </div>

          {/* FEATURE 3 */}

          <div className="register-feature">

            <FiUser />

            <div>
              <strong>
                Citizen Powered
              </strong>

              <span>
                Community participation matters
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          REGISTER FORM SIDE
      ================================================== */}

      <section className="register-form-side">

        {/* CLOSE BUTTON */}

        <Link
          to="/"
          className="register-close"
          aria-label="Close registration"
        >
          ×
        </Link>

        <div className="register-form-container">

          {/* MOBILE LOGO */}

          <div className="register-mobile-logo">
            <Logo />
          </div>

          {/* ==================================================
              FORM HEADING
          ================================================== */}

          <div className="register-heading">

            <p>
              CREATE AUTHORITY ACCOUNT
            </p>

            <h2>
              Join Proof-of-Work.
            </h2>

            <span>
              Create an authority account to manage
              and verify transparent public infrastructure.
            </span>

          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ==================================================
                FULL NAME
            ================================================== */}

            <div className="register-input-group">

              <label htmlFor="register-name">
                Full Name
              </label>

              <div className="register-input">

                <FiUser />

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  disabled={submitting}
                />

              </div>

            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="register-input-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input">

                <FiMail />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  disabled={submitting}
                />

              </div>

            </div>

            {/* ==================================================
                LOCATION
            ================================================== */}

            <div className="register-input-group">

              <label htmlFor="register-location">
                Location
              </label>

              <div className="register-input">

                <FiMapPin />

                <input
                  id="register-location"
                  type="text"
                  name="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                  disabled={submitting}
                />

              </div>

            </div>

            {/* ==================================================
                PASSWORDS
            ================================================== */}

            <div className="register-password-grid">

              {/* PASSWORD */}

              <div className="register-input-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="register-input">

                  <FiLock />

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={submitting}
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="register-input-group">

                <label htmlFor="register-confirm-password">
                  Confirm Password
                </label>

                <div className="register-input">

                  <FiLock />

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    disabled={submitting}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

            </div>

            {/* ==================================================
                TERMS
            ================================================== */}

            <label className="register-terms">

              <input
                type="checkbox"
                required
                disabled={submitting}
              />

              <span>
                I agree to the Terms of Service
                and Privacy Policy.
              </span>

            </label>

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
              <div
                className="login-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* ==================================================
                SUBMIT BUTTON
            ================================================== */}

            <button
              type="submit"
              className="register-submit"
              disabled={submitting}
            >

              {submitting
                ? "Creating account..."
                : "CREATE AUTHORITY ACCOUNT"}

              <FiArrowRight />

            </button>

          </form>

          {/* ==================================================
              LOGIN
          ================================================== */}

          <div className="register-login">

            Already have an account?

            <Link to="/login">
              LOGIN
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
} 
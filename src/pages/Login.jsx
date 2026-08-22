import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";

import "../index.css";
import Logo from "../components/Logo";
import heroVideo from "../assets/hero.mp4";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Check fields
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    // Save login status
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    // Open Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      {/* Background Video */}
      <video
        className="login-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="login-overlay"></div>

      {/* Blurred Background Content */}
      <div className="login-bg-content">
        <div className="login-bg-logo">
          <Logo />
        </div>

        <h1>
          PUBLIC WORK.
          <br />
          <span>PUBLIC PROOF.</span>
        </h1>
      </div>

      {/* Login Modal */}
      <div className="login-modal">

        <Link to="/" className="login-close">
          ×
        </Link>

        <div className="login-logo">
          <Logo />
        </div>

        <h2>Welcome back</h2>

        <p className="login-subtitle">
          Enter your details to continue to{" "}
          <span>Proof-of-Work</span>
        </p>

        {/* IMPORTANT: onSubmit */}
        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-input">
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Options */}
          <div className="login-options">

            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-submit"
          >
            LOGIN <span>→</span>
          </button>

        </form>

        {/* Divider */}
        <div className="login-divider">
          OR CONTINUE WITH
        </div>

        {/* Social Login */}
        <div className="social-login">

          <button
            type="button"
            className="social-btn google-btn"
            aria-label="Continue with Google"
          >
            <FcGoogle size={21} />
          </button>

          <button
            type="button"
            className="social-btn facebook-btn"
            aria-label="Continue with Facebook"
          >
            <FaFacebookF size={18} />
          </button>

          <button
            type="button"
            className="social-btn github-btn"
            aria-label="Continue with GitHub"
          >
            <FaGithub size={20} />
          </button>

        </div>

        {/* Register */}
        <p className="register-text">
          Don't have an account?

          <Link to="/register">
            CREATE ACCOUNT
          </Link>
        </p>

      </div>
    </div>
  );
}
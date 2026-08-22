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

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    role: "Citizen",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    localStorage.setItem(
      "proofOfWorkUser",
      JSON.stringify(formData)
    );

    navigate("/dashboard");
  };

  return (
    <div className="register-page">

      {/* BACKGROUND VIDEO */}

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


      {/* LEFT SIDE */}

      <section className="register-brand-side">

        <Link to="/" className="register-logo">
          <Logo />
        </Link>

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


        <div className="register-features">

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


      {/* REGISTER CARD */}

      <section className="register-form-side">

        <Link
          to="/"
          className="register-close"
        >
          ×
        </Link>


        <div className="register-form-container">

          <div className="register-mobile-logo">
            <Logo />
          </div>


          <div className="register-heading">

            <p>
              CREATE ACCOUNT
            </p>

            <h2>
              Join Proof-of-Work.
            </h2>

            <span>
              Start contributing to transparent
              public infrastructure.
            </span>

          </div>


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="register-input-group">

              <label>
                Full Name
              </label>

              <div className="register-input">

                <FiUser />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-input-group">

              <label>
                Email Address
              </label>

              <div className="register-input">

                <FiMail />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* LOCATION */}

            <div className="register-input-group">

              <label>
                Location
              </label>

              <div className="register-input">

                <FiMapPin />

                <input
                  type="text"
                  name="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* ROLE */}

            <div className="register-input-group">

              <label>
                Register As
              </label>

              <div className="register-role-selector">

                <button
                  type="button"
                  className={
                    formData.role === "Citizen"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "Citizen",
                    })
                  }
                >
                  <FiUser />
                  Citizen
                </button>


                <button
                  type="button"
                  className={
                    formData.role === "Authority"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "Authority",
                    })
                  }
                >
                  <FiShield />
                  Authority
                </button>

              </div>

            </div>


            {/* PASSWORDS */}

            <div className="register-password-grid">

              <div className="register-input-group">

                <label>
                  Password
                </label>

                <div className="register-input">

                  <FiLock />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword
                      ? <FiEyeOff />
                      : <FiEye />
                    }
                  </button>

                </div>

              </div>


              <div className="register-input-group">

                <label>
                  Confirm Password
                </label>

                <div className="register-input">

                  <FiLock />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? <FiEyeOff />
                      : <FiEye />
                    }
                  </button>

                </div>

              </div>

            </div>


            {/* TERMS */}

            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms of Service
                and Privacy Policy.
              </span>

            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
            >

              CREATE ACCOUNT

              <FiArrowRight />

            </button>

          </form>


          {/* LOGIN */}

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
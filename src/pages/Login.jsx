import "../index.css";

function Login() {
  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-visual">
        <div className="login-overlay" />

        <div className="login-brand">
          <div className="logo">
            P<span>/</span>W
          </div>

          <p className="logo-subtitle">PROOF OF WORK</p>
        </div>

        <div className="login-message">
          <span className="eyebrow">WELCOME TO</span>

          <h1>
            PUBLIC <span>WORK.</span>
            <br />
            PUBLIC PROOF.
          </h1>

          <p>
            Verify public infrastructure through transparent,
            verifiable and citizen-powered evidence.
          </p>

          <div className="login-features">
            <div>● Upload evidence</div>
            <div>● AI verification</div>
            <div>● Build public trust</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="mobile-logo">
            P<span>/</span>W
          </div>

          <div className="form-heading">
            <span>WELCOME BACK</span>
            <p>Login to continue</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Login successful!");
            }}
          >
            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="forgot-row">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-button">
              Login
              <span>→</span>
            </button>
          </form>

          <div className="login-divider">
            <span />
            <p>OR CONTINUE WITH</p>
            <span />
          </div>

          <div className="social-buttons">
            <button>G</button>
            <button>◉</button>
            <button>GH</button>
          </div>

          <p className="register-text">
            Don't have an account?
            <button type="button">Register</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
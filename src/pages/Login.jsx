import "../index.css";
import Logo from "../components/Logo";
import heroVideo from "../assets/hero.mp4";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Check empty fields
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Get all registered users
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // Find user using email
    const user = users.find(
      (user) =>
        user.email.toLowerCase() ===
        email.trim().toLowerCase()
    );

    // User does not exist
    if (!user) {
      setError(
        "User not found. Please create an account first."
      );
      return;
    }

    // Password is incorrect
    if (user.password !== password) {
      setError(
        "Incorrect password. Please try again."
      );
      return;
    }

    // Successful login
    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "userEmail",
      user.email
    );

    // Navigate to dashboard
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
        <source
          src={heroVideo}
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="login-overlay"></div>

      {/* Background Content */}
      <div className="login-bg-content">
        <div className="login-bg-logo">
          <Logo />
        </div>

        <div className="login-message">
          <span className="eyebrow">WELCOME TO</span>

        <h1>
          PUBLIC WORK.
          <br />
          <span>PUBLIC PROOF.</span>
        </h1>
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

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              {error}
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
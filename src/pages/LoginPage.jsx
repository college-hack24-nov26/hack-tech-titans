import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsSignUp(false);
    setEmail("");
    setPassword("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // ✅ FIXED: No more alert popup. Go to dashboard based on role.
    if (selectedRole === "Patient") {
      navigate("/patient-dashboard");
    } else if (selectedRole === "Caregiver") {
      navigate("/caregiver-dashboard");
    }
  };

  return (
    <div className="login-page">

      <nav className="login-navbar">
        <div className="login-logo">
          🍃 Mind<span>Sathi</span>
        </div>

        <button
          className="login-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </nav>

      <main className="login-content">

        {!selectedRole ? (
          <>
            <div className="login-badge">
              ✨ Your Care Journey Starts Here
            </div>

            <h1>Welcome to MindSaathi!</h1>

            <p className="login-subtitle">
              Every journey is special. Tell us how you would like to continue.
            </p>

            <div className="role-container">

              <button
                className="role-card"
                onClick={() => handleRoleSelect("Patient")}
              >
                <div className="role-emoji">👵</div>

                <h2>I'm a Patient</h2>

                <p>
                  Talk to Sathi, enjoy memory games, manage daily reminders
                  and stay connected with your loved ones.
                </p>

                <span className="role-action">
                  Continue as Patient →
                </span>
              </button>

              <button
                className="role-card"
                onClick={() => handleRoleSelect("Caregiver")}
              >
                <div className="role-emoji">👨‍👩‍👧</div>

                <h2>I'm a Caregiver</h2>

                <p>
                  Stay connected with your loved ones and view their
                  daily activities, reminders and progress.
                </p>

                <span className="role-action">
                  Continue as Caregiver →
                </span>
              </button>

            </div>
          </>
        ) : (
          <div className="role-confirmation">

            <div className="login-badge">
              🍃 MindSaathi Account
            </div>

            <h1>
              {isSignUp ? "Create Account" : "Welcome Back!"}
            </h1>

            <p className="login-subtitle">
              {selectedRole} Login
            </p>

            <form className="auth-form" onSubmit={handleLogin}>

              {isSignUp && (
                <div className="auth-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                {isSignUp ? "Create Account →" : "Login →"}
              </button>

            </form>

            <p className="auth-switch">
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}

              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? " Login" : " Sign Up"}
              </button>
            </p>

            <button
              className="auth-back-btn"
              onClick={() => setSelectedRole("")}
            >
              ← Change Role
            </button>

          </div>
        )}

        <div className="login-footer">
          <p>💗 Made with love for our elders.</p>
          <span>Your journey, your pace.</span>
        </div>

      </main>
    </div>
  );
}

export default LoginPage;
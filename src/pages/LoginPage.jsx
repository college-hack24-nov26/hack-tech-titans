import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // <-- 1. ADDED
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsSignUp(false);
    setEmail("");
    setPassword("");
  };

  // 2. REPLACED with REAL Supabase logic
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              role: selectedRole, // Saves role (Patient/Caregiver)
            }
          }
        });

        if (error) throw error;

        alert("Account created! Now you can Login. (Check your Supabase Users tab - user will appear now!)");
        setIsSignUp(false); // Switch to Login mode

      } else {
        // --- LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;

        // Login Success -> Go to dashboard
        if (selectedRole === "Patient") {
          navigate("/patient-dashboard");
        } else if (selectedRole === "Caregiver") {
          navigate("/caregiver-dashboard");
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Please wait..." : (isSignUp ? "Create Account →" : "Login →")}
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
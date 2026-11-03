import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="login-page">

      <nav className="login-navbar">
        <div className="login-logo">
          🍃 Mind<span>Sathi</span>
        </div>

        <button className="login-home-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      <main className="login-content">

        <div className="login-badge">
          ✨ Your Care Journey Starts Here
        </div>

        <h1>Welcome to MindSaathi!</h1>

        <p className="login-subtitle">
          Every journey is special. Tell us how you would like to continue.
        </p>

        <div className="role-container">

          <button
            className={`role-card ${selectedRole === "Patient" ? "selected" : ""}`}
            onClick={() => setSelectedRole("Patient")}
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
            className={`role-card ${selectedRole === "Caregiver" ? "selected" : ""}`}
            onClick={() => setSelectedRole("Caregiver")}
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

        {selectedRole && (
          <div className="role-confirmation">
            <h3>{selectedRole} selected!</h3>
            <p>
              You selected {selectedRole}. Login and account registration
              will be available here.
            </p>
            <button onClick={() => setSelectedRole("")}>
              Change Role
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
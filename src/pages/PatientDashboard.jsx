import React from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="patient-dashboard">

      {/* TOP - BACK BUTTONS */}
      <div className="dashboard-top-bar">
        <button className="back-btn" onClick={() => navigate("/login")}>
          ← Back to Login
        </button>
        <button className="home-btn" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      {/* HEADING */}
      <h1>Let's make today special!! 😊</h1>
      <p>How are you feeling today? Your Sathi is here for you.</p>

      <h2>What would you like to do today?</h2>

      {/* 4 CARDS */}
      <div className="dashboard-cards">

        {/* CARD 1 - Medicine */}
        <div className="dashboard-card">
          <div className="card-emoji">💊</div>
          <h3>Medicine Reminder</h3>
          <p>Next: 9 AM - Blood Pressure Tablet</p>
          <button className="card-btn">✅ Done</button>
          <button className="card-btn-white">⏰ Remind Later</button>
        </div>

        {/* CARD 2 - Memory Games */}
        <div className="dashboard-card">
          <div className="card-emoji">🧠</div>
          <h3>Memory Games</h3>
          <p>Play fun games to keep your mind sharp</p>
          <button className="card-btn">▶ Play Now</button>
        </div>

        {/* CARD 3 - Talk to Sathi */}
        <div className="dashboard-card">
          <div className="card-emoji">🎙️</div>
          <h3>Talk to Sathi</h3>
          <p>"Aaj kaisa feel kar rahe ho?" - Talk in Hindi, Marathi</p>
          <button className="card-btn">🎤 Start Talking</button>
        </div>

        {/* CARD 4 - Family Connect */}
        <div className="dashboard-card">
          <div className="card-emoji">👨‍👩‍👧</div>
          <h3>Family Connect</h3>
          <p>Your son Ramesh sent you a message ❤️</p>
          <button className="card-btn">✉️ View Message</button>
        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;
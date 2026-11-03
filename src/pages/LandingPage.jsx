import React from "react";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">🍃 Mind<span>Sathi</span></div>
        <div className="nav-links">
          <a href="#">Features</a>
          <a href="#">How it works</a>
          <a href="#">For Family</a>
        </div>
        <button className="nav-btn">Get Started →</button>
      </nav>

      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-left">
          <div className="badge">✨ AI-Powered Companion for Elders</div>
          <h1>
            Mind Sathi
            <span>Your companion through<br />every memory.</span>
          </h1>
          <p>
            A little more peace, a little more care,<br />
            and a little more happiness every day.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started →</button>
            <button className="btn-secondary">▶ Watch How it Works</button>
          </div>

          <div className="stats">
            <div><b>💗</b><span>Happy Elders</span></div>
            <div><b>98%</b><span>Feel Less Lonely</span></div>
            <div><b>24/7</b><span>Always There</span></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="main-card">
            <div className="emoji-big">👵❤️👴</div>
            <h3>Good Morning, Aaji!</h3>
            <p>It's time for your medicine 💊<br />And your walk at 7 AM 🌿</p>
            <div className="mini-btns">
              <span>✅ Done</span>
              <span>⏰ Remind Later</span>
            </div>
          </div>
          <div className="float-card card1">🧠 Memory Game<br /><small>Score: 95 / 100</small></div>
          <div className="float-card card2">💬 "Aaj kaisa feel kar rahe ho?"</div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features">
        <div className="feature-card">💊<h3>Medicine Reminder</h3><p>Never miss a dose again. Gentle voice reminders.</p></div>
        <div className="feature-card">🧠<h3>Memory Games</h3><p>Fun games to keep mind sharp & active.</p></div>
        <div className="feature-card">🎙️<h3>Talk to Sathi</h3><p>Talk anytime, in Hindi, Marathi & English.</p></div>
        <div className="feature-card">👨‍👩‍👧<h3>Family Connect</h3><p>Family gets daily health & mood updates.</p></div>
      </div>

      <p className="footer-text">Your journey, your pace. ♥ Made with love for our elders.</p>
    </div>
  );
}

export default Landing;
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

function HowItWorks() {
const navigate = useNavigate();

const features = [
{
icon: "💊",
title: "Medicine Reminders",
description:
"Receive gentle reminders for daily medicines and important activities. Mark reminders as completed to keep your caregiver informed."
},
{
icon: "🧠",
title: "Cognitive Memory Games",
description:
"Enjoy simple and engaging memory games designed to exercise memory, attention and thinking skills."
},
{
icon: "🎙️",
title: "Talk to Sathi",
description:
"Talk with your friendly AI voice companion in supported languages like Marathi, Hindi and English."
},
{
icon: "❤️",
title: "Family Connect",
description:
"Stay emotionally connected with your loved ones through family photographs and meaningful memories shared by caregivers."
},
{
icon: "👨‍👩‍👧",
title: "Caregiver Dashboard",
description:
"Caregivers can manage reminders, share family memories and stay connected with the elderly person."
}
];

const steps = [
{
number: "01",
title: "Get Started",
description:
"Open MindSaathi and access the platform through the login page."
},
{
number: "02",
title: "Connect with Family",
description:
"Caregivers can access their dashboard and manage important reminders."
},
{
number: "03",
title: "Explore Activities",
description:
"Play memory games, interact with Sathi and view family memories."
},
{
number: "04",
title: "Stay Connected",
description:
"Enjoy a simple digital experience that brings care and family closer."
}
];

return ( <div className="how-page">

```
  {/* NAVBAR */}
  <nav className="how-navbar">
    <div
      className="how-logo"
      onClick={() => navigate("/")}
    >
      🍃 Mind<span>Sathi</span>
    </div>

    <button
      className="how-back"
      onClick={() => navigate("/")}
    >
      ← Back to Home
    </button>
  </nav>

  {/* HERO SECTION */}
  <section className="how-hero">
    <div className="how-badge">
      ❤️ Simple Technology, Meaningful Care
    </div>

    <h1>
      How MindSaathi <span>Works</span>
    </h1>

    <p>
      A little care, a little connection and a lot of love.
      Discover how MindSaathi makes everyday life more supportive
      and meaningful for elderly people.
    </p>

    <button onClick={() => navigate("/login")}>
      Get Started →
    </button>
  </section>

  {/* INTRODUCTION */}
  <section className="how-intro">
    <h2>What is MindSaathi?</h2>

    <p>
      MindSaathi is an AI-powered companion platform designed
      to support elderly people through cognitive activities,
      friendly voice interaction, gentle reminders and family
      connections.
    </p>
  </section>

  {/* FEATURES */}
  <section className="how-features">
    <div className="how-section-heading">
      <span>OUR FEATURES</span>
      <h2>Everything in One Place</h2>
      <p>Designed to make care simple and accessible.</p>
    </div>

    <div className="how-feature-grid">
      {features.map((feature, index) => (
        <div className="how-feature-card" key={index}>
          <div className="how-feature-icon">
            {feature.icon}
          </div>

          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  </section>

  {/* HOW IT WORKS STEPS */}
  <section className="how-steps">
    <div className="how-section-heading">
      <span>THE JOURNEY</span>
      <h2>How It Works Step by Step</h2>
      <p>Getting started with MindSaathi is simple.</p>
    </div>

    <div className="how-step-grid">
      {steps.map((step, index) => (
        <div className="how-step-card" key={index}>
          <div className="how-step-number">
            {step.number}
          </div>

          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      ))}
    </div>
  </section>

  {/* FAMILY SECTION */}
  <section className="how-family">
    <div>
      <span>MADE WITH LOVE ❤️</span>

      <h2>
        Care is better when we stay connected.
      </h2>

      <p>
        MindSaathi brings elderly people and their families
        closer through simple technology and meaningful moments.
      </p>

      <button onClick={() => navigate("/login")}>
        Explore MindSaathi →
      </button>
    </div>
  </section>

  {/* FOOTER */}
  <footer className="how-footer">
    🍃 MindSathi — Your companion through every memory.
    <br />
    Made with love for our elders. ❤️
  </footer>

</div>


);
}

export default HowItWorks;

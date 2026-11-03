import React from "react";
import { useNavigate } from "react-router-dom";

function VoiceAssistant() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      padding: "30px",
      textAlign: "center",
      background: "linear-gradient(135deg, #dbeafe, #fef3c7, #fce7f3)"
    }}>
      <button onClick={() => navigate("/patient-dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>🍃 Talk to Sathi</h1>
      <p>Namaskar! मी तुमचा Sathi आहे. आपण गप्पा मारूया!</p>

      <button>
        🎤 Start Conversation
      </button>
    </div>
  );
}

export default VoiceAssistant;
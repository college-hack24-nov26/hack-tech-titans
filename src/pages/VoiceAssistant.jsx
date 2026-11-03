import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VoiceAssistant.css";

function VoiceAssistant() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("mr");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Start Conversation दाबा");
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");

  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);

  // Load available browser voices
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

  // Text to Speech
  const speak = (text) => {
    if (!text) return;

    const synth = window.speechSynthesis;

    synth.cancel();

    const speakNow = () => {
      const voices = synth.getVoices();

      if (!voices.length) {
        setStatus("Browser voices load होत आहेत...");
        return;
      }

      const marathiVoice =
        voices.find((voice) => voice.lang.toLowerCase() === "mr-in") ||
        voices.find((voice) => voice.lang.toLowerCase().startsWith("mr"));

      const hindiVoice =
        voices.find((voice) => voice.lang.toLowerCase() === "hi-in") ||
        voices.find((voice) => voice.lang.toLowerCase().startsWith("hi"));

      const englishVoice =
        voices.find((voice) => voice.lang.toLowerCase() === "en-in") ||
        voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));

      const speech = new SpeechSynthesisUtterance(text);

      speech.rate = 0.85;
      speech.pitch = 1;
      speech.volume = 1;

      if (language === "mr") {
        if (marathiVoice) {
          speech.voice = marathiVoice;
          speech.lang = marathiVoice.lang;
        } else if (hindiVoice) {
          speech.voice = hindiVoice;
          speech.lang = hindiVoice.lang;
          setStatus("Marathi voice उपलब्ध नाही. Hindi voice वापरत आहे.");
        } else {
          speech.lang = "mr-IN";
          setStatus("Marathi audio voice तुमच्या browser मध्ये उपलब्ध नाही.");
        }
      } else {
        if (englishVoice) {
          speech.voice = englishVoice;
          speech.lang = englishVoice.lang;
        } else {
          speech.lang = "en-IN";
        }
      }

      speech.onstart = () => {
        setStatus("🍃 Sathi बोलत आहे...");
      };

      speech.onend = () => {
        setStatus("Conversation completed. पुन्हा बोलण्यासाठी Start दाबा.");
      };

      speech.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setStatus("Audio error. Speak Again दाबून प्रयत्न करा.");
      };

      synth.speak(speech);
    };

    if (synth.getVoices().length > 0) {
      speakNow();
    } else {
      const previousHandler = synth.onvoiceschanged;

      synth.onvoiceschanged = () => {
        voicesRef.current = synth.getVoices();
        synth.onvoiceschanged = previousHandler;
        speakNow();
      };
    }
  };

  // Gemini API
  const askGemini = async (message) => {
    try {
      setStatus("Sathi विचार करत आहे...");

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gemini request failed");
      }

      if (!data.reply) {
        throw new Error("Gemini returned an empty response");
      }

      setReply(data.reply);
      speak(data.reply);

    } catch (error) {
      console.error("Gemini Error:", error);
      setStatus("AI connection error. Please try again.");
    }
  };

  // Start Microphone
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Please use Google Chrome.");
      return;
    }

    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();

    recognition.lang = language === "mr" ? "mr-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
      setHeard("");
      setReply("");
      setStatus("मी ऐकत आहे... बोला!");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      setHeard(transcript);

      await askGemini(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Microphone Error:", event.error);
      setStatus("Microphone Error: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(error);
      setStatus("Microphone सुरू होऊ शकला नाही.");
      setListening(false);
    }
  };

  // Stop Conversation
  const stopListening = () => {
    recognitionRef.current?.stop();

    window.speechSynthesis.cancel();

    setListening(false);
    setStatus("Conversation stopped");
  };

  return (
    <div className="voice-page">

      {/* Header */}
      <header className="voice-header">
        <div className="voice-brand">
          <span className="brand-icon">🍃</span>
          <span>MindSaathi</span>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/patient-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="voice-main">

        <div className="voice-welcome">
          <span className="welcome-badge">
            ● Sathi is here for you
          </span>

          <h1>
            Talk to Sathi <span>💙</span>
          </h1>

          <p>
            Your friendly companion is always here to listen,
            talk and make your day special.
          </p>
        </div>

        {/* Voice Assistant Card */}
        <section className="voice-card">

          <div className="sathi-avatar">
            <span>🍃</span>
          </div>

          <h2>Namaskar! मी तुमचा Sathi आहे.</h2>

          <p className="voice-subtitle">
            आज आपण काय गप्पा मारायच्या?
          </p>

          {/* Language Selector */}
          <div className="language-section">
            <label>Select your language</label>

            <div className="language-options">

              <button
                className={
                  language === "mr"
                    ? "language-btn active"
                    : "language-btn"
                }
                onClick={() => setLanguage("mr")}
                disabled={listening}
              >
                🇮🇳 मराठी
              </button>

              <button
                className={
                  language === "en"
                    ? "language-btn active"
                    : "language-btn"
                }
                onClick={() => setLanguage("en")}
                disabled={listening}
              >
                🇬🇧 English
              </button>

            </div>
          </div>

          {/* Microphone */}
          <div className="microphone-section">

            <button
              className={
                listening
                  ? "mic-button listening"
                  : "mic-button"
              }
              onClick={listening ? stopListening : startListening}
              aria-label={
                listening
                  ? "Stop conversation"
                  : "Start conversation"
              }
            >
              {listening ? "⏹" : "🎤"}
            </button>

            <h3>
              {listening
                ? "I'm listening..."
                : "Start a Conversation"}
            </h3>

            <p>
              {listening
                ? "Please speak. Sathi is listening to you."
                : "Tap the microphone and start talking"}
            </p>

          </div>

          {/* Status */}
          <div className="voice-status">
            <span
              className={
                listening
                  ? "status-dot active-dot"
                  : "status-dot"
              }
            ></span>

            {status}
          </div>

        </section>

        {/* Conversation Area */}
        {(heard || reply) && (
          <section className="conversation-card">

            <h2>💬 Your Conversation</h2>

            {heard && (
              <div className="chat-message user-message">

                <div className="chat-avatar">👤</div>

                <div className="chat-content">
                  <span>You said</span>
                  <p>{heard}</p>
                </div>

              </div>
            )}

            {reply && (
              <div className="chat-message sathi-message">

                <div className="chat-avatar">🍃</div>

                <div className="chat-content">
                  <span>Sathi says</span>

                  <p>{reply}</p>

                  <button
                    className="speak-again-btn"
                    onClick={() => speak(reply)}
                  >
                    🔊 Speak Again
                  </button>
                </div>

              </div>
            )}

          </section>
        )}

        {/* Footer */}
        <footer className="voice-footer">
          Made with ❤️ for you | MindSaathi
        </footer>

      </main>
    </div>
  );
}

export default VoiceAssistant;
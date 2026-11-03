import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

      const marathiVoice = voices.find(
        (voice) => voice.lang.toLowerCase() === "mr-in"
      ) || voices.find(
        (voice) => voice.lang.toLowerCase().startsWith("mr")
      );

      const hindiVoice = voices.find(
        (voice) => voice.lang.toLowerCase() === "hi-in"
      ) || voices.find(
        (voice) => voice.lang.toLowerCase().startsWith("hi")
      );

      const englishVoice = voices.find(
        (voice) => voice.lang.toLowerCase() === "en-in"
      ) || voices.find(
        (voice) => voice.lang.toLowerCase().startsWith("en")
      );

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

          setStatus(
            "Marathi voice उपलब्ध नाही. Hindi voice वापरत आहे."
          );
        } else {
          speech.lang = "mr-IN";

          setStatus(
            "Marathi audio voice तुमच्या browser मध्ये उपलब्ध नाही."
          );
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

      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            language,
          }),
        }
      );

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
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

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
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        textAlign: "center",
        background: "linear-gradient(135deg, #dbeafe, #fef3c7, #fce7f3)",
      }}
    >
      <button onClick={() => navigate("/patient-dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>🍃 Talk to Sathi</h1>

      <p>Namaskar! मी तुमचा Sathi आहे. आपण गप्पा मारूया!</p>

      <div style={{ margin: "20px" }}>
        <label>Select Language: </label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={listening}
        >
          <option value="mr">Marathi</option>
          <option value="en">English</option>
        </select>
      </div>

      <button onClick={listening ? stopListening : startListening}>
        {listening ? "⏹ Stop Listening" : "🎤 Start Conversation"}
      </button>

      <h3>{status}</h3>

      {heard && (
        <div>
          <h3>You said:</h3>
          <p>{heard}</p>
        </div>
      )}

      {reply && (
        <div>
          <h3>🍃 Sathi says:</h3>
          <p>{reply}</p>

          <button onClick={() => speak(reply)}>
            🔊 Speak Again
          </button>
        </div>
      )}
    </div>
  );
}

export default VoiceAssistant;
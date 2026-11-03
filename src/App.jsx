import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import VoiceAssistant from "./pages/VoiceAssistant";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/voice-assistant" element={<VoiceAssistant />} />
    </Routes>
  );
}

export default App;
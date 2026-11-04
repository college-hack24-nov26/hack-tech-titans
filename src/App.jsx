import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import VoiceAssistant from "./pages/VoiceAssistant";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import MemoryCardGame from "./pages/MemoryCardGame";
import GlobalMedicineAlarm from "./pages/GlobalMedicineAlarm";
import HowItWorks from "./pages/HowItWorks";

function App() {
return (
<> <GlobalMedicineAlarm />

```
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/patient-dashboard" element={<PatientDashboard />} />
    <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
    <Route path="/voice-assistant" element={<VoiceAssistant />} />
    <Route path="/memory-game" element={<MemoryCardGame />} />
    <Route path="/how-it-works" element={<HowItWorks />} />
  </Routes>
</>


);
}

export default App;

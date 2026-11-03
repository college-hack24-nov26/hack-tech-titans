import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();
  const [medicineDone, setMedicineDone] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const audioRef = useRef(null);
  const remindersRef = useRef([]);

  useEffect(() => {
    fetchReminders();
    
    const channel = supabase
      .channel('pat-rem')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'reminders', filter: 'family_id=eq.FAM001' },
        () => fetchReminders()
      )
      .subscribe();

    const interval = setInterval(() => {
      checkAlarms();
    }, 20000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  const fetchReminders = async () => {
    const { data } = await supabase.from('reminders').select('*').eq('family_id','FAM001').order('created_at',{ascending:false});
    if(data) setReminders(data);
  };

  const checkAlarms = () => {
    const now = new Date();
    const nowTime = String(now.getHours()).padStart(2,'0')+":"+String(now.getMinutes()).padStart(2,'0');
    remindersRef.current.forEach(r=>{
      if(r.time === nowTime && !r.is_done && !activeAlarm){
        setActiveAlarm(r);
        if(audioRef.current){
          audioRef.current.play().catch(()=>{});
        }
      }
    });
  };

  const handleMemoryGames = () => {
    navigate("/memory-game");
  };

  const markDone = async (id) => {
    await supabase.from('reminders').update({is_done:true}).eq('id',id);
    setMedicineDone(true);
    setShowModal(false);
    setActiveAlarm(null);
    if(audioRef.current) audioRef.current.pause();
    fetchReminders();
    alert("Great job! ✅ Medicine taken - Caregiver will be notified");
  };

  const remindLater = () => {
    setShowModal(false);
    setActiveAlarm(null);
    if(audioRef.current) audioRef.current.pause();
    alert("⏰ Okay, will remind you in 5 minutes");
  };

  const nextReminder = reminders.find(r=>!r.is_done) || reminders[0];

  return (
    <div className="patient-dashboard">
      <audio ref={audioRef} loop src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />

      {activeAlarm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#ff3b30',zIndex:9999,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',color:'white',textAlign:'center',padding:'20px'}}>
          <div style={{fontSize:'70px'}}>⏰</div>
          <h1>{activeAlarm.type} TIME!</h1>
          <h2 style={{background:'white',color:'red',padding:'12px 22px',borderRadius:'12px'}}>{activeAlarm.title}</h2>
          <h3>Time: {activeAlarm.time}</h3>
          <div style={{display:'flex',gap:'12px',marginTop:'20px'}}>
            <button onClick={()=>markDone(activeAlarm.id)} style={{padding:'16px 28px',background:'#4caf50',color:'white',border:'none',borderRadius:'14px',fontWeight:'800',fontSize:'18px',cursor:'pointer'}}>✅ Done</button>
            <button onClick={remindLater} style={{padding:'16px 28px',background:'white',color:'red',border:'none',borderRadius:'14px',fontWeight:'700',cursor:'pointer'}}>Later</button>
          </div>
        </div>
      )}

      {showModal && selectedReminder && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}} onClick={()=>setShowModal(false)}>
          <div style={{background:'white',borderRadius:'24px',width:'100%',maxWidth:'400px',padding:'24px',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:'50px'}}>💊</div>
            <h2 style={{margin:'10px 0 4px'}}>{selectedReminder.type} Reminder</h2>
            <p style={{color:'#2e7d32',fontWeight:'700',fontSize:'18px'}}>{selectedReminder.title}</p>
            <p>Time: <b>{selectedReminder.time}</b></p>
            <p style={{fontSize:'12px',color:'#888',background:'#f6fbf7',padding:'10px',borderRadius:'10px'}}>Set by your Caregiver • Auto-connected FAM001</p>
            <button onClick={()=>markDone(selectedReminder.id)} style={{width:'100%',padding:'13px',border:'none',borderRadius:'30px',background:'#2e4a9e',color:'white',fontWeight:'700',marginTop:'16px',cursor:'pointer'}}>✅ I Have Taken Medicine</button>
            <button onClick={remindLater} style={{width:'100%',padding:'12px',border:'1px solid #e0e0e0',borderRadius:'30px',background:'white',marginTop:'10px',cursor:'pointer'}}>⏰ Remind After 5 Min</button>
            <button onClick={()=>setShowModal(false)} style={{marginTop:'10px',background:'none',border:'none',color:'#999',cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}

      <div className="dashboard-top-bar">
        <button className="back-btn" onClick={() => navigate("/login")}>← Back to Login</button>
        <button className="home-btn" onClick={() => navigate("/")}>🏠 Home</button>
      </div>

      <h1>Let's make today special!! 😊</h1>
      <p>How are you feeling today? Your Sathi is here for you.</p>
      <h2>What would you like to do today?</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={()=>{ if(nextReminder){ setSelectedReminder(nextReminder); setShowModal(true) } else { alert("No reminders yet. Ask caregiver to add!") } }} style={{cursor:'pointer'}}>
          <div className="card-emoji">💊</div>
          <h3>Medicine Reminder</h3>
          <p>{nextReminder ? `${nextReminder.time} - ${nextReminder.title}` : "Next: 9 AM - Blood Pressure Tablet"}</p>
          <button className="card-btn" onClick={(e) => { e.stopPropagation(); nextReminder ? markDone(nextReminder.id) : setMedicineDone(true)}}>
            {medicineDone ? "✅ Completed" : "✅ Done"}
          </button>
          <button className="card-btn-white" onClick={(e) => { e.stopPropagation(); if(nextReminder) setSelectedReminder(nextReminder); remindLater(); }}>
            ⏰ Remind Later
          </button>
          <small style={{color:'#aaa',marginTop:'8px',display:'block'}}>Click card to see details →</small>
        </div>

        <div className="dashboard-card">
          <div className="card-emoji">🧠</div>
          <h3>Memory Games</h3>
          <p>Play fun games to keep your mind sharp</p>
          <button className="card-btn" onClick={handleMemoryGames}>▶ Play Now</button>
        </div>

        <div className="dashboard-card">
          <div className="card-emoji">🎙️</div>
          <h3>Talk to Sathi</h3>
          <p>"Aaj kaisa feel kar rahe ho?" - Talk in Hindi, Marathi</p>
          <button className="card-btn" onClick={() => navigate("/voice-assistant")}>🎤 Start Talking</button>
        </div>

        <div className="dashboard-card">
          <div className="card-emoji">👨‍👩‍👧</div>
          <h3>Family Connect</h3>
          <p>Your son Ramesh sent you a message ❤️</p>
          <button className="card-btn" onClick={() => alert("Family messages coming soon!")}>✉️ View Message</button>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
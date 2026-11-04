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

  const [memories, setMemories] = useState([]);
  const [showAlbum, setShowAlbum] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    fetchReminders();
    fetchMemories();

    const channel = supabase
      .channel('pat-rem')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'reminders', filter: 'family_id=eq.FAM001' },
        () => fetchReminders()
      )
      .subscribe();

    const memChannel = supabase
      .channel('pat-mem')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'family_memories', filter: 'family_id=eq.FAM001' },
        () => fetchMemories()
      )
      .subscribe();

    const interval = setInterval(() => { checkAlarms(); }, 20000);

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(memChannel);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => { remindersRef.current = reminders; }, [reminders]);

  const fetchReminders = async () => {
    const { data } = await supabase.from('reminders').select('*').eq('family_id','FAM001').order('created_at',{ascending:false});
    if(data) setReminders(data);
  };

  const fetchMemories = async () => {
    const { data } = await supabase.from('family_memories').select('*').eq('family_id','FAM001').order('created_at',{ascending:false});
    if(data) setMemories(data);
  };

  const checkAlarms = () => {
    const now = new Date();
    const nowTime = String(now.getHours()).padStart(2,'0')+":"+String(now.getMinutes()).padStart(2,'0');
    remindersRef.current.forEach(r=>{
      if(r.time === nowTime && !r.is_done && !activeAlarm){
        setActiveAlarm(r);
        if(audioRef.current) audioRef.current.play().catch(()=>{});
      }
    });
  };

  const handleMemoryGames = () => { navigate("/memory-game"); };

  const markDone = async (id) => {
    await supabase.from('reminders').update({is_done:true}).eq('id',id);
    setMedicineDone(true);
    setShowModal(false);
    setActiveAlarm(null);
    if(audioRef.current) audioRef.current.pause();
    fetchReminders();
    alert("Great job! ✅ Medicine taken");
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
            <div style={{fontSize:'50px'}}>⏰</div>
            <h2 style={{margin:'10px 0 4px'}}>{selectedReminder.type} Reminder</h2>
            <p style={{color:'#2e7d32',fontWeight:'700',fontSize:'18px'}}>{selectedReminder.title}</p>
            <p>Time: <b>{selectedReminder.time}</b></p>
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
        <div className="dashboard-card" onClick={()=>{ if(nextReminder){ setSelectedReminder(nextReminder); setShowModal(true) } else { alert("No reminders yet!") } }} style={{cursor:'pointer'}}>
          <div className="card-emoji">⏰</div>
          <h3>Reminder</h3>
          <p>{nextReminder ? `${nextReminder.time} - ${nextReminder.title}` : "Next: 9 AM - Blood Pressure Tablet"}</p>
          <button className="card-btn" onClick={(e) => { e.stopPropagation(); nextReminder ? markDone(nextReminder.id) : setMedicineDone(true)}}>
            {medicineDone ? "✅ Completed" : "✅ Done"}
          </button>
          <button className="card-btn-white" onClick={(e) => { e.stopPropagation(); remindLater(); }}>⏰ Remind Later</button>
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
          <p>{memories.length > 0 ? `You have ${memories.length} family memories ❤️` : "Your son Ramesh sent you a message ❤️"}</p>
          <button className="card-btn" onClick={() => setShowAlbum(true)}>
            {memories.length > 0 ? `✉️ View ${memories.length} Memories` : "✉️ View Message"}
          </button>
        </div>
      </div>

      {/* ================= GALLERY LIKE PHONE - SIDE BY SIDE ================= */}
      {showAlbum && (
        <div style={{position:'fixed', inset:0, background:'#fafafa', zIndex:5000, overflowY:'auto'}}>
          <div style={{background:'white', borderBottom:'1px solid #e5e5e5', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <button onClick={()=>setShowAlbum(false)} style={{padding:'8px 16px', borderRadius:'20px', border:'1px solid #ddd', background:'white', cursor:'pointer', fontWeight:'600'}}>← Back</button>
              <div>
                <div style={{fontWeight:'700', fontSize:'16px'}}>Family Connect</div>
                <div style={{fontSize:'12px', color:'#777'}}>{memories.length} photos • Like your phone gallery</div>
              </div>
            </div>
            <button onClick={()=>setShowAlbum(false)} style={{background:'#2e4a9e', color:'white', border:'none', padding:'8px 16px', borderRadius:'20px', cursor:'pointer'}}>🏠 Home</button>
          </div>

          <div style={{maxWidth:'1100px', margin:'0 auto', padding:'16px'}}>
            {memories.length === 0 ? (
              <div style={{textAlign:'center', padding:'80px 20px', background:'white', borderRadius:'20px', border:'1px solid #eee'}}>
                <div style={{fontSize:'50px'}}>📷</div>
                <h3>No memories yet</h3>
                <p style={{color:'#888'}}>Caregiver will upload photos - they will appear here side by side</p>
              </div>
            ) : (
              <>
                {/* Gallery Grid - 3 columns */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px'}}>
                  {memories.map((m)=>(
                    <div key={m.id} onClick={()=>setSelectedMemory(m)} style={{position:'relative', aspectRatio:'1/1', borderRadius:'12px', overflow:'hidden', cursor:'pointer', background:'#eee', border:'1px solid #e5e5e5'}}>
                      <img src={m.image_url} alt={m.title} style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
                      <div style={{position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.7))', padding:'30px 8px 8px', color:'white'}}>
                        <div style={{fontSize:'11px', fontWeight:'700', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{m.title}</div>
                        <div style={{fontSize:'9px', opacity:0.8}}>{new Date(m.created_at).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:'center', marginTop:'24px', fontSize:'12px', color:'#999'}}>
                  {memories.length} memories • Tap any photo to view full description ❤️
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Lightbox - FIXED: Description always visible */}
      {selectedMemory && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:6000, display:'flex', flexDirection:'column', overflowY:'auto'}} onClick={()=>setSelectedMemory(null)}>
          <div style={{display:'flex', justifyContent:'space-between', padding:'14px 20px', color:'white', background:'rgba(0,0,0,0.5)', position:'sticky', top:0}}>
            <button onClick={()=>setSelectedMemory(null)} style={{background:'white', color:'black', border:'none', padding:'8px 16px', borderRadius:'20px', cursor:'pointer', fontWeight:'700'}}>← Back</button>
            <div style={{fontSize:'12px', background:'rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'20px'}}>{new Date(selectedMemory.created_at).toLocaleDateString('en-IN')}</div>
          </div>
          
          <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 20px 10px'}} onClick={e=>e.stopPropagation()}>
            <img src={selectedMemory.image_url} alt="" style={{maxWidth:'100%', maxHeight:'60vh', objectFit:'contain', borderRadius:'12px', boxShadow:'0 10px 40px rgba(0,0,0,0.5)'}} />
          </div>
          
          <div style={{background:'white', borderRadius:'24px 24px 0 0', padding:'22px', maxWidth:'650px', width:'100%', margin:'0 auto', marginTop:'10px'}} onClick={e=>e.stopPropagation()}>
            <div style={{width:'40px', height:'4px', background:'#ddd', borderRadius:'4px', margin:'0 auto 14px'}}></div>
            <h2 style={{margin:0, fontSize:'20px', fontWeight:'800', color:'#111'}}>{selectedMemory.title}</h2>
            <div style={{marginTop:'10px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'14px'}}>
              <div style={{fontSize:'11px', fontWeight:'700', color:'#64748b', letterSpacing:'0.5px', marginBottom:'6px'}}>DESCRIPTION FROM CAREGIVER:</div>
              <p style={{margin:0, fontSize:'15px', color:'#1e293b', lineHeight:'1.6', fontWeight:'500'}}>
                {selectedMemory.note || 'No description added by caregiver'}
              </p>
            </div>
            <div style={{marginTop:'12px', fontSize:'11px', color:'#94a3b8'}}>Shared on {new Date(selectedMemory.created_at).toLocaleString('en-IN')}</div>
            <button onClick={()=>setSelectedMemory(null)} style={{marginTop:'16px', width:'100%', padding:'14px', borderRadius:'30px', border:'none', background:'#2e4a9e', color:'white', fontWeight:'700', fontSize:'14px', cursor:'pointer'}}>Close Photo</button>
            <div style={{height:'30px'}}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function GlobalMedicineAlarm() {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const audioRef = useRef(null);
  const remindersRef = useRef([]);

  useEffect(() => {
    fetchReminders();
    
    const channel = supabase
      .channel('global-alarm-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders' }, 
      () => fetchReminders())
      .subscribe();

    const interval = setInterval(() => {
      checkAlarms();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('reminders')
      .select('*')
      .eq('family_id','FAM001')
      .eq('is_done', false);
    
    if(data) {
      remindersRef.current = data;
    }
  };

  const checkAlarms = () => {
    const now = new Date();
    const nowTime = String(now.getHours()).padStart(2,'0')+":"+String(now.getMinutes()).padStart(2,'0');
    
    remindersRef.current.forEach(r => {
      if(!r.time || r.is_done) return;
      const reminderTime = r.time.substring(0,5);
      
      if(reminderTime === nowTime){
        setActiveAlarm(r);
        if(audioRef.current) {
          audioRef.current.play().catch(()=>{});
        }
        if(navigator.vibrate) navigator.vibrate([500, 200, 500]);
      }
    });
  };

  const markDone = async (id) => {
    await supabase.from('reminders').update({is_done:true}).eq('id',id);
    setActiveAlarm(null);
    if(audioRef.current){
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    fetchReminders();
    alert("Great job! ✅ Medicine taken");
  };

  const remindLater = () => {
    setActiveAlarm(null);
    if(audioRef.current){
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    alert("⏰ Will remind again in 5 minutes");
  };

  return (
    <>
      <audio ref={audioRef} loop src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
      
      {activeAlarm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,#ff4444,#cc0000)',zIndex:99999,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',color:'white',textAlign:'center',padding:'20px'}}>
          <div style={{fontSize:'80px'}}>💊</div>
          <div style={{fontSize:'60px', margin:'10px 0'}}>⏰</div>
          <h1 style={{fontSize:'36px', margin:'10px 0'}}>Medicine Time!</h1>
          <h2 style={{background:'white',color:'#cc0000',padding:'16px 32px',borderRadius:'16px', fontSize:'26px', maxWidth:'90%'}}>{activeAlarm.title}</h2>
          <h3 style={{marginTop:'16px', fontSize:'22px', background:'rgba(0,0,0,0.2)', padding:'8px 20px', borderRadius:'30px'}}>Time: {activeAlarm.time?.substring(0,5)}</h3>
          <p style={{marginTop:'12px', fontSize:'14px', opacity:0.9}}>Set by your Caregiver with Love • FAM001</p>
          <div style={{display:'flex',gap:'16px',marginTop:'28px'}}>
            <button onClick={()=>markDone(activeAlarm.id)} style={{padding:'18px 40px',background:'#43a047',color:'white',border:'none',borderRadius:'14px',fontWeight:'800',fontSize:'20px',cursor:'pointer'}}>✅ I Took It</button>
            <button onClick={remindLater} style={{padding:'18px 36px',background:'white',color:'#cc0000',border:'none',borderRadius:'14px',fontWeight:'700',fontSize:'18px',cursor:'pointer'}}>⏰ 5 Min Later</button>
          </div>
        </div>
      )}
    </>
  );
}
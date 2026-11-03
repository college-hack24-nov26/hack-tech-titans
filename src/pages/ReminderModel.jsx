import React from "react";

export default function ReminderModal({ reminder, onClose, onDone, onLater }) {
  if (!reminder) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}} onClick={onClose}>
      <div style={{background:'white',borderRadius:'24px',width:'100%',maxWidth:'400px',padding:'24px',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:'50px'}}>💊</div>
        <h2 style={{margin:'10px 0 4px'}}>{reminder.type} Reminder</h2>
        <p style={{color:'#2e7d32',fontWeight:'700',fontSize:'18px'}}>{reminder.title}</p>
        <p>Time: <b>{reminder.time}</b></p>
        <p style={{fontSize:'12px',color:'#888',background:'#f6fbf7',padding:'10px',borderRadius:'10px'}}>Set by Caregiver • FAM001</p>
        <button onClick={()=>onDone(reminder.id)} style={{width:'100%',padding:'13px',border:'none',borderRadius:'30px',background:'#2e4a9e',color:'white',fontWeight:'700',marginTop:'16px',cursor:'pointer'}}>✅ I Have Taken Medicine</button>
        <button onClick={onLater} style={{width:'100%',padding:'12px',border:'1px solid #e0e0e0',borderRadius:'30px',background:'white',marginTop:'10px',cursor:'pointer'}}>⏰ Remind After 5 Min</button>
        <button onClick={onClose} style={{marginTop:'10px',background:'none',border:'none',color:'#999',cursor:'pointer'}}>Close</button>
      </div>
    </div>
  );
}
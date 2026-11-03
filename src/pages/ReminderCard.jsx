import React from "react";

export default function ReminderCard({ reminder, onClick, onDone, onLater }) {
  return (
    <div className="med-card" onClick={onClick}>
      <style>{`
        .med-card{background:white;border-radius:22px;padding:28px 20px;width:320px;box-shadow:0 12px 30px rgba(0,0,0,0.08);text-align:center;cursor:pointer;transition:0.3s;border:1px solid #eef4ee}
        .med-card:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,0.14)}
        .pill-icon{width:70px;height:70px;background:linear-gradient(135deg,#fff1f1,#ffe0b2);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:42px;margin:0 auto 14px}
        .btn-done{width:100%;padding:13px;border:none;border-radius:30px;background:linear-gradient(135deg,#2e4a9e,#1e3a8a);color:white;font-weight:700;font-size:15px;cursor:pointer;margin-bottom:10px}
        .btn-later{width:100%;padding:12px;border:1.5px solid #e0e0e0;border-radius:30px;background:white;color:#555;font-weight:600;font-size:14px;cursor:pointer}
      `}</style>
      <div className="pill-icon">💊</div>
      <h3 style={{fontSize:'19px',fontWeight:'700',margin:0}}>Medicine Reminder</h3>
      <p style={{fontSize:'13px',color:'#7a8c7a',margin:'8px 0 18px'}}>
        {reminder ? `Next: ${reminder.time} - ${reminder.title}` : "No reminders yet"}
      </p>
      <button className="btn-done" onClick={(e)=>{e.stopPropagation(); onDone()}}>✅ Done</button>
      <button className="btn-later" onClick={(e)=>{e.stopPropagation(); onLater()}}>⏰ Remind Later</button>
      <small style={{color:'#aaa',marginTop:'10px',display:'block'}}>Click card to see details →</small>
    </div>
  );
}
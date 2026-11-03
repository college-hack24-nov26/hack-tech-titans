import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CaregiverDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, []);

  const memories = [
    { title: "Diwali Family", img: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400" },
    { title: "Grandson Birthday", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400" }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
        .caregiver-wrap{font-family:'Outfit',sans-serif;background:#f6fbf7;min-height:100vh;padding:24px;color:#1a2e1a}
        .top-nav{background:white;border-radius:18px;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 20px rgba(46,125,50,0.06);margin-bottom:24px}
        .top-nav h2{margin:0;font-weight:700;color:#2e7d32;display:flex;gap:10px;align-items:center}
        .top-nav span{background:#e8f5e9;padding:6px 14px;border-radius:20px;font-size:13px;color:#2e7d32;font-weight:500}
        .back-btn{background:white;border:1.5px solid #c8e6c9;color:#2e7d32;padding:8px 16px;border-radius:10px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;transition:0.2s;font-family:'Outfit'}
        .back-btn:hover{background:#e8f5e9;transform:translateX(-2px)}
        .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px}
        .stat{background:white;border-radius:20px;padding:22px;box-shadow:0 8px 30px rgba(0,0,0,0.04);border:1px solid #f0f5f0}
        .stat-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:14px}
        .stat.green .stat-icon{background:#e8f5e9} .stat.orange .stat-icon{background:#fff3e0} .stat.blue .stat-icon{background:#e3f2fd}
        .stat h4{margin:0;font-size:12px;color:#78947b;font-weight:600;letter-spacing:0.5px}
        .stat h1{margin:8px 0 4px;font-size:36px;font-weight:700} .stat p{margin:0;font-size:13px;color:#a0b5a2}
        .main-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:20px}
        .glass-card{background:white;border-radius:20px;padding:24px;box-shadow:0 8px 30px rgba(0,0,0,0.04);border:1px solid #eef4ee}
        .glass-card h3{margin:0 0 18px;font-size:18px;font-weight:600;display:flex;align-items:center;gap:10px}
        .input-modern{width:100%;padding:12px 14px;border:1.5px solid #e8efe8;border-radius:12px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px}
        .btn-primary{width:100%;padding:13px;border:none;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer}
        .btn-green{background:linear-gradient(135deg,#43a047,#2e7d32);color:white}
        .btn-orange{background:linear-gradient(135deg,#ff8a65,#ff7043);color:white}
        .list-item{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#f9fdf9;border-radius:12px;margin-bottom:8px;font-size:14px;border:1px solid #f0f5f0}
        .badge{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600}
        .badge-green{background:#e8f5e9;color:#2e7d32} .badge-time{background:#fff;border:1px solid #e0e0e0;color:#555}
        .upload-zone{border:2px dashed #c8e6c9;border-radius:14px;padding:18px;text-align:center;background:#fcfffc;margin-bottom:12px}
        .memory-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
        .memory{border-radius:14px;overflow:hidden;background:white;border:1px solid #eee}
        .memory img{width:100%;height:110px;object-fit:cover;display:block}
        .memory span{padding:8px 10px;display:block;font-size:13px;font-weight:500}
        @media(max-width:900px){.stats-row,.main-grid{grid-template-columns:1fr} .caregiver-wrap{padding:14px}}
      `}</style>

      <div className="caregiver-wrap">
        {/* BACK BUTTON ROW */}
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span style={{fontSize:'14px', color:'#78947b'}}>Go back to previous page</span>
        </div>

        <div className="top-nav">
          <h2>🍃 MindSathi Care</h2>
          <span>● Caregiver Live • {user?.email ? user.email.split('@')[0] : 'Demo'}</span>
        </div>

        <div className="stats-row">
          <div className="stat green">
            <div className="stat-icon">🎮</div>
            <h4>GAMES COMPLETED</h4>
            <h1>12</h1>
            <p>+3 today • Patient is active</p>
          </div>
          <div className="stat orange">
            <div className="stat-icon">⏰</div>
            <h4>ACTIVE REMINDERS</h4>
            <h1>5</h1>
            <p>Medicine • Walk • Water</p>
          </div>
          <div className="stat blue">
            <div className="stat-icon">📸</div>
            <h4>FAMILY MEMORIES</h4>
            <h1>8</h1>
            <p>Shared with love</p>
          </div>
        </div>

        <div className="main-grid">
          <div className="glass-card">
            <h3>⏰ Set Gentle Reminder</h3>
            <select className="input-modern"><option>Medicine</option><option>Morning Walk</option><option>Drink Water</option><option>Exercise</option></select>
            <input className="input-modern" placeholder="What to remind? e.g. Take BP tablet" />
            <input type="time" className="input-modern" />
            <button className="btn-primary btn-green">+ Add Reminder with Love</button>
            <div style={{marginTop:'18px'}}>
              <div className="list-item"><span>Morning Medicine</span><span className="badge badge-time">08:00 AM</span></div>
              <div className="list-item"><span>Drink Water</span><span className="badge badge-time">11:30 AM</span></div>
              <div className="list-item"><span>Evening Walk</span><span className="badge badge-green">Active</span></div>
            </div>
          </div>

          <div>
            <div className="glass-card" style={{marginBottom:'20px'}}>
              <h3>💝 Family Connect</h3>
              <div className="upload-zone">Drop family photo here<br/><small style={{color:'#888'}}>JPG, PNG up to 5MB</small></div>
              <input className="input-modern" placeholder="Title e.g. Diwali 2024 at Home" />
              <textarea className="input-modern" rows={2} placeholder="Add a sweet memory note..."></textarea>
              <button className="btn-primary btn-orange">Share Memory → Patient Sees Instantly</button>
              <div className="memory-grid">
                {memories.map((m,i)=>(
                  <div key={i} className="memory"><img src={m.img} alt="" /><span>{m.title}</span></div>
                ))}
              </div>
            </div>
            <div className="glass-card">
              <h3>📊 Today's Insights</h3>
              <p style={{fontSize:'14px',lineHeight:'1.7',color:'#556b56',background:'#f6fbf7',padding:'12px',borderRadius:'12px'}}>
                Patient played 3 memory games today.<br/>Mood: Happy & Calm<br/><b style={{color:'#2e7d32'}}>Overall: Doing Great!</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
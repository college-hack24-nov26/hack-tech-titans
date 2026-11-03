import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CaregiverDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState(null);

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
    fetchReminders();

    const channel = supabase
      .channel('care-live-final')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders', filter: 'family_id=eq.FAM001' }, 
      () => fetchReminders())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchReminders = async () => {
    const { data } = await supabase.from('reminders').select('*').eq('family_id','FAM001').order('created_at',{ascending:false});
    if(data) setReminders(data);
  };

  const handleAddOrUpdate = async () => {
    if(!title || !time){
      alert("⚠️ Please enter medicine name and time");
      return;
    }

    if(editingId){
      const { error } = await supabase.from('reminders').update({
        title: title,
        time: time,
      }).eq('id', editingId);
      
      if(!error){
        alert("✅ Updated! Patient will see new time instantly");
        setEditingId(null);
        setTitle(""); setTime("");
        fetchReminders();
      }
    } else {
      const { error } = await supabase.from('reminders').insert([{
        family_id: 'FAM001',
        title: title,
        time: time,
        type: 'Medicine',
        is_done: false
      }]);
      
      if(error){
        alert("Error: "+error.message);
      } else {
        alert(`✅ Added: ${time} - ${title} \nPatient dashboard will show instantly!`);
        setTitle(""); setTime("");
        fetchReminders();
      }
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setTitle(r.title);
    setTime(r.time);
    window.scrollTo({top:0, behavior:'smooth'});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle(""); setTime("");
  };

  const deleteReminder = async (id) => {
    if(!window.confirm("Delete this reminder?")) return;
    await supabase.from('reminders').delete().eq('id',id);
    fetchReminders();
  };

  const memories = [
    { title: "Diwali Family", img: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400" },
    { title: "Grandson Birthday", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400" }
  ];

  const activeCount = reminders.filter(r=>!r.is_done).length;
  const doneCount = reminders.filter(r=>r.is_done).length;

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
        .input-modern{width:100%;padding:13px 14px;border:1.5px solid #e8efe8;border-radius:12px;font-size:15px;outline:none;box-sizing:border-box;margin-bottom:12px;font-family:'Outfit'}
        .input-modern:focus{border-color:#43a047;background:#fcfffc}
        .btn-primary{width:100%;padding:13px;border:none;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:'Outfit';transition:0.2s}
        .btn-primary:active{transform:scale(0.98)}
        .btn-green{background:linear-gradient(135deg,#43a047,#2e7d32);color:white}
        .btn-orange{background:linear-gradient(135deg,#ff8a65,#ff7043);color:white}
        .list-item{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#f9fdf9;border-radius:12px;margin-bottom:8px;font-size:14px;border:1px solid #f0f5f0}
        .badge{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600}
        .badge-time{background:#fff;border:1px solid #e0e0e0;color:#555}
        .upload-zone{border:2px dashed #c8e6c9;border-radius:14px;padding:18px;text-align:center;background:#fcfffc;margin-bottom:12px}
        .memory-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
        .memory{border-radius:14px;overflow:hidden;background:white;border:1px solid #eee}
        .memory img{width:100%;height:110px;object-fit:cover;display:block}
        .memory span{padding:8px 10px;display:block;font-size:13px;font-weight:500}
        @media(max-width:900px){.stats-row,.main-grid{grid-template-columns:1fr} .caregiver-wrap{padding:14px}}
      `}</style>

      <div className="caregiver-wrap">
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <span style={{fontSize:'14px', color:'#78947b'}}>Go back</span>
          <button className="back-btn" style={{marginLeft:'auto', background:'#244B3C', color:'white', border:'none'}} onClick={() => navigate("/patient-dashboard")}>👁️ See Patient View →</button>
        </div>

        <div className="top-nav">
          <h2>🍃 MindSathi Care</h2>
          <span>● Live FAM001 • {user?.email ? user.email.split('@')[0] : 'Caregiver'}</span>
        </div>

        {/* ✅ NEW: Patient Status Message */}
        <div style={{
          background: reminders.length===0 ? 'white' : activeCount===0 ? '#e8f5e9' : '#fff8e1',
          border: reminders.length===0 ? '1.5px solid #eef4ee' : activeCount===0 ? '2px solid #43a047' : '2px solid #ffb74d',
          borderRadius:'16px', padding:'14px 20px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'12px'
        }}>
          <div style={{fontSize:'28px'}}>{reminders.length===0 ? '📭' : activeCount===0 ? '🎉' : '⏳'}</div>
          <div>
            {reminders.length===0 ? (
              <><b>No reminders yet</b><br/><span style={{fontSize:'13px', color:'#78947b'}}>Add medicine name and time below - Patient will see instantly</span></>
            ) : activeCount===0 ? (
              <><b style={{color:'#2e7d32'}}>All Done! Patient took all {doneCount} medicines today ✅</b><br/><span style={{fontSize:'13px', color:'#556b56'}}>Great job! Your care is working ❤️</span></>
            ) : (
              <><b style={{color:'#e65100'}}>Patient has {activeCount} pending, {doneCount} done</b><br/><span style={{fontSize:'13px', color:'#78947b'}}>{activeCount} medicines still need to be taken today</span></>
            )}
          </div>
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
            <h1>{activeCount}</h1>
            <p>{doneCount} done • {reminders.length} total FAM001</p>
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
            <h3>{editingId ? "✏️ Update Reminder" : "⏰ Set Gentle Reminder"}</h3>
            
            {editingId && <div style={{background:'#fff8e1', padding:'8px 12px', borderRadius:'10px', fontSize:'13px', marginBottom:'12px', border:'1px solid #ffe082'}}>Editing mode: Change time or medicine name, then click Update</div>}

            {/* ✅ REMOVED DROPDOWN - Now only 2 inputs */}
            <input className="input-modern" placeholder="Medicine name e.g. BP Tablet, Breakfast" value={title} onChange={e=>setTitle(e.target.value)} />
            <input type="time" className="input-modern" value={time} onChange={e=>setTime(e.target.value)} />
            
            <button className="btn-primary btn-green" onClick={handleAddOrUpdate}>
              {editingId ? "✅ Update Reminder" : "+ Add Reminder with Love"}
            </button>
            {editingId && <button className="btn-primary" style={{background:'white', border:'1.5px solid #e0e0e0', marginTop:'8px'}} onClick={cancelEdit}>Cancel Edit</button>}

            <div style={{marginTop:'18px'}}>
              <h4 style={{fontSize:'14px', color:'#78947b', margin:'0 0 10px'}}>📋 Live Reminders for Patient (FAM001)</h4>
              {reminders.length === 0 ? (
                <p style={{textAlign:'center', color:'#aaa', padding:'16px', background:'#f9fdf9', borderRadius:'12px'}}>No reminders yet. Add one above ☝️</p>
              ) : (
                reminders.map((r)=>(
                  <div key={r.id} className="list-item" style={{background: r.is_done ? '#e8f5e9' : '#fffef5'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:'600'}}>{r.title} {r.is_done && "✅"}</div>
                      <div style={{fontSize:'12px', color:'#78947b'}}>⏰ {r.time} • {r.is_done ? 'Done by Patient' : 'Pending'}</div>
                    </div>
                    <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                      <span className="badge badge-time">{r.time}</span>
                      <button onClick={()=>startEdit(r)} style={{padding:'5px 10px', borderRadius:'8px', border:'1.5px solid #c8e6c9', background:'white', cursor:'pointer', fontSize:'12px', fontWeight:'600', color:'#2e7d32'}}>Edit</button>
                      <button onClick={()=>deleteReminder(r.id)} style={{padding:'5px 10px', borderRadius:'8px', border:'none', background:'#ffebee', cursor:'pointer', fontSize:'12px', color:'#c62828'}}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
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
              <h3>📊 Patient Status Today</h3>
              <div style={{background:'#f6fbf7', padding:'14px', borderRadius:'12px', lineHeight:'1.8', fontSize:'14px'}}>
                Total: <b>{reminders.length}</b><br/>
                Pending: <b style={{color:'#e65100'}}>{activeCount}</b><br/>
                Done: <b style={{color:'#2e7d32'}}>{doneCount}</b><br/>
                <div style={{marginTop:'10px', padding:'10px', borderRadius:'10px', background: activeCount===0 && reminders.length>0 ? '#e8f5e9' : '#fff8e1', border:'1px solid #e0e0e0'}}>
                  {reminders.length===0 ? "Add first reminder above" : activeCount===0 ? "🎉 All medicines taken! Patient is healthy today" : `⏳ Patient still has ${activeCount} medicine to take`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
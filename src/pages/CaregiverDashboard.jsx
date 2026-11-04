import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");

  // New AM/PM states
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const [memTitle, setMemTitle] = useState("");
  const [memNote, setMemNote] = useState("");
  const [memImage, setMemImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [memories, setMemories] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: r } = await supabase.from('reminders').select('*').eq('family_id','FAM001').order('created_at',{ascending:false});
    if(r) setReminders(r);
    const { data: m } = await supabase.from('family_memories').select('*').eq('family_id','FAM001').order('created_at',{ascending:false});
    if(m) setMemories(m);
  };

  // Convert 12h AM/PM to 24h for saving
  const get24hTime = () => {
    let h = parseInt(hour);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2,'0')}:${minute}`;
  };

  // Convert 24h to 12h for display
  const formatDisplayTime = (time24) => {
    if(!time24) return "";
    let [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2,'0')} ${ampm}`;
  };

  const addReminder = async () => {
    if(!title) return alert("Enter title");
    const finalTime = get24hTime();
    await supabase.from('reminders').insert([{ family_id:'FAM001', title, time: finalTime, is_done:false }]);
    setTitle(""); fetchData();
  };

  const deleteReminder = async (id) => {
    await supabase.from('reminders').delete().eq('id', id);
    fetchData();
  };

  const uploadMemory = async () => {
    if(!memTitle || !memImage) return alert("Add Title and Photo");
    setUploading(true);
    try {
      const fileName = Date.now() + "_" + memImage.name;
      const { error } = await supabase.storage.from('family-photos').upload(fileName, memImage);
      if(error) throw error;
      const { data } = supabase.storage.from('family-photos').getPublicUrl(fileName);
      await supabase.from('family_memories').insert([{ family_id:'FAM001', title: memTitle, note: memNote, image_url: data.publicUrl }]);
      setMemTitle(""); setMemNote(""); setMemImage(null); fetchData();
    } catch(e){ alert(e.message); }
    setUploading(false);
  };

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'Inter, system-ui, sans-serif'}}>
      {/* Top Bar with little color */}
      <div style={{background:'white', borderBottom:'1px solid #e2e8f0', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <div style={{width:'34px', height:'34px', background:'linear-gradient(135deg,#4f46e5,#06b6d4)', color:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'16px'}}>M</div>
          <div>
            <div style={{fontWeight:'700', fontSize:'14px', color:'#0f172a'}}>MindSaathi</div>
            <div style={{fontSize:'11px', color:'#64748b'}}>Caregiver Console • <span style={{color:'#4f46e5', fontWeight:'600'}}>FAM001</span></div>
          </div>
        </div>
        <button onClick={()=>navigate("/")} style={{fontSize:'13px', padding:'8px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer'}}>← Home</button>
      </div>

      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'28px 24px', display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:'24px'}}>
        
        {/* LEFT */}
        <div>
          {/* Stats with soft colors */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'24px'}}>
            <div style={{background:'linear-gradient(135deg,#eef2ff,#ffffff)', border:'1px solid #e0e7ff', borderRadius:'12px', padding:'16px'}}>
              <div style={{fontSize:'11px', color:'#6366f1', fontWeight:'600', letterSpacing:'0.5px'}}>TOTAL</div>
              <div style={{fontSize:'24px', fontWeight:'800', color:'#1e293b'}}>{reminders.length}</div>
              <div style={{fontSize:'11px', color:'#64748b'}}>Reminders</div>
            </div>
            <div style={{background:'linear-gradient(135deg,#fef3c7,#ffffff)', border:'1px solid #fde68a', borderRadius:'12px', padding:'16px'}}>
              <div style={{fontSize:'11px', color:'#d97706', fontWeight:'600'}}>PENDING</div>
              <div style={{fontSize:'24px', fontWeight:'800', color:'#1e293b'}}>{reminders.filter(r=>!r.is_done).length}</div>
              <div style={{fontSize:'11px', color:'#64748b'}}>Today</div>
            </div>
            <div style={{background:'linear-gradient(135deg,#dcfce7,#ffffff)', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'16px'}}>
              <div style={{fontSize:'11px', color:'#16a34a', fontWeight:'600'}}>MEMORIES</div>
              <div style={{fontSize:'24px', fontWeight:'800', color:'#1e293b'}}>{memories.length}</div>
              <div style={{fontSize:'11px', color:'#64748b'}}>Photos</div>
            </div>
          </div>

          {/* Care Plan */}
          <div style={{background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'24px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'18px'}}>
              <h3 style={{margin:0, fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>Daily Care Plan</h3>
              <span style={{fontSize:'11px', background:'#eef2ff', color:'#4f46e5', padding:'4px 10px', borderRadius:'20px', fontWeight:'600'}}>⏰ With Alarm</span>
            </div>
            
            <label style={{fontSize:'12px', fontWeight:'600', color:'#334155'}}>Task Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Morning medicine, Breakfast, Walk" style={{width:'100%', padding:'11px 12px', margin:'6px 0 14px', borderRadius:'10px', border:'1px solid #cbd5e1', fontSize:'14px', boxSizing:'border-box'}} />
            
            <label style={{fontSize:'12px', fontWeight:'600', color:'#334155'}}>Time (with AM/PM)</label>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', margin:'6px 0 14px'}}>
              <select value={hour} onChange={e=>setHour(e.target.value)} style={{padding:'11px', borderRadius:'10px', border:'1px solid #cbd5e1', fontSize:'14px', background:'white', fontWeight:'600'}}>
                {Array.from({length:12},(_,i)=>{ const h=String(i+1).padStart(2,'0'); return <option key={h} value={h}>{h}</option>})}
              </select>
              <select value={minute} onChange={e=>setMinute(e.target.value)} style={{padding:'11px', borderRadius:'10px', border:'1px solid #cbd5e1', fontSize:'14px', background:'white', fontWeight:'600'}}>
                {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m=><option key={m} value={m}>{m}</option>)}
                {/* All minutes also allowed */}
                {Array.from({length:60},(_,i)=>{ const mm=String(i).padStart(2,'0'); if(!["00","05","10","15","20","25","30","35","40","45","50","55"].includes(mm)) return <option key={mm} value={mm}>{mm}</option>})}
              </select>
              <select value={ampm} onChange={e=>setAmpm(e.target.value)} style={{padding:'11px', borderRadius:'10px', border:'1px solid #cbd5e1', fontSize:'14px', background: ampm==="AM" ? '#fef3c7' : '#e0e7ff', fontWeight:'700', color: ampm==="AM" ? '#92400e' : '#4338ca'}}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div style={{fontSize:'11px', color:'#64748b', marginBottom:'8px'}}>Selected: <b style={{color:'#0f172a'}}>{hour}:{minute} {ampm}</b> → Saved as {get24hTime()}</div>
            
            <button onClick={addReminder} style={{width:'100%', padding:'12px', background:'#0f172a', color:'white', border:'none', borderRadius:'10px', fontWeight:'600', fontSize:'14px', cursor:'pointer'}}>
              + Add to Schedule
            </button>

            <div style={{marginTop:'20px', borderTop:'1px solid #f1f5f9', paddingTop:'16px'}}>
              <div style={{fontSize:'11px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px', letterSpacing:'0.5px'}}>TODAY'S SCHEDULE</div>
              {reminders.map(r=>(
                <div key={r.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f8fafc'}}>
                  <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                    <div style={{fontSize:'12px', fontWeight:'700', background: r.is_done ? '#dcfce7' : '#e0e7ff', color: r.is_done ? '#166534' : '#4338ca', padding:'4px 10px', borderRadius:'8px', minWidth:'70px', textAlign:'center'}}>{formatDisplayTime(r.time)}</div>
                    <div style={{fontSize:'14px', color:'#0f172a', fontWeight:'500'}}>{r.title}</div>
                  </div>
                  <button onClick={()=>deleteReminder(r.id)} style={{fontSize:'12px', color:'#94a3b8', background:'none', border:'none', cursor:'pointer'}}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div style={{background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'24px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <h3 style={{margin:'0 0 4px', fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>Family Connect</h3>
            <p style={{margin:'0 0 18px', fontSize:'12px', color:'#64748b'}}>Upload photos that patient will see instantly.</p>
            
            <label style={{fontSize:'12px', fontWeight:'600', color:'#334155'}}>Memory Title</label>
            <input value={memTitle} onChange={e=>setMemTitle(e.target.value)} placeholder="e.g. Diwali Dinner 2025" style={{width:'100%', padding:'11px 12px', margin:'6px 0 12px', borderRadius:'10px', border:'1px solid #cbd5e1', fontSize:'14px', boxSizing:'border-box'}} />
            
            <label style={{fontSize:'12px', fontWeight:'600', color:'#334155'}}>Note</label>
            <input value={memNote} onChange={e=>setMemNote(e.target.value)} placeholder="We love you ❤️" style={{width:'100%', padding:'11px 12px', margin:'6px 0 12px', borderRadius:'10px', border:'1px solid #cbd5e1', fontSize:'14px', boxSizing:'border-box'}} />
            
            <div style={{border:'1px dashed #cbd5e1', borderRadius:'12px', padding:'16px', textAlign:'center', margin:'6px 0 14px', background: memImage ? '#f0fdf4' : '#f8fafc'}}>
              <input type="file" accept="image/*" onChange={e=>setMemImage(e.target.files[0])} id="fileInput" style={{display:'none'}} />
              <label htmlFor="fileInput" style={{cursor:'pointer', fontSize:'13px', fontWeight:'600', color: memImage ? '#16a34a' : '#334155'}}>
                {memImage ? `✅ ${memImage.name}` : '📷 Click to upload photo'}
              </label>
            </div>

            <button onClick={uploadMemory} disabled={uploading} style={{width:'100%', padding:'11px', background:'linear-gradient(135deg,#4f46e5,#06b6d4)', color:'white', border:'none', borderRadius:'10px', fontWeight:'600', fontSize:'14px', cursor:'pointer'}}>
              {uploading ? 'Uploading...' : 'Upload Memory'}
            </button>

            {memories.length > 0 && (
              <div style={{marginTop:'18px'}}>
                <div style={{fontSize:'11px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px'}}>RECENT • {memories.length}</div>
                {memories.map(m=>(
                  <div key={m.id} style={{display:'flex', gap:'10px', padding:'8px', border:'1px solid #f1f5f9', borderRadius:'10px', marginBottom:'8px'}}>
                    <img src={m.image_url} style={{width:'42px', height:'42px', borderRadius:'8px', objectFit:'cover'}} />
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:'13px', fontWeight:'600', color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{m.title}</div>
                      <div style={{fontSize:'11px', color:'#64748b'}}>{m.note?.substring(0,30) || 'No note'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
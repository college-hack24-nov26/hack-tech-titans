import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ICONS = ["🍎", "🍌", "🍇", "🍓", "🥭", "🍍", "🥝", "🍒", "🍑", "🍋", "🍉", "🥥"];
const LEVELS = { Easy: 4, Medium: 6, Hard: 8 };

function makeDeck(level) {
  const pick = ICONS.slice(0, LEVELS[level]);
  const deck = [...pick, ...pick].map((emoji, i) => ({
    id: i,
    emoji,
    key: `${emoji}-${i}-${Math.random()}`,
  }));
  return deck.sort(() => Math.random() - 0.5);
}

export default function MemoryCardGame() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("Easy");
  const [cards, setCards] = useState(() => makeDeck("Easy"));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [locked, setLocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer
  useEffect(() => {
    let id;
    if (isPlaying && matched.length < LEVELS[level]) {
      id = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(id);
  }, [isPlaying, matched, level]);

  const restart = (newLevel = level) => {
    setLevel(newLevel);
    setCards(makeDeck(newLevel));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setLocked(false);
    setIsPlaying(false);
  };

  const onCardClick = (card) => {
    if (locked || flipped.includes(card.id) || matched.includes(card.emoji)) return;
    if (!isPlaying) setIsPlaying(true);

    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const first = cards.find((c) => c.id === next[0]);
      const second = cards.find((c) => c.id === next[1]);

      if (first.emoji === second.emoji) {
        setMatched((prev) => [...prev, first.emoji]);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const total = LEVELS[level];
  const won = matched.length === total;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f1", fontFamily: "system-ui", padding: "16px" }}>
      <style>{`
        .flip-card{perspective:1000px}
        .flip-inner{position:relative;width:100%;height:100%;transition:transform 0.5s;transform-style:preserve-3d}
        .flip-inner.flipped{transform:rotateY(180deg)}
        .flip-front,.flip-back{position:absolute;inset:0;backface-visibility:hidden;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:800}
        .flip-front{background:linear-gradient(145deg,#6b9b83,#56866E);color:white;font-size:32px;box-shadow:0 4px 0 #3d6b52, 0 8px 15px rgba(0,0,0,0.15);border:3px solid white}
        .flip-back{background:white;transform:rotateY(180deg);font-size:42px;border:3px solid #d1f0d5;box-shadow:0 6px 18px rgba(0,0,0,0.12)}
        .flip-back.matched{background:#e8f5e9;border-color:#81c784;animation:pop 0.4s}
        @keyframes pop{0%{transform:rotateY(180deg) scale(1)} 50%{transform:rotateY(180deg) scale(1.15)} 100%{transform:rotateY(180deg) scale(1)}}
        .stat-card{background:white;border-radius:16px;padding:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1.5px solid #e8f5e9}
      `}</style>

      {/* Top Bar */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <button onClick={() => navigate("/patient-dashboard")} style={{ background: "white", border: "1.5px solid #c8e6c9", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
          <h2 style={{ margin: 0, color: "#244B3C", fontSize: "22px" }}>🧠 Memory Game</h2>
          <button onClick={() => restart()} style={{ background: "#244B3C", color: "white", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>↻ Restart</button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <h1 style={{ margin: "0", color: "#244B3C", fontSize: "36px", fontWeight: "800" }}>Find The Pairs</h1>
          <p style={{ color: "#6b8f7a", margin: "6px 0 0" }}>Flip cards and match same fruits! Good for your mind 💚</p>
        </div>

        {/* Levels */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
          {Object.keys(LEVELS).map((lvl) => (
            <button key={lvl} onClick={() => restart(lvl)} style={{ padding: "10px 22px", borderRadius: "30px", border: level === lvl ? "2px solid #244B3C" : "2px solid #c8e6c9", background: level === lvl ? "#244B3C" : "white", color: level === lvl ? "white" : "#244B3C", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
              {lvl}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "18px" }}>
          <div className="stat-card"><div style={{ fontSize: "12px", color: "#888" }}>MOVES</div><div style={{ fontSize: "24px", fontWeight: "800", color: "#244B3C" }}>{moves}</div></div>
          <div className="stat-card"><div style={{ fontSize: "12px", color: "#888" }}>TIME</div><div style={{ fontSize: "24px", fontWeight: "800", color: "#244B3C" }}>{formatTime(timer)}</div></div>
          <div className="stat-card"><div style={{ fontSize: "12px", color: "#888" }}>PAIRS</div><div style={{ fontSize: "24px", fontWeight: "800", color: "#2e7d32" }}>{matched.length}/{total}</div></div>
        </div>

        {/* Board */}
        <div style={{ background: "white", borderRadius: "24px", padding: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "2px solid #e8f5e9" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(4, 1fr)`, gap: "12px", maxWidth: level === "Hard" ? "520px" : "420px", margin: "0 auto" }}>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              const isMatched = matched.includes(card.emoji);
              return (
                <div key={card.key} className="flip-card" style={{ aspectRatio: "1" }} onClick={() => onCardClick(card)}>
                  <div className={`flip-inner ${isFlipped || isMatched ? "flipped" : ""}`}>
                    <div className="flip-front">?</div>
                    <div className={`flip-back ${isMatched ? "matched" : ""}`}>{card.emoji}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div style={{ marginTop: "16px", background: "#e8f5e9", height: "10px", borderRadius: "10px", overflow: "hidden", maxWidth: "420px", marginInline: "auto" }}>
            <div style={{ height: "100%", width: `${(matched.length / total) * 100}%`, background: "linear-gradient(90deg,#66bb6a,#2e7d32)", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Win */}
        {won && (
          <div style={{ marginTop: "18px", background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)", borderRadius: "20px", padding: "22px", textAlign: "center", border: "2px solid #81c784" }}>
            <div style={{ fontSize: "48px" }}>🎉</div>
            <h2 style={{ margin: "8px 0", color: "#1b5e20" }}>Wonderful! You Won!</h2>
            <p style={{ color: "#2e7d32", fontWeight: "600" }}>You found all {total} pairs in {moves} moves and {formatTime(timer)}</p>
            <div style={{ marginTop: "12px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => restart()} style={{ background: "#2e7d32", color: "white", border: "none", padding: "12px 24px", borderRadius: "30px", fontWeight: "700", cursor: "pointer" }}>Play Again</button>
              <button onClick={() => restart(level === "Easy" ? "Medium" : level === "Medium" ? "Hard" : "Easy")} style={{ background: "white", border: "2px solid #2e7d32", color: "#2e7d32", padding: "12px 24px", borderRadius: "30px", fontWeight: "700", cursor: "pointer" }}>Next Level</button>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", color: "#9ab0a2", fontSize: "13px", marginTop: "16px" }}>For elderly - Large cards, easy to click, no ads 💚 MindSathi</p>
      </div>
    </div>
  );
}
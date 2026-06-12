import { useState, useRef, useEffect } from "react";

// ── PLACEHOLDER PALADIN MASCOT (replace with your pixel sprite later) ────────
function PaladinMascot({ state = "idle" }) {
  // state: idle | thinking | speaking | praying
  const colors = {
    idle:     { armor: "#2563EB", glow: "#60A5FA", cross: "#FCD34D" },
    thinking: { armor: "#7C3AED", glow: "#A78BFA", cross: "#FCD34D" },
    speaking: { armor: "#1D4ED8", glow: "#3B82F6", cross: "#FCD34D" },
    praying:  { armor: "#059669", glow: "#34D399", cross: "#FCD34D" },
  };
  const col = colors[state] || colors.idle;
  const bobAnim = state === "thinking" ? "mascotBob 0.5s ease-in-out infinite alternate" :
                  state === "praying"  ? "mascotPray 1s ease-in-out infinite alternate" :
                  "mascotBob 1.5s ease-in-out infinite alternate";
  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: 80, height: 80, borderRadius: "50%",
        background: `radial-gradient(circle, ${col.glow}40 0%, transparent 70%)`,
        top: 0, left: "50%", transform: "translateX(-50%)",
        animation: "glowPulse 2s ease-in-out infinite",
      }} />
      <svg width="72" height="96" viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated", animation: bobAnim }}>
        {/* Helmet */}
        <rect x="5" y="0" width="8" height="2" fill={col.armor}/>
        <rect x="4" y="1" width="10" height="4" fill={col.armor}/>
        {/* Visor */}
        <rect x="5" y="3" width="3" height="1" fill="#1E3A5F"/>
        <rect x="10" y="3" width="3" height="1" fill="#1E3A5F"/>
        <rect x="7" y="4" width="4" height="1" fill="#111827"/>
        {/* Plume */}
        <rect x="8" y="0" width="2" height="1" fill="#DC2626"/>
        <rect x="7" y="0" width="1" height="1" fill="#DC2626"/>
        <rect x="10" y="0" width="1" height="1" fill="#DC2626"/>
        {/* Neck */}
        <rect x="7" y="5" width="4" height="1" fill="#93C5FD"/>
        {/* Chest armor */}
        <rect x="4" y="6" width="10" height="7" fill={col.armor}/>
        {/* Cross on chest */}
        <rect x="8" y="7" width="2" height="5" fill={col.cross}/>
        <rect x="6" y="9" width="6" height="2" fill={col.cross}/>
        {/* Shoulder pads */}
        <rect x="2" y="6" width="3" height="3" fill={col.armor}/>
        <rect x="13" y="6" width="3" height="3" fill={col.armor}/>
        {/* Arms */}
        <rect x="2" y="9" width="2" height="4" fill="#93C5FD"/>
        <rect x="14" y="9" width="2" height="4" fill="#93C5FD}"/>
        {/* Gauntlets */}
        <rect x="1" y="13" width="3" height="2" fill={col.armor}/>
        <rect x="14" y="13" width="3" height="2" fill={col.armor}/>
        {/* Shield (left hand) */}
        {state !== "praying" && <>
          <rect x="0" y="10" width="2" height="5" fill="#1E40AF"/>
          <rect x="0" y="11" width="2" height="1" fill={col.cross}/>
        </>}
        {/* Sword (right hand) */}
        {state !== "praying" && state !== "thinking" && <>
          <rect x="15" y="7" width="1" height="8" fill="#D1D5DB"/>
          <rect x="14" y="10" width="3" height="1" fill="#FCD34D"/>
        </>}
        {/* Praying hands */}
        {state === "praying" && <>
          <rect x="7" y="13" width="4" height="3" fill="#FDE68A"/>
          <rect x="8" y="12" width="2" height="1" fill="#FDE68A"/>
        </>}
        {/* Waist */}
        <rect x="5" y="13" width="8" height="2" fill={col.armor}/>
        {/* Tabard */}
        <rect x="6" y="13" width="6" height="5" fill="#EFF6FF"/>
        <rect x="8" y="14" width="2" height="3" fill={col.cross}/>
        {/* Legs */}
        <rect x="5" y="15" width="3" height="5" fill="#93C5FD"/>
        <rect x="10" y="15" width="3" height="5" fill="#93C5FD"/>
        {/* Boots */}
        <rect x="4" y="20" width="4" height="2" fill={col.armor}/>
        <rect x="10" y="20" width="4" height="2" fill={col.armor}/>
        {/* Boot spurs */}
        <rect x="4" y="22" width="5" height="1" fill={col.armor}/>
        <rect x="9" y="22" width="5" height="1" fill={col.armor}/>
      </svg>
      <style>{`
        @keyframes mascotBob { from{transform:translateY(0)} to{transform:translateY(-3px)} }
        @keyframes mascotPray { from{transform:translateY(0) scale(1)} to{transform:translateY(-2px) scale(1.02)} }
        @keyframes glowPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typingDot { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{ fontSize: 9, color: col.glow, marginTop: 2, fontFamily: "monospace", letterSpacing: 1, opacity: 0.8 }}>
        {state === "idle"     && "LOGOS"}
        {state === "thinking" && "..."}
        {state === "speaking" && "LOGOS"}
        {state === "praying"  && "🙏"}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "12px 16px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#3B82F6",
          animation: `typingDot 1s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
    </div>
  );
}

function PrayerModal({ onAccept, onDecline, prayer, loading }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      animation: "fadeIn 0.3s ease forwards",
    }}>
      <div style={{
        background: "#0F172A", border: "1px solid #1E40AF",
        borderRadius: 20, padding: "32px 28px", maxWidth: 420, width: "90%",
        textAlign: "center", animation: "slideUp 0.3s ease forwards",
        boxShadow: "0 0 40px #2563EB40",
      }}>
        {!prayer && !loading && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🙏</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: "#F1F5F9", marginBottom: 12 }}>
              Before you go...
            </div>
            <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, marginBottom: 28 }}>
              May Logos pray for you?
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onDecline} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}>Not today</button>
              <button onClick={onAccept} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: "#1D4ED8", border: "none",
                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Yes, please 🙏</button>
            </div>
          </>
        )}
        {loading && (
          <div>
            <PaladinMascot state="praying" />
            <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 16 }}>Logos is praying...</div>
          </div>
        )}
        {prayer && (
          <>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✝️</div>
            <div style={{
              fontSize: 13, color: "#CBD5E1", lineHeight: 2,
              fontStyle: "italic", marginBottom: 24, textAlign: "left",
              background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: 10,
              borderLeft: "3px solid #2563EB",
            }}>
              {prayer}
            </div>
            <button onClick={onDecline} style={{
              width: "100%", padding: "12px", borderRadius: 10,
              background: "#1D4ED8", border: "none",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>Amen 🙏</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [mascotState, setMascotState]   = useState("idle");
  const [loading, setLoading]           = useState(false);
  const [showPrayer, setShowPrayer]     = useState(false);
  const [prayer, setPrayer]             = useState("");
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [error, setError]               = useState("");
  const bottomRef = useRef(null);

  const BACKEND = "http://localhost:8000";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Greeting on mount
  useEffect(() => {
    setMessages([{
      role: "logos",
      text: "Greetings, seeker. I am Logos — the AI Paladin, armed with Scripture, reason, and 2000 years of Christian thought.\n\nAsk me anything — theology, doubt, challenges from other faiths, or simply what you've been wondering about. I am here to defend, explain, and guide.\n\n*\"In the beginning was the Word, and the Word was with God, and the Word was God.\" — John 1:1*",
    }]);
  }, []);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setError("");

    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    setMascotState("thinking");

    try {
      const history = newMessages
        .filter(m => m.role !== "system")
        .reduce((acc, m, i, arr) => {
          if (m.role === "user" && arr[i+1]?.role === "logos") {
            acc.push({ user: m.text, logos: arr[i+1].text });
          }
          return acc;
        }, []);

      const res = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();

      setMessages(prev => [...prev, { role: "logos", text: data.response }]);
      setMascotState("speaking");
      setTimeout(() => setMascotState("idle"), 2000);

      if (data.show_prayer) {
        setTimeout(() => setShowPrayer(true), 1500);
      }
    } catch (e) {
      setError("Could not reach Logos. Make sure the backend is running on port 8000.");
      setMascotState("idle");
    } finally {
      setLoading(false);
    }
  }

  async function handlePrayerAccept() {
    setPrayerLoading(true);
    setMascotState("praying");
    const summary = messages.slice(-4).map(m => `${m.role}: ${m.text}`).join("\n");
    try {
      const res = await fetch(`${BACKEND}/prayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true, conversation_summary: summary }),
      });
      const data = await res.json();
      setPrayer(data.prayer);
    } catch {
      setPrayer("Let us pray...\nLord, bless this seeker who came seeking truth. May Your light guide their path, and Your love surround them always. In Jesus' name, Amen.");
    } finally {
      setPrayerLoading(false);
      setMascotState("idle");
    }
  }

  async function handlePrayerDecline() {
    if (!prayer) {
      // Get the "God loves you" message
      try {
        const res = await fetch(`${BACKEND}/prayer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accepted: false, conversation_summary: "" }),
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: "logos", text: data.prayer }]);
      } catch {
        setMessages(prev => [...prev, {
          role: "logos",
          text: "That's perfectly alright. God loves you regardless, and I'll be here whenever you want to talk — whether it's theology, doubt, debate, or just curiosity. The door is always open. Go in peace. 🙏",
        }]);
      }
    }
    setShowPrayer(false);
    setPrayer("");
    setMascotState("idle");
  }

  function formatMessage(text) {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("*") && line.endsWith("*")) {
        return <div key={i} style={{ fontStyle: "italic", color: "#93C5FD", margin: "6px 0", fontSize: 13 }}>{line.slice(1,-1)}</div>;
      }
      if (!line.trim()) return <div key={i} style={{ height: 6 }}/>;
      return <div key={i} style={{ marginBottom: 2 }}>{line}</div>;
    });
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#060B18",
      fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 2px; }
        textarea { resize: none; }
      `}</style>

      {/* Background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, #1E3A5F30 0%, transparent 60%)",
      }}/>

      {/* Header */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid #1E3A5F",
        display: "flex", alignItems: "center", gap: 16,
        background: "rgba(6,11,24,0.95)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <PaladinMascot state={mascotState}/>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#F1F5F9", letterSpacing: 2 }}>LOGOS</div>
          <div style={{ fontSize: 11, color: "#3B82F6", letterSpacing: 1 }}>THE AI PALADIN · DEFENDER OF THE FAITH</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#1E40AF", padding: "4px 10px", border: "1px solid #1E40AF", borderRadius: 20 }}>
          {mascotState === "thinking" ? "⚔️ Seeking..." : mascotState === "praying" ? "🙏 Praying..." : "✝️ Ready"}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", maxWidth: 760, width: "100%", margin: "0 auto" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, marginBottom: 20,
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            animation: "fadeIn 0.3s ease forwards",
          }}>
            {msg.role === "logos" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1E3A5F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✝️</div>
            )}
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user" ? "#1D4ED8" : "rgba(255,255,255,0.04)",
              border: msg.role === "user" ? "none" : "1px solid #1E3A5F",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px",
              fontSize: 14, color: "#E2E8F0", lineHeight: 1.8,
            }}>
              {formatMessage(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1E3A5F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✝️</div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1E3A5F", borderRadius: "18px 18px 18px 4px" }}>
              <TypingIndicator/>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#F87171", fontSize: 13, padding: "10px 14px", background: "#2A0A0A", borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ maxWidth: 760, width: "100%", margin: "0 auto", padding: "0 16px 16px" }}>
          <div style={{ fontSize: 11, color: "#374151", marginBottom: 8, textAlign: "center" }}>Try asking...</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              "Why does God allow suffering?",
              "How do Christians respond to Islam's view of Jesus?",
              "Is the Bible historically reliable?",
              "What is the Trinity?",
              "How do you prove God exists?",
            ].map(q => (
              <button key={q} onClick={() => { setInput(q); }}
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid #1E3A5F",
                  borderRadius: 20, padding: "6px 14px", color: "#64748B",
                  fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "16px", borderTop: "1px solid #1E3A5F",
        background: "rgba(6,11,24,0.95)", backdropFilter: "blur(10px)",
        maxWidth: 760, width: "100%", margin: "0 auto",
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
            placeholder="Ask Logos anything about faith, theology, or challenge the faith..."
            rows={2}
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: `1.5px solid ${input ? "#2563EB60" : "#1E3A5F"}`,
              borderRadius: 14, padding: "12px 16px", color: "#F1F5F9",
              fontSize: 14, fontFamily: "inherit", outline: "none",
              lineHeight: 1.6, transition: "border-color 0.2s",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: input.trim() && !loading ? "#1D4ED8" : "rgba(255,255,255,0.05)",
              border: "none", color: input.trim() && !loading ? "#fff" : "#374151",
              fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              flexShrink: 0, transition: "all 0.2s",
            }}>⚔️</button>
        </div>
        <div style={{ fontSize: 10, color: "#1E3A5F", marginTop: 8, textAlign: "center" }}>
          "For the word of God is alive and active, sharper than any double-edged sword." — Hebrews 4:12
        </div>
      </div>

      {/* Prayer Modal */}
      {showPrayer && (
        <PrayerModal
          onAccept={handlePrayerAccept}
          onDecline={handlePrayerDecline}
          prayer={prayer}
          loading={prayerLoading}
        />
      )}
    </div>
  );
}

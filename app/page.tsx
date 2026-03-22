"use client";
import { useState, useEffect } from "react";

const C = {
  red:    "#E8271C",
  orange: "#FF5C1A",
  blue:   "#1B2EC5",
  blue2:  "#0d1d99",
  pink:   "#FF1A8C",
  green:  "#007845",
  yellow: "#FFB800",
  cream:  "#F5F0E8",
  dark:   "#09126b",
};

const STEPS = [
  { id: 1, icon: "🎬", label: "Creative Director", desc: "Breaking down your vision"   },
  { id: 2, icon: "🤖", label: "Gemini AI",          desc: "Engineering the mega prompt" },
  { id: 3, icon: "🚀", label: "Runway Gen-4.5",     desc: "Rendering your cinematic"   },
  { id: 4, icon: "⬇️", label: "Finalizing",         desc: "Almost done!"               },
];

const EXAMPLES = [
  "Dark luxury fashion ad — model in slow-mo, city neon lights, teal-orange grade",
  "Tech startup reel — glowing code, bold typography, futuristic dark UI",
  "Fitness brand — athlete training at night, raw energy, dramatic moody light",
];

/* ── Starburst ───────────────────────────────────────────────── */
function Starburst({ size, color, points = 12, spin = false, rev = false, style = {} }:
  { size: number; color: string; points?: number; spin?: boolean; rev?: boolean; style?: React.CSSProperties }) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (Math.PI / points) * i - Math.PI / 2;
    const r = i % 2 === 0 ? size / 2 : size / 4.5;
    pts.push(`${size / 2 + r * Math.cos(a)},${size / 2 + r * Math.sin(a)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ ...style, display: "block", animation: spin ? `${rev ? "spin-rev" : "spin-slow"} ${14 + (size % 8)}s linear infinite` : undefined }}>
      <polygon points={pts.join(" ")} fill={color} />
    </svg>
  );
}

/* ── 4-pt Sparkle ────────────────────────────────────────────── */
function Sparkle({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", animation: `twinkle ${2.5 + delay}s ease-in-out ${delay}s infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
      </svg>
    </div>
  );
}

/* ── Desi divider ────────────────────────────────────────────── */
function DesiDivider({ color = C.yellow }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.3 }} />
      <span style={{ color, fontSize: 13, opacity: 0.7 }}>✦ ✦ ✦</span>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.3 }} />
    </div>
  );
}

/* ── Red frame ───────────────────────────────────────────────── */
function RedFrame() {
  const T = 14;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0,    left: 0, right: 0,  height: T, background: C.red }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,  height: T, background: C.red }} />
      <div style={{ position: "absolute", top: 0,    left: 0, bottom: 0, width:  T, background: C.red }} />
      <div style={{ position: "absolute", top: 0,    right: 0,bottom: 0, width:  T, background: C.red }} />
      <div style={{ position: "absolute", top: T+4, left: T+4, right: T+4, bottom: T+4, border: `1px solid ${C.red}44`, borderRadius: 2 }} />
      {[{top:T-1,left:T-1},{top:T-1,right:T-1},{bottom:T-1,left:T-1},{bottom:T-1,right:T-1}].map((pos,i)=>(
        <div key={i} style={{ position:"absolute",...pos as React.CSSProperties, width:24,height:24,background:C.yellow, clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }} />
      ))}
    </div>
  );
}

/* ── Scan line ───────────────────────────────────────────────── */
function ScanLine() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:9997,pointerEvents:"none",overflow:"hidden" }}>
      <div style={{
        position:"absolute",left:0,width:"100%",height:"2px",
        background:`linear-gradient(90deg,transparent,${C.yellow}33,transparent)`,
        animation:"scan-sweep 8s linear infinite",
      }} />
    </div>
  );
}

/* ── Background decorations ──────────────────────────────────── */
function BgDecor() {
  const sparkles = [
    {x:"8%",y:"10%",size:22,color:C.yellow,delay:0},
    {x:"84%",y:"7%",size:16,color:C.pink,delay:0.8},
    {x:"4%",y:"52%",size:13,color:C.cream,delay:1.5},
    {x:"91%",y:"42%",size:20,color:C.orange,delay:0.4},
    {x:"14%",y:"82%",size:15,color:C.yellow,delay:2},
    {x:"78%",y:"78%",size:11,color:C.pink,delay:1.2},
    {x:"50%",y:"5%",size:13,color:C.cream,delay:0.6},
    {x:"40%",y:"90%",size:17,color:C.orange,delay:1.8},
  ];
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
      <div className="stripe-bg" style={{ position:"absolute",inset:0 }} />
      <div style={{ position:"absolute",top:-40,left:-40,opacity:0.12 }}>
        <Starburst size={280} color={C.yellow} points={16} spin />
      </div>
      <div style={{ position:"absolute",bottom:-60,right:-60,opacity:0.1 }}>
        <Starburst size={320} color={C.pink} points={12} spin rev />
      </div>
      <div style={{ position:"absolute",top:80,right:-20,opacity:0.08 }}>
        <Starburst size={200} color={C.orange} points={10} spin />
      </div>
      <div style={{ position:"absolute",top:"40%",left:-30,opacity:0.07 }}>
        <Starburst size={180} color={C.cream} points={14} spin rev />
      </div>
      <div style={{ position:"absolute",top:"30%",left:"50%",transform:"translateX(-50%)",width:600,height:400,borderRadius:"50%",background:C.blue2,filter:"blur(80px)",opacity:0.5 }} />
      {sparkles.map((s,i) => <Sparkle key={i} {...s} />)}
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────────────────── */
export default function Home() {
  const [brief, setBrief]       = useState("");
  const [runwayKey, setRunwayKey] = useState("");
  const [showKey, setShowKey]   = useState(false);
  const [status, setStatus]     = useState<"idle"|"loading"|"done"|"error">("idle");
  const [currentStep, setStep]  = useState(0);
  const [stepDone, setStepDone] = useState<number[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [prompt, setPrompt]     = useState("");
  const [error, setError]       = useState("");
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function generate() {
    if (!brief.trim()) return;
    setStatus("loading"); setStep(1); setStepDone([]);
    setVideoUrl(""); setError(""); setPrompt("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, runwayKey }),
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data:"));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(5));
            if (data.step)   { setStep(data.step); setStepDone(p => [...p, data.step - 1]); }
            if (data.prompt) setPrompt(data.prompt);
            if (data.video)  { setVideoUrl(data.video); setStatus("done"); }
            if (data.error)  { setError(data.error); setStatus("error"); }
          } catch {}
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }

  if (!mounted) return null;

  return (
    <>
      <RedFrame />
      <ScanLine />
      <BgDecor />

      <main style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, #1e35d6 0%, ${C.blue} 40%, #0d1a99 100%)`,
        position: "relative", zIndex: 1,
        padding: "clamp(30px,5vw,60px) clamp(14px,3vw,20px) 60px",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>

          {/* ── TITLE ── */}
          <div style={{ textAlign: "center", marginBottom: "clamp(32px,6vw,56px)" }}>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 22px", borderRadius: 999, marginBottom: 22,
              background: `${C.red}22`, border: `2px solid ${C.red}66`,
              color: C.red, fontSize: "clamp(9px,1.5vw,11px)",
              fontWeight: 800, letterSpacing: "0.22em",
              fontFamily: "'Outfit',sans-serif", backdropFilter: "blur(10px)",
            }}>
              <span style={{ animation: "breathe 1.4s ease-in-out infinite", display: "inline-block" }}>●</span>
              AI VIDEO GENERATOR — LIVE
            </div>

            {/* Title */}
            <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
              <div style={{ position: "absolute", top: "50%", left: "2%", transform: "translateY(-50%)", opacity: 0.95 }}>
                <Starburst size={60} color={C.yellow} points={8} spin />
              </div>
              <div style={{ position: "absolute", top: "50%", right: "2%", transform: "translateY(-50%)", opacity: 0.95 }}>
                <Starburst size={60} color={C.pink} points={8} spin rev />
              </div>
              <h1 className="bebas" style={{
                fontSize: "clamp(3.6rem,12vw,7.5rem)",
                lineHeight: 0.95, whiteSpace: "nowrap",
                background: `linear-gradient(135deg,${C.cream} 0%,${C.orange} 40%,${C.red} 70%,${C.yellow} 100%)`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "text-shimmer 4s linear infinite",
                display: "block",
                padding: "0 clamp(48px,9vw,86px)",
              }}>
                YOGI THE EDITOR
              </h1>
              <h1 aria-hidden className="bebas" style={{
                position: "absolute", inset: 0,
                fontSize: "clamp(3.6rem,12vw,7.5rem)", lineHeight: 0.95, whiteSpace: "nowrap",
                background: `linear-gradient(135deg,${C.pink} 0%,${C.green} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                padding: "0 clamp(48px,9vw,86px)",
                animation: "glitch-ghost 10s infinite",
                userSelect: "none", pointerEvents: "none",
              }}>
                YOGI THE EDITOR
              </h1>
            </div>

            <p className="outfit" style={{
              fontSize: "clamp(12px,2.5vw,17px)", fontWeight: 600,
              color: `${C.cream}88`, margin: "10px 0 14px", letterSpacing: "0.06em",
            }}>
              Describe your vision → AI creates your cinematic video ✦
            </p>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(7px,1.5vw,12px)" }}>
              {[
                { label: "Gemini 2.5",     color: C.green  },
                { label: "Runway Gen-4.5", color: C.orange },
                { label: "HD Cinematic",   color: C.pink   },
                { label: "Vertical 9:16",  color: C.yellow },
              ].map(({ label, color }) => (
                <span key={label} className="outfit" style={{
                  padding: "4px 14px", borderRadius: 999,
                  background: `${color}18`, border: `1.5px solid ${color}55`,
                  color, fontSize: "clamp(9px,1.5vw,11px)", fontWeight: 700, letterSpacing: "0.1em",
                }}>
                  ✦ {label}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <DesiDivider color={C.yellow} />
            </div>
          </div>

          {/* ── INPUT CARD ── */}
          <div style={{
            borderRadius: "clamp(14px,3vw,22px)",
            padding: "clamp(20px,4vw,34px)",
            marginBottom: 18,
            background: `${C.dark}cc`, backdropFilter: "blur(20px)",
            border: `2.5px solid ${C.red}55`,
            boxShadow: `0 0 0 4px ${C.red}15, inset 0 0 40px ${C.blue2}88`,
            position: "relative", overflow: "visible",
          }}>
            {/* Corner starbursts */}
            {[
              { top: -16, left: -16,  color: C.yellow, rev: false },
              { top: -16, right: -16, color: C.orange, rev: true  },
              { bottom: -16, left: -16,  color: C.pink,   rev: true  },
              { bottom: -16, right: -16, color: C.yellow, rev: false },
            ].map((s, i) => {
              const { color, rev, ...pos } = s;
              return (
                <div key={i} style={{ position: "absolute", ...pos as React.CSSProperties, opacity: 0.8, zIndex: 10 }}>
                  <Starburst size={38} color={color} points={8} spin rev={rev} />
                </div>
              );
            })}

            {/* Runway API Key */}
            <div style={{ marginBottom: 18 }}>
              <label className="bebas" style={{
                display: "block", fontSize: "clamp(13px,2vw,16px)",
                letterSpacing: "0.12em", color: C.orange, marginBottom: 8,
              }}>
                🔑 Runway API Key
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showKey ? "text" : "password"}
                  value={runwayKey}
                  onChange={e => setRunwayKey(e.target.value)}
                  placeholder="key_xxxxxxxx...  (runway.ml → Account → API Keys)"
                  disabled={status === "loading"}
                  className="outfit"
                  style={{
                    width: "100%", borderRadius: 10,
                    padding: "clamp(10px,1.8vw,14px) 48px clamp(10px,1.8vw,14px) clamp(12px,2vw,16px)",
                    fontSize: "clamp(11px,1.8vw,13px)",
                    outline: "none",
                    background: `${C.blue2}cc`,
                    border: `2px solid ${C.orange}44`,
                    color: C.cream,
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    fontFamily: "inherit",
                  }}
                  onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orange}22`; }}
                  onBlur={e  => { e.target.style.borderColor = `${C.orange}44`; e.target.style.boxShadow = "none"; }}
                />
                <button onClick={() => setShowKey(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: `${C.cream}55`, fontSize: 16, padding: 4,
                  }}
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="outfit" style={{ fontSize: "clamp(9px,1.4vw,10px)", marginTop: 6, color: `${C.cream}44`, letterSpacing: "0.05em" }}>
                Free account banao: <span style={{ color: C.orange }}>runway.ml</span> → Sign Up → Account → API Keys → Create Key
              </p>
            </div>

            <label className="bebas" style={{
              display: "block", fontSize: "clamp(14px,2.5vw,18px)",
              letterSpacing: "0.12em", color: C.yellow, marginBottom: 12,
            }}>
              🎬 Describe Your Video Brief
            </label>

            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder="e.g. Dark cinematic city ad — moody teal-orange Hollywood grade, slow motion, bold text drop..."
              rows={4}
              disabled={status === "loading"}
              className="outfit"
              style={{
                width: "100%", borderRadius: 12,
                padding: "clamp(12px,2vw,18px)",
                fontSize: "clamp(12px,2vw,14px)",
                resize: "vertical", outline: "none",
                background: `${C.blue2}cc`,
                border: `2px solid ${C.red}33`,
                color: C.cream, lineHeight: 1.8,
                transition: "border-color 0.3s, box-shadow 0.3s",
                fontFamily: "inherit",
              }}
              onFocus={e => { e.target.style.borderColor = C.yellow; e.target.style.boxShadow = `0 0 0 3px ${C.yellow}33`; }}
              onBlur={e  => { e.target.style.borderColor = `${C.red}33`; e.target.style.boxShadow = "none"; }}
            />

            <div style={{ marginTop: 14 }}>
              <p className="outfit" style={{ fontSize: "clamp(9px,1.5vw,10px)", fontWeight: 700, marginBottom: 8, color: `${C.cream}44`, letterSpacing: "0.18em" }}>
                ✦ TRY AN EXAMPLE:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => setBrief(ex)} disabled={status === "loading"}
                    className="outfit"
                    style={{
                      fontSize: "clamp(9px,1.5vw,11px)", padding: "6px 14px", borderRadius: 999,
                      cursor: "pointer", background: `${C.blue2}cc`,
                      border: `1.5px solid ${C.yellow}33`, color: `${C.cream}66`,
                      fontFamily: "inherit", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = C.yellow;
                      (e.currentTarget as HTMLButtonElement).style.color = C.yellow;
                      (e.currentTarget as HTMLButtonElement).style.background = `${C.yellow}22`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.yellow}33`;
                      (e.currentTarget as HTMLButtonElement).style.color = `${C.cream}66`;
                      (e.currentTarget as HTMLButtonElement).style.background = `${C.blue2}cc`;
                    }}
                  >
                    {ex.slice(0, 38)}…
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={status === "loading" || !brief.trim()}
              className="bebas"
              style={{
                width: "100%", marginTop: 20,
                padding: "clamp(16px,3vw,22px) 24px",
                borderRadius: 14, fontSize: "clamp(18px,3.5vw,26px)", letterSpacing: "0.12em",
                background: (!brief.trim() || status === "loading")
                  ? "#222"
                  : `linear-gradient(135deg,${C.red} 0%,${C.orange} 50%,${C.yellow} 100%)`,
                color: (!brief.trim() || status === "loading") ? "#555" : C.dark,
                cursor: !brief.trim() ? "not-allowed" : "pointer",
                border: "none",
                boxShadow: (status !== "loading" && brief.trim())
                  ? `0 6px 30px ${C.red}88, 0 0 60px ${C.orange}44` : "none",
                position: "relative", overflow: "hidden", transition: "all 0.3s",
                fontFamily: "'Bebas Neue', sans-serif",
              }}
              onMouseEnter={e => { if (brief.trim() && status !== "loading") (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.01)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              {status !== "loading" && brief.trim() && (
                <span style={{
                  position: "absolute", top: 0, width: "35%", height: "100%",
                  background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)",
                  animation: "btn-scan 2.5s ease-in-out infinite",
                }} />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                {status === "loading" ? "⏳  Generating Your Video..." : "✦  Generate AI Video  ✦"}
              </span>
            </button>
          </div>

          {/* ── PROGRESS ── */}
          {status === "loading" && (
            <div style={{
              borderRadius: 20, padding: "clamp(18px,4vw,28px)", marginBottom: 18,
              background: `${C.dark}cc`, backdropFilter: "blur(20px)",
              border: `2px solid ${C.orange}44`, boxShadow: `0 0 40px ${C.orange}22`,
              animation: "reveal-up 0.4s ease-out",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.orange, animation: "breathe 1s ease-in-out infinite", boxShadow: `0 0 12px ${C.orange}` }} />
                <p className="bebas" style={{ fontSize: "clamp(14px,2.5vw,18px)", letterSpacing: "0.15em", color: C.orange, margin: 0 }}>
                  PIPELINE RUNNING
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {STEPS.map((s, idx) => {
                  const done   = stepDone.includes(s.id);
                  const active = currentStep === s.id;
                  return (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, animation: `step-in 0.5s ease-out ${idx * 0.1}s both` }}>
                      <div style={{
                        width: "clamp(38px,6vw,48px)", height: "clamp(38px,6vw,48px)",
                        borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "clamp(14px,2.2vw,18px)",
                        background: done ? `linear-gradient(135deg,${C.green},#00aa55)` : active ? `${C.orange}33` : `${C.blue2}88`,
                        border: `2px solid ${done ? C.green : active ? C.orange : "#1a2a88"}`,
                        boxShadow: active ? `0 0 20px ${C.orange}88` : done ? `0 0 16px ${C.green}66` : "none",
                        transition: "all 0.4s",
                      }}>
                        {done
                          ? <span style={{ animation: "check-pop 0.4s ease-out", display: "inline-block", color: C.cream, fontSize: 18, fontWeight: 900 }}>✓</span>
                          : s.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="outfit" style={{ fontSize: "clamp(12px,2vw,15px)", fontWeight: 700, margin: "0 0 2px", color: done ? C.green : active ? C.cream : "#334499", transition: "color 0.4s" }}>{s.label}</p>
                        <p className="outfit" style={{ fontSize: "clamp(10px,1.6vw,12px)", margin: 0, color: "#334488" }}>{s.desc}</p>
                      </div>
                      {active && !done && (
                        <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `2px solid ${C.orange}33`, borderTop: `2px solid ${C.orange}`, animation: "spin-faster 0.8s linear infinite" }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 20, height: 5, background: "#0a1066", borderRadius: 99, overflow: "hidden", border: `1px solid ${C.orange}22` }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  background: `linear-gradient(90deg,${C.red},${C.orange},${C.yellow})`,
                  width: `${(currentStep / STEPS.length) * 100}%`,
                  transition: "width 0.9s ease",
                  boxShadow: `0 0 10px ${C.orange}`,
                }} />
              </div>
            </div>
          )}

          {/* ── PROMPT ── */}
          {prompt && (
            <div style={{
              borderRadius: 16, padding: "clamp(14px,3vw,22px)", marginBottom: 18,
              background: `${C.dark}cc`, backdropFilter: "blur(12px)",
              border: `1.5px solid ${C.green}33`, animation: "reveal-up 0.5s ease-out",
            }}>
              <p className="bebas" style={{ fontSize: "clamp(12px,2vw,15px)", marginBottom: 8, color: C.green, letterSpacing: "0.18em" }}>🤖 GEMINI MEGA PROMPT</p>
              <DesiDivider color={C.green} />
              <p className="outfit" style={{ fontSize: "clamp(11px,1.8vw,13px)", lineHeight: 1.85, color: `${C.cream}77`, margin: "10px 0 0" }}>{prompt}</p>
            </div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <div style={{ borderRadius: 14, padding: "clamp(14px,3vw,20px)", marginBottom: 18, background: "#2a0008cc", border: `2px solid ${C.red}66`, animation: "reveal-up 0.4s ease-out" }}>
              <p className="outfit" style={{ fontSize: "clamp(12px,2vw,14px)", fontWeight: 700, color: C.red, margin: 0 }}>❌ {error}</p>
            </div>
          )}

          {/* ── VIDEO RESULT ── */}
          {status === "done" && videoUrl && (
            <div style={{
              borderRadius: 22, padding: "clamp(20px,4vw,34px)", textAlign: "center",
              background: `${C.dark}cc`, backdropFilter: "blur(24px)",
              border: `2.5px solid ${C.yellow}55`,
              boxShadow: `0 0 80px ${C.orange}33, 0 0 160px ${C.red}11`,
              animation: "reveal-up 0.6s ease-out",
              position: "relative",
            }}>
              {[{top:-14,left:-14,color:C.yellow,rev:false},{top:-14,right:-14,color:C.orange,rev:true}].map((s,i) => {
                const { color, rev, ...pos } = s;
                return (
                  <div key={i} style={{ position:"absolute",...pos as React.CSSProperties,opacity:0.85,zIndex:5 }}>
                    <Starburst size={40} color={color} points={8} spin rev={rev} />
                  </div>
                );
              })}

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 22px", borderRadius: 999, marginBottom: 18,
                background: `${C.yellow}22`, border: `2px solid ${C.yellow}66`, color: C.yellow,
                fontSize: "clamp(11px,2vw,14px)", fontWeight: 800,
                fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.15em",
              }}>
                <span style={{ animation: "breathe 1.5s ease-in-out infinite", display: "inline-block" }}>●</span>
                YOUR VIDEO IS READY
              </div>

              <DesiDivider color={C.yellow} />

              <video src={videoUrl} controls autoPlay
                style={{
                  width: "100%", borderRadius: 14, margin: "18px 0",
                  maxHeight: "clamp(300px,55vw,580px)", background: "#000",
                  border: `2px solid ${C.yellow}44`, boxShadow: `0 8px 50px ${C.orange}44`,
                }}
              />

              <a href={videoUrl} download="yogi-ai-video.mp4" className="bebas"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "clamp(14px,3vw,18px) clamp(32px,6vw,60px)",
                  borderRadius: 14, fontSize: "clamp(16px,3vw,22px)", letterSpacing: "0.12em",
                  background: `linear-gradient(135deg,${C.red},${C.orange},${C.yellow})`,
                  color: C.dark, textDecoration: "none", boxShadow: `0 6px 30px ${C.red}88`,
                  transition: "transform 0.2s", fontFamily: "'Bebas Neue',sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05) translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                ⬇️ Download MP4
              </a>
            </div>
          )}

          {/* ── FOOTER ── */}
          <div style={{ textAlign: "center", marginTop: "clamp(32px,6vw,52px)" }}>
            <DesiDivider color={C.red} />
            <p className="outfit" style={{ fontSize: "clamp(9px,1.5vw,11px)", color: `${C.cream}33`, letterSpacing: "0.12em", marginTop: 12 }}>
              ✦ Powered by Gemini · Runway Gen-4.5 · Built by Yogi The Editor ✦
            </p>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes spin-slow   { to { transform: rotate(360deg); } }
        @keyframes spin-rev    { to { transform: rotate(-360deg); } }
        @keyframes spin-faster { to { transform: rotate(360deg); } }
        @keyframes twinkle     { 0%,100% { opacity:.15;transform:scale(1); } 50% { opacity:1;transform:scale(1.3); } }
        @keyframes breathe     { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
        @keyframes scan-sweep  { 0% { top:-2px; } 100% { top:102%; } }
        @keyframes text-shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes glitch-ghost { 0%,88%,100% { opacity:0; } 89%,93% { opacity:0.5; } }
        @keyframes btn-scan    { 0% { left:-60%; } 100% { left:130%; } }
        @keyframes step-in     { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:none; } }
        @keyframes check-pop   { 0% { transform:scale(0) rotate(-30deg); } 70% { transform:scale(1.3) rotate(8deg); } 100% { transform:scale(1) rotate(0); } }
        @keyframes reveal-up   { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:none; } }
        textarea::placeholder  { color: rgba(180,180,220,0.35); }
        textarea { scrollbar-width: thin; scrollbar-color: ${C.red}44 transparent; }
      `}</style>
    </>
  );
}

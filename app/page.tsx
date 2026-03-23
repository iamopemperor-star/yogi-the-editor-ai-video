"use client";
import { useState, useEffect, useRef } from "react";

/* ══════════════ PALETTE (from reference images) ══════════════ */
const MAG  = "#FF0090";   // Hot magenta
const NEO  = "#00FF41";   // Neon green
const PUR  = "#1A0066";   // Deep purple
const PUR2 = "#2D0080";   // Purple mid
const ORG  = "#FF8C00";   // Orange
const GLD  = "#FFB800";   // Gold
const BLU  = "#0055FF";   // Blue neon
const CRM  = "#F5F0E8";   // Cream
const DRK  = "#0D0040";   // Very dark

/* ══════════════ MODELS ══════════════ */
const MODELS = [
  { id:"gen4.5",      name:"Gen 4.5",      badge:"BEST",    color:GLD, glow:"#FFB80088", stars:5, desc:"Max quality · 10s" },
  { id:"gen4_turbo",  name:"Gen 4 Turbo",  badge:"FAST",    color:NEO, glow:"#00FF4188", stars:4, desc:"Balanced · 5s"     },
  { id:"gen3a_turbo", name:"Gen 3 Turbo",  badge:"LITE",    color:MAG, glow:"#FF009088", stars:3, desc:"Budget · 5s"       },
];

const STEPS = [
  {id:1,icon:"🎬",label:"Preparing",  desc:"Setting up request"},
  {id:2,icon:"🚀",label:"Queued",     desc:"Runway received your prompt"},
  {id:3,icon:"⏳",label:"Rendering",  desc:"AI generating frames (1-3 min)"},
  {id:4,icon:"✨",label:"Finishing",  desc:"Almost ready!"},
];

/* ══════════════ LIQUID GLASS CARD ══════════════ */
function Glass({ children, style, glow }:
  { children: React.ReactNode; style?: React.CSSProperties; glow?: string }) {
  return (
    <div style={{
      background: "rgba(26,0,102,0.4)",
      backdropFilter: "blur(28px) saturate(180%)",
      WebkitBackdropFilter: "blur(28px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "clamp(14px,3vw,22px)",
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12), ${glow ? `0 0 40px ${glow}` : ""}`,
      position: "relative", overflow: "hidden",
      animation: "card-border 6s ease-in-out infinite",
      ...style,
    }}>
      {/* liquid shine sweep */}
      <div style={{
        position:"absolute",top:0,left:0,width:"60%",height:"100%",pointerEvents:"none",
        background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)",
        animation:"liquid-shine 5s ease-in-out infinite",zIndex:0,
      }}/>
      {/* top edge highlight */}
      <div style={{
        position:"absolute",top:0,left:"10%",width:"80%",height:"1px",pointerEvents:"none",
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",zIndex:1,
      }}/>
      <div style={{ position:"relative", zIndex:2 }}>{children}</div>
    </div>
  );
}

/* ══════════════ 3D DIAMOND ══════════════ */
function Diamond3D({ size, color, top, left, right, bottom, delay, opacity=0.7 }:
  { size:number; color:string; top?:string; left?:string; right?:string; bottom?:string; delay:number; opacity?:number }) {
  return (
    <div style={{
      position:"absolute", top, left, right, bottom, width:size, height:size,
      animation:`diamond-spin ${10+delay}s ease-in-out ${delay}s infinite`,
      opacity, pointerEvents:"none", zIndex:0,
    }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id={`dg${delay}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#fff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        <polygon points="50,2 98,50 50,98 2,50" fill={`url(#dg${delay})`}
          stroke={color} strokeWidth="1" opacity="0.8"/>
        <polygon points="50,20 80,50 50,80 20,50" fill="none"
          stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
      </svg>
    </div>
  );
}

/* ══════════════ SPARKLE ══════════════ */
function Spark({ x, y, size, color, delay }:
  { x:string; y:string; size:number; color:string; delay:number }) {
  return (
    <div style={{ position:"absolute",left:x,top:y,pointerEvents:"none",
      animation:`twinkle ${2.5+delay}s ease-in-out ${delay}s infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z"
          fill={color} style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
      </svg>
    </div>
  );
}

/* ══════════════ TRUCK ART TITLE ══════════════ */
function TruckTitle() {
  return (
    <div style={{ textAlign:"center", position:"relative", userSelect:"none" }}>
      {/* Devanagari script decoration */}
      <div style={{
        fontFamily:"'Noto Serif Devanagari',serif",
        fontSize:"clamp(14px,2.2vw,20px)", letterSpacing:"0.05em",
        color:GLD, opacity:0.9, marginBottom:8,
        textShadow:`0 0 14px ${GLD}88`,
        animation:"breathe 3s ease-in-out infinite",
        lineHeight:1.6, wordSpacing:"0.15em",
      }}>
        ✦ &nbsp;न कर्म बन्धनं शिवाय&nbsp; ✦
      </div>

      {/* Main truck art text */}
      <div style={{ position:"relative", display:"inline-block" }}>
        <h1 style={{
          fontFamily:"'Bebas Neue',Impact,sans-serif",
          fontSize:"clamp(3rem,11vw,7.5rem)",
          lineHeight:0.95, letterSpacing:"0.04em",
          background:`linear-gradient(135deg,${GLD} 0%,${CRM} 35%,${MAG} 65%,${GLD} 100%)`,
          backgroundSize:"300% auto",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"truck-shimmer 5s linear infinite",
        }}>YOGI THE EDITOR</h1>
      </div>

      {/* Truck art border line */}
      <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:10,justifyContent:"center" }}>
        {[MAG,NEO,ORG,BLU,GLD].map((c,i)=>(
          <div key={i} style={{ height:3,flex:1,maxWidth:60,background:c,borderRadius:99,
            opacity:0.7,boxShadow:`0 0 6px ${c}`,animation:`breathe ${2+i*0.3}s ease-in-out ${i*0.2}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ══════════════ MODEL SELECTOR ══════════════ */
function ModelPicker({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div>
      <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(13px,2.2vw,17px)",
        letterSpacing:"0.15em",color:GLD,marginBottom:10 }}>
        🎯 SELECT AI MODEL
      </p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(6px,2vw,12px)" }}>
        {MODELS.map(m=>{
          const active = value===m.id;
          return (
            <button key={m.id} onClick={()=>onChange(m.id)} style={{
              padding:"clamp(10px,2vw,16px) 8px",borderRadius:14,border:"none",
              cursor:"pointer",transition:"all 0.3s",position:"relative",overflow:"hidden",
              background:active?`linear-gradient(135deg,${m.color}33,${DRK})`:"rgba(13,0,64,0.6)",
              backdropFilter:"blur(20px)",
              boxShadow:active?`0 0 0 2px ${m.color},0 0 20px ${m.glow},inset 0 1px 0 rgba(255,255,255,0.1)`
                :"0 0 0 1px rgba(255,255,255,0.08),inset 0 1px 0 rgba(255,255,255,0.05)",
              transform:active?"translateY(-2px)":"none",
            }}>
              {active&&<div style={{ position:"absolute",top:0,left:0,width:"50%",height:"100%",
                background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)",
                animation:"liquid-shine 3s ease-in-out infinite",pointerEvents:"none" }}/>}
              {/* Badge */}
              <div style={{
                fontSize:"clamp(7px,1.1vw,9px)",fontWeight:800,letterSpacing:"0.15em",
                padding:"2px 8px",borderRadius:999,display:"inline-block",marginBottom:6,
                background:m.color,color:DRK,fontFamily:"'Outfit',sans-serif",
              }}>{m.badge}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(13px,2.2vw,18px)",
                letterSpacing:"0.08em",color:active?m.color:CRM,lineHeight:1.1,
                textShadow:active?`0 0 12px ${m.color}`:undefined }}>
                {m.name}
              </div>
              <div style={{ fontSize:"clamp(8px,1.3vw,10px)",color:`${CRM}77`,marginTop:3,
                fontFamily:"'Outfit',sans-serif" }}>
                {m.desc}
              </div>
              <div style={{ marginTop:6,fontSize:"clamp(8px,1.3vw,11px)",
                color:active?m.color:`${CRM}44`,textShadow:active?`0 0 8px ${m.color}`:undefined }}>
                {"★".repeat(m.stars)}{"☆".repeat(5-m.stars)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════ BACKGROUND ══════════════ */
function Background() {
  const sparks = [
    {x:"6%",y:"7%",size:18,color:GLD,delay:0},   {x:"87%",y:"5%",size:14,color:MAG,delay:0.7},
    {x:"2%",y:"52%",size:12,color:NEO,delay:1.4}, {x:"91%",y:"44%",size:16,color:ORG,delay:0.3},
    {x:"13%",y:"87%",size:13,color:GLD,delay:1.9},{x:"82%",y:"82%",size:10,color:MAG,delay:1.1},
    {x:"47%",y:"3%",size:11,color:NEO,delay:0.5}, {x:"44%",y:"91%",size:15,color:ORG,delay:1.6},
    {x:"25%",y:"20%",size:8,color:BLU,delay:2.2}, {x:"70%",y:"65%",size:9,color:NEO,delay:0.9},
  ];
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
      {/* Gradient bg */}
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse at 20% 10%,${MAG}22 0%,transparent 50%),
                    radial-gradient(ellipse at 80% 90%,${NEO}18 0%,transparent 50%),
                    radial-gradient(ellipse at 50% 50%,${PUR2} 0%,${PUR} 100%)`,
      }}/>
      {/* Diagonal stripe texture */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.015) 10px,rgba(255,255,255,0.015) 20px)`,
      }}/>
      {/* Oversized bg text (like ref image 2) */}
      <div style={{
        position:"absolute",top:"15%",left:"-5%",right:"-5%",textAlign:"center",
        fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(80px,20vw,200px)",
        letterSpacing:"0.1em",color:PUR2,lineHeight:1,userSelect:"none",opacity:0.5,
        WebkitTextStroke:`1px ${PUR2}`,
      }}>AI VIDEO</div>
      {/* 3D Diamonds */}
      <Diamond3D size={70}  color={MAG} top="8%"  left="3%"   delay={0}   opacity={0.5}/>
      <Diamond3D size={50}  color={NEO} top="12%" right="4%"  delay={2}   opacity={0.4}/>
      <Diamond3D size={40}  color={GLD} top="70%" left="2%"   delay={4}   opacity={0.35}/>
      <Diamond3D size={60}  color={ORG} top="65%" right="2%"  delay={1.5} opacity={0.4}/>
      <Diamond3D size={30}  color={BLU} top="40%" left="1%"   delay={3}   opacity={0.3}/>
      <Diamond3D size={35}  color={MAG} top="35%" right="1%"  delay={2.5} opacity={0.3}/>
      {/* Sparkles */}
      {sparks.map((s,i)=><Spark key={i} {...s}/>)}
      {/* Scan line */}
      <div style={{
        position:"absolute",left:0,width:"100%",height:"1px",
        background:`linear-gradient(90deg,transparent,${MAG}55,transparent)`,
        animation:"scan-sweep 10s linear infinite",
      }}/>
    </div>
  );
}

/* ══════════════ HOT PINK FRAME ══════════════ */
function Frame() {
  const T = 10;
  const corners = [{top:T-2,left:T-2},{top:T-2,right:T-2},{bottom:T-2,left:T-2},{bottom:T-2,right:T-2}];
  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,pointerEvents:"none" }}>
      {[{top:0,left:0,right:0,height:T},{bottom:0,left:0,right:0,height:T},
        {top:0,left:0,bottom:0,width:T},{top:0,right:0,bottom:0,width:T}
      ].map((s,i)=>(
        <div key={i} style={{ position:"absolute",background:MAG,...s as React.CSSProperties,
          boxShadow:`0 0 10px ${MAG}88` }}/>
      ))}
      <div style={{ position:"absolute",top:T+3,left:T+3,right:T+3,bottom:T+3,
        border:`1px solid ${MAG}33`,borderRadius:2 }}/>
      {corners.map((s,i)=>(
        <div key={i} style={{ position:"absolute",...s as React.CSSProperties,
          width:20,height:20,background:NEO,borderRadius:2,
          clipPath:"polygon(50% 0%,100% 50%,50% 100%,0 50%)",
          boxShadow:`0 0 8px ${NEO}`,animation:`breathe ${1.5+i*0.3}s ease-in-out infinite` }}/>
      ))}
    </div>
  );
}

/* ══════════════ MAIN ══════════════ */
export default function Home() {
  const [brief, setBrief]       = useState("");
  const [model, setModel]       = useState("gen4.5");
  const [status, setStatus]     = useState<"idle"|"loading"|"done"|"error">("idle");
  const [currentStep, setStep]  = useState(0);
  const [stepDone, setStepDone] = useState<number[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError]       = useState("");
  const [mounted, setMounted]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ setMounted(true); },[]);

  // 3D tilt on hover
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-2px)`;
  }
  function handleMouseLeave() {
    if(cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  }

  async function generate() {
    if(!brief.trim()) return;
    setStatus("loading"); setStep(1); setStepDone([]);
    setVideoUrl(""); setError("");
    try {
      // Step 1: start the task
      setStep(2);
      const res = await fetch("/api/generate",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ brief, model }),
      });
      const data = await res.json();
      if(data.error) { setError(data.error); setStatus("error"); return; }
      const { taskId } = data;
      setStepDone([1,2]);

      // Step 2: poll until done (frontend polling — no server timeout issue)
      setStep(3);
      while(true){
        await new Promise(r=>setTimeout(r,6000));
        const poll = await fetch(`/api/poll?taskId=${encodeURIComponent(taskId)}`);
        const p = await poll.json();
        if(p.error) { setError(p.error); setStatus("error"); return; }
        if(p.status==="SUCCEEDED"){
          setStepDone([1,2,3]);
          setStep(4);
          await new Promise(r=>setTimeout(r,400));
          setStepDone([1,2,3,4]);
          setVideoUrl(p.videoUrl);
          setStatus("done");
          return;
        }
        if(p.status==="FAILED"){
          setError(p.error ?? "Runway generation failed");
          setStatus("error");
          return;
        }
        // still PENDING / RUNNING — keep polling
      }
    }catch(e:unknown){
      setError(e instanceof Error ? e.message : "Error");
      setStatus("error");
    }
  }

  if(!mounted) return null;
  const busy = status==="loading";
  const activeModel = MODELS.find(m=>m.id===model)!;

  return (
    <>
      <Frame/>
      <Background/>

      <style>{`
        @keyframes truck-shimmer{0%{background-position:-300% center;}100%{background-position:300% center;}}
        @keyframes glitch-ghost{0%,87%,100%{opacity:0;}88%,93%{opacity:0.45;}}
        @keyframes card-border{0%{border-color:rgba(255,0,144,0.2);}33%{border-color:rgba(0,255,65,0.2);}66%{border-color:rgba(255,140,0,0.15);}100%{border-color:rgba(255,0,144,0.2);}}
      `}</style>

      <main style={{
        position:"relative",zIndex:1,minHeight:"100vh",
        padding:"clamp(24px,4vw,52px) clamp(14px,4vw,24px) clamp(40px,6vw,60px)",
      }}>
        <div style={{ maxWidth:820,margin:"0 auto",display:"flex",flexDirection:"column",gap:"clamp(14px,3vw,20px)" }}>

          {/* ── TITLE ── */}
          <div style={{ paddingTop:8 }}>
            <TruckTitle/>
            <p style={{ textAlign:"center",fontFamily:"'Outfit',sans-serif",fontWeight:600,
              fontSize:"clamp(12px,2.2vw,15px)",color:`${CRM}66`,marginTop:10,letterSpacing:"0.05em" }}>
              Type your idea → AI creates your cinematic video ✦
            </p>
            <div style={{ display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,marginTop:12 }}>
              {[{t:"HD Video",c:ORG},{t:"Cinematic AI",c:MAG},{t:"Vertical 9:16",c:NEO},{t:"3 Models",c:GLD}].map(({t,c})=>(
                <span key={t} style={{ padding:"4px 14px",borderRadius:999,
                  background:`${c}18`,border:`1.5px solid ${c}44`,color:c,
                  fontSize:"clamp(9px,1.4vw,11px)",fontFamily:"'Outfit',sans-serif",fontWeight:700,
                  letterSpacing:"0.1em",boxShadow:`0 0 8px ${c}33` }}>
                  ✦ {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── MODEL SELECTOR ── */}
          <Glass glow={activeModel.glow} style={{ padding:"clamp(16px,3vw,24px)" }}>
            <ModelPicker value={model} onChange={setModel}/>
          </Glass>

          {/* ── INPUT CARD (3D tilt) ── */}
          <div ref={cardRef} style={{ transition:"transform 0.15s ease-out" }}
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <Glass glow={`${MAG}44`} style={{ padding:"clamp(18px,4vw,28px)" }}>
              {/* Corner stars */}
              {[{top:-11,left:-11,c:GLD},{top:-11,right:-11,c:MAG},
                {bottom:-11,left:-11,c:NEO},{bottom:-11,right:-11,c:ORG}].map((s,i)=>{
                const {c,...pos}=s;
                return <div key={i} style={{ position:"absolute",...pos as React.CSSProperties,zIndex:10,
                  width:24,height:24,background:c,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0 50%)",
                  boxShadow:`0 0 8px ${c}`,animation:`breathe ${1.8+i*0.3}s ease-in-out infinite` }}/>;
              })}

              <label style={{ display:"block",fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(14px,2.5vw,18px)",letterSpacing:"0.14em",color:GLD,marginBottom:10,
                textShadow:`0 0 10px ${GLD}66` }}>
                🎬 YOUR VIDEO IDEA
              </label>

              <textarea value={brief} onChange={e=>setBrief(e.target.value)} disabled={busy}
                placeholder="Describe your video... e.g. Dark cinematic city night, neon lights, slow motion rain, dramatic energy..."
                rows={4}
                style={{
                  width:"100%",borderRadius:12,padding:"clamp(10px,2vw,16px)",
                  fontSize:"clamp(12px,2vw,14px)",lineHeight:1.85,resize:"vertical",outline:"none",
                  background:"rgba(13,0,64,0.7)",border:`2px solid ${MAG}33`,color:CRM,
                  fontFamily:"'Outfit',sans-serif",transition:"border-color 0.3s,box-shadow 0.3s",
                }}
                onFocus={e=>{e.target.style.borderColor=MAG;e.target.style.boxShadow=`0 0 0 3px ${MAG}33,0 0 20px ${MAG}22`;}}
                onBlur={e=>{e.target.style.borderColor=`${MAG}33`;e.target.style.boxShadow="none";}}
              />

              <button onClick={generate} disabled={busy||!brief.trim()}
                style={{
                  width:"100%",marginTop:14,padding:"clamp(15px,3vw,20px)",
                  borderRadius:14,fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"clamp(18px,3.5vw,26px)",letterSpacing:"0.1em",border:"none",
                  cursor:(!brief.trim()||busy)?"not-allowed":"pointer",
                  background:(!brief.trim()||busy)
                    ?"rgba(13,0,64,0.8)"
                    :`linear-gradient(135deg,${MAG} 0%,${ORG} 40%,${GLD} 80%,${NEO} 100%)`,
                  color:(!brief.trim()||busy)?`${CRM}33`:DRK,
                  boxShadow:(!brief.trim()||busy)?"none":`0 6px 30px ${MAG}88,0 0 60px ${MAG}33`,
                  position:"relative",overflow:"hidden",transition:"all 0.3s",
                }}
                onMouseEnter={e=>{if(brief.trim()&&!busy)(e.currentTarget as HTMLButtonElement).style.transform="translateY(-3px) scale(1.01)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform="none";}}
              >
                {!busy&&brief.trim()&&(
                  <span style={{ position:"absolute",top:0,width:"35%",height:"100%",
                    background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)",
                    animation:"btn-scan 2.5s ease-in-out infinite" }}/>
                )}
                <span style={{ position:"relative",zIndex:1 }}>
                  {busy?"⏳  AI IS WORKING...":"✦  GENERATE AI VIDEO  ✦"}
                </span>
              </button>
            </Glass>
          </div>

          {/* ── PROGRESS ── */}
          {busy&&(
            <Glass glow={`${ORG}44`} style={{ padding:"clamp(16px,4vw,24px)",animation:"reveal-up 0.4s ease-out" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                <div style={{ width:10,height:10,borderRadius:"50%",background:MAG,
                  boxShadow:`0 0 10px ${MAG}`,animation:"breathe 1s ease-in-out infinite" }}/>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(14px,2.5vw,18px)",
                  letterSpacing:"0.15em",color:MAG,margin:0,textShadow:`0 0 10px ${MAG}` }}>
                  PIPELINE RUNNING
                </p>
                <div style={{ marginLeft:"auto",padding:"2px 10px",borderRadius:999,
                  background:`${activeModel.color}22`,border:`1px solid ${activeModel.color}55`,
                  fontSize:"clamp(9px,1.4vw,10px)",color:activeModel.color,fontWeight:700,
                  fontFamily:"'Outfit',sans-serif" }}>
                  {activeModel.name}
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {STEPS.map((s,idx)=>{
                  const done=stepDone.includes(s.id), active=currentStep===s.id;
                  return (
                    <div key={s.id} style={{ display:"flex",alignItems:"center",gap:12,
                      animation:`step-in 0.5s ease-out ${idx*0.1}s both` }}>
                      <div style={{
                        width:"clamp(38px,6vw,46px)",height:"clamp(38px,6vw,46px)",borderRadius:"50%",flexShrink:0,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:"clamp(14px,2.2vw,17px)",
                        background:done?`linear-gradient(135deg,${NEO}44,${DRK})`:active?`${MAG}22`:"rgba(13,0,64,0.7)",
                        border:`2px solid ${done?NEO:active?MAG:"rgba(255,255,255,0.08)"}`,
                        boxShadow:active?`0 0 20px ${MAG}88`:done?`0 0 16px ${NEO}66`:"none",
                        transition:"all 0.4s",
                      }}>
                        {done?<span style={{ animation:"check-pop 0.4s ease-out",display:"inline-block",
                          color:NEO,fontSize:18,fontWeight:900,textShadow:`0 0 8px ${NEO}` }}>✓</span>:s.icon}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"clamp(12px,2vw,14px)",
                          margin:"0 0 2px",color:done?NEO:active?CRM:"rgba(245,240,232,0.3)",transition:"color 0.4s",
                          textShadow:done?`0 0 8px ${NEO}`:undefined }}>{s.label}</p>
                        <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:"clamp(10px,1.5vw,12px)",
                          margin:0,color:"rgba(245,240,232,0.3)" }}>{s.desc}</p>
                      </div>
                      {active&&!done&&<div style={{ width:20,height:20,borderRadius:"50%",flexShrink:0,
                        border:`2px solid ${MAG}44`,borderTop:`2px solid ${MAG}`,
                        animation:"spin-faster 0.8s linear infinite",boxShadow:`0 0 8px ${MAG}44` }}/>}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:16,height:6,background:"rgba(13,0,64,0.8)",borderRadius:99,overflow:"hidden",
                border:`1px solid ${MAG}22` }}>
                <div style={{ height:"100%",borderRadius:99,
                  background:`linear-gradient(90deg,${MAG},${ORG},${GLD},${NEO})`,
                  width:`${(currentStep/STEPS.length)*100}%`,transition:"width 0.9s ease",
                  boxShadow:`0 0 12px ${MAG},0 0 24px ${MAG}55`,animation:"prog-glow 2s ease-in-out infinite" }}/>
              </div>
            </Glass>
          )}

          {/* ── ERROR ── */}
          {status==="error"&&(
            <Glass style={{ padding:"clamp(14px,3vw,20px)",
              background:"rgba(80,0,20,0.5)",animation:"reveal-up 0.4s ease-out" }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,
                fontSize:"clamp(12px,2vw,14px)",color:MAG,margin:0 }}>❌ {error}</p>
            </Glass>
          )}

          {/* ── VIDEO RESULT ── */}
          {status==="done"&&videoUrl&&(
            <Glass glow={`${NEO}44`} style={{ padding:"clamp(18px,4vw,28px)",textAlign:"center",
              animation:"reveal-up 0.6s ease-out" }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 20px",
                borderRadius:999,marginBottom:14,background:`${NEO}22`,
                border:`2px solid ${NEO}55`,color:NEO,fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(14px,2.5vw,18px)",letterSpacing:"0.15em",
                boxShadow:`0 0 20px ${NEO}44`,textShadow:`0 0 10px ${NEO}` }}>
                <span style={{ animation:"breathe 1.5s ease-in-out infinite",display:"inline-block" }}>●</span>
                YOUR VIDEO IS READY!
              </div>
              <video src={videoUrl} controls autoPlay style={{
                width:"100%",borderRadius:14,display:"block",margin:"14px 0",
                maxHeight:"clamp(280px,55vw,560px)",background:"#000",
                border:`2px solid ${NEO}44`,boxShadow:`0 0 40px ${NEO}33`,
              }}/>
              <a href={videoUrl} download="yogi-ai-video.mp4" style={{
                display:"inline-flex",alignItems:"center",gap:8,
                padding:"clamp(12px,2.5vw,16px) clamp(28px,5vw,52px)",
                borderRadius:14,fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(16px,3vw,22px)",letterSpacing:"0.1em",
                background:`linear-gradient(135deg,${NEO},${GLD})`,
                color:DRK,textDecoration:"none",boxShadow:`0 6px 28px ${NEO}88`,
                transition:"transform 0.2s",
              }}
                onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.05) translateY(-2px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="none")}
              >⬇️ DOWNLOAD MP4</a>
            </Glass>
          )}

          {/* ── FOOTER ── */}
          <div style={{ textAlign:"center",paddingBottom:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10,justifyContent:"center" }}>
              {[MAG,NEO,ORG,BLU,GLD].map((c,i)=>(
                <div key={i} style={{ height:2,flex:1,maxWidth:50,background:c,borderRadius:99,opacity:0.5 }}/>
              ))}
            </div>
            <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:"clamp(9px,1.4vw,11px)",
              color:`${CRM}33`,letterSpacing:"0.1em" }}>
              ✦ Powered by Runway ML · Built by Yogi The Editor ✦
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

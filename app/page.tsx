"use client";
import { useState, useEffect } from "react";

const RED    = "#E8271C";
const ORANGE = "#FF5C1A";
const YELLOW = "#FFB800";
const PINK   = "#FF1A8C";
const CREAM  = "#F5F0E8";
const DARK   = "#09126b";
const BLUE2  = "#0d1d99";

const STEPS = [
  { id:1, icon:"🎬", label:"Preparing",  desc:"Setting up your request"   },
  { id:2, icon:"🚀", label:"Generating", desc:"AI is creating your video"  },
  { id:3, icon:"⏳", label:"Processing", desc:"Rendering in progress"      },
  { id:4, icon:"✨", label:"Finishing",  desc:"Almost ready!"              },
];

function Star({ size, color, spin, rev }: { size:number; color:string; spin?:boolean; rev?:boolean }) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI/8)*i - Math.PI/2;
    const r = i%2===0 ? size/2 : size/4;
    pts.push(`${size/2+r*Math.cos(a)},${size/2+r*Math.sin(a)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display:"block", flexShrink:0, animation:spin?`${rev?"spin-rev":"spin-slow"} ${14+(size%7)}s linear infinite`:undefined }}>
      <polygon points={pts.join(" ")} fill={color}/>
    </svg>
  );
}

function Sparkle({ x, y, size, color, delay }: { x:string; y:string; size:number; color:string; delay:number }) {
  return (
    <div style={{ position:"absolute", left:x, top:y, pointerEvents:"none",
      animation:`twinkle ${2+delay}s ease-in-out ${delay}s infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color}/>
      </svg>
    </div>
  );
}

function Frame() {
  const T = 12;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, pointerEvents:"none" }}>
      {[{top:0,left:0,right:0,height:T},{bottom:0,left:0,right:0,height:T},
        {top:0,left:0,bottom:0,width:T},{top:0,right:0,bottom:0,width:T}
      ].map((s,i)=><div key={i} style={{ position:"absolute", background:RED, ...s as React.CSSProperties }}/>)}
      <div style={{ position:"absolute", top:T+4, left:T+4, right:T+4, bottom:T+4, border:`1px solid ${RED}33`, borderRadius:2 }}/>
      {[{top:T-2,left:T-2},{top:T-2,right:T-2},{bottom:T-2,left:T-2},{bottom:T-2,right:T-2}].map((s,i)=>(
        <div key={i} style={{ position:"absolute", width:18, height:18, background:YELLOW,
          clipPath:"polygon(50% 0%,100% 50%,50% 100%,0 50%)", ...s as React.CSSProperties }}/>
      ))}
    </div>
  );
}

function Bg() {
  const sparks = [
    {x:"7%",y:"8%",size:20,color:YELLOW,delay:0},    {x:"85%",y:"6%",size:15,color:PINK,delay:0.7},
    {x:"3%",y:"55%",size:12,color:CREAM,delay:1.4},  {x:"88%",y:"45%",size:18,color:ORANGE,delay:0.3},
    {x:"12%",y:"85%",size:14,color:YELLOW,delay:1.9},{x:"80%",y:"80%",size:10,color:PINK,delay:1.1},
    {x:"48%",y:"4%",size:12,color:CREAM,delay:0.5},  {x:"45%",y:"88%",size:16,color:ORANGE,delay:1.6},
  ];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-60, left:-60, opacity:0.1 }}><Star size={280} color={YELLOW} spin/></div>
      <div style={{ position:"absolute", bottom:-80, right:-80, opacity:0.09 }}><Star size={320} color={PINK} spin rev/></div>
      <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translateX(-50%)",
        width:500, height:350, borderRadius:"50%", background:BLUE2, filter:"blur(70px)", opacity:0.5 }}/>
      {sparks.map((s,i)=><Sparkle key={i} {...s}/>)}
      <div style={{ position:"absolute", left:0, width:"100%", height:2,
        background:`linear-gradient(90deg,transparent,${YELLOW}33,transparent)`,
        animation:"scan-sweep 8s linear infinite" }}/>
    </div>
  );
}

function Divider({ color=YELLOW }:{ color?:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin:"6px 0" }}>
      <div style={{ flex:1, height:1, background:color, opacity:0.25 }}/>
      <span style={{ color, fontSize:12, opacity:0.6 }}>✦ ✦ ✦</span>
      <div style={{ flex:1, height:1, background:color, opacity:0.25 }}/>
    </div>
  );
}

export default function Home() {
  const [brief, setBrief]       = useState("");
  const [status, setStatus]     = useState<"idle"|"loading"|"done"|"error">("idle");
  const [currentStep, setStep]  = useState(0);
  const [stepDone, setStepDone] = useState<number[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError]       = useState("");
  const [mounted, setMounted]   = useState(false);

  useEffect(()=>{ setMounted(true); },[]);

  async function generate() {
    if(!brief.trim()) return;
    setStatus("loading"); setStep(1); setStepDone([]);
    setVideoUrl(""); setError("");
    try {
      const res = await fetch("/api/generate",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ brief }),
      });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      while(true) {
        const { done, value } = await reader.read();
        if(done) break;
        for(const line of dec.decode(value).split("\n").filter(l=>l.startsWith("data:"))) {
          try {
            const d = JSON.parse(line.slice(5));
            if(d.step)  { setStep(d.step); setStepDone(p=>[...new Set([...p,d.step-1])]); }
            if(d.video) { setVideoUrl(d.video); setStatus("done"); }
            if(d.error) { setError(d.error); setStatus("error"); }
          } catch{}
        }
      }
    } catch(e:unknown){
      setError(e instanceof Error ? e.message : "Error");
      setStatus("error");
    }
  }

  if(!mounted) return null;
  const busy = status==="loading";

  return (
    <>
      <Frame/>
      <Bg/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;600;700;800&display=swap');
        @keyframes spin-slow  {to{transform:rotate(360deg);}}
        @keyframes spin-rev   {to{transform:rotate(-360deg);}}
        @keyframes spin-faster{to{transform:rotate(360deg);}}
        @keyframes twinkle    {0%,100%{opacity:.15;transform:scale(1);}50%{opacity:1;transform:scale(1.3);}}
        @keyframes breathe    {0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes text-sh    {0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes glitch-g   {0%,88%,100%{opacity:0;}89%,93%{opacity:0.4;}}
        @keyframes btn-scan   {0%{left:-60%;}100%{left:130%;}}
        @keyframes step-in    {from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:none;}}
        @keyframes check-pop  {0%{transform:scale(0);}70%{transform:scale(1.25);}100%{transform:scale(1);}}
        @keyframes reveal-up  {from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
        @keyframes scan-sweep {0%{top:-2px;}100%{top:102%;}}
        @keyframes card-glow  {0%,100%{box-shadow:0 0 0 4px ${RED}10;}50%{box-shadow:0 0 0 4px ${RED}22,0 0 24px ${RED}18;}}
        textarea::placeholder {color:rgba(245,240,232,0.3);}
        textarea {scrollbar-width:thin;scrollbar-color:${RED}44 transparent;}
      `}</style>

      <main style={{
        position:"relative", zIndex:1, minHeight:"100vh",
        background:`linear-gradient(155deg,#1e36d8 0%,#1B2EC5 45%,#0e1d99 100%)`,
        padding:"clamp(28px,5vw,60px) clamp(16px,4vw,24px)",
      }}>
        <div style={{ maxWidth:780, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>

          {/* HEADER */}
          <div style={{ textAlign:"center" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:7,
              padding:"6px 18px", borderRadius:999, marginBottom:16,
              background:`${RED}20`, border:`1.5px solid ${RED}55`, color:RED,
              fontSize:"clamp(9px,1.4vw,11px)", fontFamily:"'Outfit',sans-serif",
              fontWeight:800, letterSpacing:"0.2em",
            }}>
              <span style={{ animation:"breathe 1.4s ease-in-out infinite", display:"inline-block", fontSize:9 }}>●</span>
              AI VIDEO GENERATOR — LIVE
            </div>

            {/* Title */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"clamp(6px,2vw,18px)", marginBottom:10 }}>
              <Star size={Math.min(52,Math.max(28,window?.innerWidth*0.05||44))} color={YELLOW} spin/>
              <div style={{ position:"relative" }}>
                <h1 style={{
                  fontFamily:"'Bebas Neue',Impact,sans-serif",
                  fontSize:"clamp(2.6rem,9.5vw,6rem)", lineHeight:1, letterSpacing:"0.03em",
                  background:`linear-gradient(135deg,${CREAM} 0%,${ORANGE} 40%,${RED} 70%,${YELLOW} 100%)`,
                  backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  animation:"text-sh 4s linear infinite", whiteSpace:"nowrap",
                }}>YOGI THE EDITOR</h1>
                <h1 aria-hidden style={{
                  position:"absolute", inset:0,
                  fontFamily:"'Bebas Neue',Impact,sans-serif",
                  fontSize:"clamp(2.6rem,9.5vw,6rem)", lineHeight:1, letterSpacing:"0.03em", whiteSpace:"nowrap",
                  background:`linear-gradient(135deg,${PINK} 0%,#0066ff 100%)`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  animation:"glitch-g 10s infinite", userSelect:"none", pointerEvents:"none",
                }}>YOGI THE EDITOR</h1>
              </div>
              <Star size={Math.min(52,Math.max(28,window?.innerWidth*0.05||44))} color={PINK} spin rev/>
            </div>

            <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:"clamp(12px,2.3vw,15px)", color:`${CREAM}77`, letterSpacing:"0.04em" }}>
              Type your idea → AI creates your cinematic video ✦
            </p>

            <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:8, marginTop:12 }}>
              {[{label:"HD Video",color:ORANGE},{label:"Cinematic AI",color:PINK},{label:"Vertical 9:16",color:YELLOW}].map(({label,color})=>(
                <span key={label} style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, padding:"4px 14px", borderRadius:999,
                  background:`${color}18`, border:`1.5px solid ${color}44`, color, fontSize:"clamp(9px,1.4vw,11px)", letterSpacing:"0.1em" }}>
                  ✦ {label}
                </span>
              ))}
            </div>

            <div style={{ marginTop:16 }}><Divider color={YELLOW}/></div>
          </div>

          {/* INPUT CARD */}
          <div style={{
            borderRadius:"clamp(14px,3vw,20px)", padding:"clamp(18px,4vw,28px)",
            background:`${DARK}dd`, backdropFilter:"blur(20px)",
            border:`2px solid ${RED}44`, position:"relative",
            animation:"card-glow 3s ease-in-out infinite",
          }}>
            {/* Corner stars */}
            {[{top:-13,left:-13,c:YELLOW,r:false},{top:-13,right:-13,c:ORANGE,r:true},
              {bottom:-13,left:-13,c:PINK,r:true},{bottom:-13,right:-13,c:YELLOW,r:false}
            ].map((s,i)=>{
              const {c,r,...pos}=s;
              return <div key={i} style={{ position:"absolute",...pos as React.CSSProperties,zIndex:5 }}><Star size={28} color={c} spin rev={r}/></div>;
            })}

            <label style={{ display:"block", fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(14px,2.5vw,18px)", letterSpacing:"0.12em", color:YELLOW, marginBottom:10 }}>
              🎬 YOUR VIDEO IDEA
            </label>

            <textarea
              value={brief} onChange={e=>setBrief(e.target.value)} disabled={busy}
              placeholder="Describe your video... e.g. Dark cinematic city night, neon lights, slow motion rain, dramatic music..."
              rows={4}
              style={{
                width:"100%", borderRadius:10, padding:"clamp(10px,2vw,14px)",
                fontSize:"clamp(12px,2vw,14px)", lineHeight:1.8, resize:"vertical", outline:"none",
                background:`${BLUE2}cc`, border:`2px solid ${RED}33`, color:CREAM,
                fontFamily:"'Outfit',sans-serif", transition:"border-color 0.3s, box-shadow 0.3s",
              }}
              onFocus={e=>{e.target.style.borderColor=YELLOW;e.target.style.boxShadow=`0 0 0 3px ${YELLOW}22`;}}
              onBlur={e=>{e.target.style.borderColor=`${RED}33`;e.target.style.boxShadow="none";}}
            />

            <button onClick={generate} disabled={busy||!brief.trim()}
              style={{
                width:"100%", marginTop:14, padding:"clamp(14px,3vw,20px)",
                borderRadius:12, fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(18px,3.5vw,26px)", letterSpacing:"0.1em", border:"none",
                cursor:(!brief.trim()||busy)?"not-allowed":"pointer",
                background:(!brief.trim()||busy)?"#1a1a44":`linear-gradient(135deg,${RED} 0%,${ORANGE} 50%,${YELLOW} 100%)`,
                color:(!brief.trim()||busy)?"#333366":DARK,
                boxShadow:(!brief.trim()||busy)?"none":`0 6px 28px ${RED}88`,
                position:"relative", overflow:"hidden", transition:"all 0.3s",
              }}
              onMouseEnter={e=>{if(brief.trim()&&!busy)(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform="none";}}
            >
              {!busy&&brief.trim()&&(
                <span style={{ position:"absolute",top:0,width:"35%",height:"100%",
                  background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)",
                  animation:"btn-scan 2.5s ease-in-out infinite" }}/>
              )}
              <span style={{ position:"relative",zIndex:1 }}>
                {busy ? "⏳  Generating Your Video..." : "✦  GENERATE AI VIDEO  ✦"}
              </span>
            </button>
          </div>

          {/* PROGRESS */}
          {busy && (
            <div style={{ borderRadius:18, padding:"clamp(16px,4vw,24px)",
              background:`${DARK}dd`, backdropFilter:"blur(20px)",
              border:`2px solid ${ORANGE}44`, animation:"reveal-up 0.4s ease-out" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:9,height:9,borderRadius:"50%",background:ORANGE,animation:"breathe 1s ease-in-out infinite",boxShadow:`0 0 10px ${ORANGE}` }}/>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(14px,2.5vw,18px)",letterSpacing:"0.15em",color:ORANGE,margin:0 }}>
                  PIPELINE RUNNING
                </p>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {STEPS.map((s,idx)=>{
                  const done=stepDone.includes(s.id), active=currentStep===s.id;
                  return (
                    <div key={s.id} style={{ display:"flex",alignItems:"center",gap:12, animation:`step-in 0.5s ease-out ${idx*0.1}s both` }}>
                      <div style={{
                        width:"clamp(36px,5vw,44px)",height:"clamp(36px,5vw,44px)",borderRadius:"50%",flexShrink:0,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(13px,2vw,16px)",
                        background:done?`linear-gradient(135deg,#007845,#00aa55)`:active?`${ORANGE}22`:`${BLUE2}88`,
                        border:`2px solid ${done?"#007845":active?ORANGE:"#1a2a88"}`,
                        boxShadow:active?`0 0 18px ${ORANGE}88`:done?`0 0 14px #00784566`:"none",
                        transition:"all 0.4s",
                      }}>
                        {done?<span style={{ animation:"check-pop 0.4s ease-out",display:"inline-block",color:CREAM,fontSize:16,fontWeight:900 }}>✓</span>:s.icon}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"clamp(12px,2vw,14px)",margin:"0 0 2px",
                          color:done?"#00aa55":active?CREAM:"#334499",transition:"color 0.4s" }}>{s.label}</p>
                        <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:"clamp(10px,1.5vw,12px)",margin:0,color:"#334488" }}>{s.desc}</p>
                      </div>
                      {active&&!done&&<div style={{ width:20,height:20,borderRadius:"50%",flexShrink:0,
                        border:`2px solid ${ORANGE}33`,borderTop:`2px solid ${ORANGE}`,animation:"spin-faster 0.8s linear infinite" }}/>}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:16,height:5,background:"#0a1066",borderRadius:99,overflow:"hidden" }}>
                <div style={{ height:"100%",borderRadius:99,
                  background:`linear-gradient(90deg,${RED},${ORANGE},${YELLOW})`,
                  width:`${(currentStep/STEPS.length)*100}%`,transition:"width 0.9s ease",
                  boxShadow:`0 0 10px ${ORANGE}` }}/>
              </div>
            </div>
          )}

          {/* ERROR */}
          {status==="error"&&(
            <div style={{ borderRadius:14,padding:"clamp(14px,3vw,20px)",
              background:"#2a0008cc",border:`2px solid ${RED}66`,animation:"reveal-up 0.4s ease-out" }}>
              <p style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"clamp(12px,2vw,14px)",color:RED,margin:0 }}>❌ {error}</p>
            </div>
          )}

          {/* VIDEO RESULT */}
          {status==="done"&&videoUrl&&(
            <div style={{ borderRadius:20,padding:"clamp(18px,4vw,28px)",textAlign:"center",
              background:`${DARK}dd`,backdropFilter:"blur(24px)",
              border:`2.5px solid ${YELLOW}55`,boxShadow:`0 0 60px ${ORANGE}33`,
              animation:"reveal-up 0.6s ease-out",position:"relative" }}>
              {[{top:-13,left:-13,c:YELLOW},{top:-13,right:-13,c:ORANGE}].map((s,i)=>{
                const {c,...pos}=s;
                return <div key={i} style={{ position:"absolute",...pos as React.CSSProperties }}><Star size={30} color={c} spin/></div>;
              })}
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 20px",borderRadius:999,marginBottom:14,
                background:`${YELLOW}22`,border:`2px solid ${YELLOW}55`,color:YELLOW,
                fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(14px,2.5vw,18px)",letterSpacing:"0.15em" }}>
                <span style={{ animation:"breathe 1.5s ease-in-out infinite",display:"inline-block" }}>●</span>
                YOUR VIDEO IS READY!
              </div>
              <Divider color={YELLOW}/>
              <video src={videoUrl} controls autoPlay style={{
                width:"100%",borderRadius:12,margin:"14px 0",display:"block",
                maxHeight:"clamp(280px,55vw,560px)",background:"#000",
                border:`2px solid ${YELLOW}44`,boxShadow:`0 8px 40px ${ORANGE}44`,
              }}/>
              <a href={videoUrl} download="yogi-ai-video.mp4" style={{
                display:"inline-flex",alignItems:"center",gap:8,
                padding:"clamp(12px,2.5vw,16px) clamp(28px,5vw,52px)",borderRadius:12,
                fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(16px,3vw,22px)",letterSpacing:"0.1em",
                background:`linear-gradient(135deg,${RED},${ORANGE},${YELLOW})`,
                color:DARK,textDecoration:"none",boxShadow:`0 6px 28px ${RED}88`,transition:"transform 0.2s",
              }}
                onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.05) translateY(-2px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="none")}
              >⬇️ DOWNLOAD MP4</a>
            </div>
          )}

          {/* FOOTER */}
          <div style={{ textAlign:"center",paddingBottom:8 }}>
            <Divider color={RED}/>
            <p style={{ fontFamily:"'Outfit',sans-serif",fontSize:"clamp(9px,1.4vw,11px)",color:`${CREAM}33`,letterSpacing:"0.1em",marginTop:10 }}>
              ✦ Powered by Runway Gen-4.5 · Built by Yogi The Editor ✦
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

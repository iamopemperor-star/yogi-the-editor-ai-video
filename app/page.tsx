"use client";
import { useState, useRef } from "react";

const STEPS = [
  { id: 1, icon: "🎬", label: "Creative Director",  desc: "Crafting your brief"     },
  { id: 2, icon: "🤖", label: "Gemini AI",          desc: "Engineering mega prompt" },
  { id: 3, icon: "🚀", label: "Runway Gen-4.5",     desc: "Generating your video"   },
  { id: 4, icon: "⬇️", label: "Downloading",        desc: "Almost ready!"           },
];

const EXAMPLES = [
  "A luxury fashion brand ad — dark cinematic, model in slow motion, purple neon lights",
  "A tech startup promo — futuristic dark UI, glowing code, bold text: Build the Future",
  "A fitness brand reel — athlete training at night, dramatic lighting, raw energy",
];

export default function Home() {
  const [brief, setBrief]       = useState("");
  const [status, setStatus]     = useState<"idle"|"loading"|"done"|"error">("idle");
  const [currentStep, setStep]  = useState(0);
  const [stepDone, setStepDone] = useState<number[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [prompt, setPrompt]     = useState("");
  const [error, setError]       = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  async function generate() {
    if (!brief.trim()) return;
    setStatus("loading"); setStep(1); setStepDone([]); setVideoUrl(""); setError(""); setPrompt("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
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

  return (
    <main className="min-h-screen" style={{ background: "radial-gradient(ellipse at 30% 20%, #12082a 0%, #0a0a0a 60%)" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${4+(i%4)*3}px`, height: `${4+(i%4)*3}px`,
              left: `${(i*8.3)%100}%`, top: `${(i*13.7)%100}%`, opacity: 0.2,
              background: i%3===0?"#977DFF":i%3===1?"#0033FF":"#FFCCF2",
              filter: "blur(1px)",
              animation: `float ${3+i*0.3}s ease-in-out ${i*0.4}s infinite`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
            style={{ background: "#977DFF22", border: "1px solid #977DFF44", color: "#977DFF" }}>
            ✦ Multi-AI Video Generator
          </div>
          <h1 className="text-5xl font-black mb-4"
            style={{ background: "linear-gradient(135deg,#fff 0%,#977DFF 50%,#FFCCF2 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Yogi The Editor
          </h1>
          <p className="text-lg" style={{ color: "#777" }}>Describe your video → AI generates it in minutes</p>
          <div className="flex justify-center gap-6 mt-4 text-xs" style={{ color: "#444" }}>
            <span>Gemini 2.5 ✦</span><span>Runway Gen-4.5 ✦</span><span>HD Video</span>
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background:"#111", border:"1px solid #222" }}>
          <label className="block text-sm font-semibold mb-3" style={{ color:"#977DFF" }}>🎬 Describe Your Video</label>
          <textarea value={brief} onChange={e=>setBrief(e.target.value)}
            placeholder="e.g. A dark cinematic ad for a luxury brand — slow motion, purple neon lights, bold text reveal..."
            rows={4} disabled={status==="loading"}
            className="w-full rounded-xl p-4 text-sm resize-none outline-none"
            style={{ background:"#0a0a0a", border:"1px solid #2a2a2a", color:"#eee", lineHeight:1.7, width:"100%" }} />
          <div className="mt-3">
            <p className="text-xs mb-2" style={{ color:"#444" }}>Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex,i)=>(
                <button key={i} onClick={()=>setBrief(ex)} disabled={status==="loading"}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#555", cursor:"pointer" }}>
                  {ex.slice(0,38)}…
                </button>
              ))}
            </div>
          </div>
          <button onClick={generate} disabled={status==="loading"||!brief.trim()}
            className="w-full mt-4 py-4 rounded-xl font-bold text-base tracking-wide"
            style={{
              background: status==="loading"?"#2a1f4a":"linear-gradient(135deg,#977DFF,#0033FF)",
              color:"#fff", opacity:!brief.trim()?0.5:1, cursor:!brief.trim()?"not-allowed":"pointer", border:"none"
            }}>
            {status==="loading"?"⏳  Generating your video...":"✨  Generate AI Video"}
          </button>
        </div>

        {status==="loading" && (
          <div className="rounded-2xl p-6 mb-6" style={{ background:"#111", border:"1px solid #222" }}>
            <p className="text-sm font-semibold mb-5" style={{ color:"#977DFF" }}>🔄 Pipeline Running...</p>
            <div className="space-y-4">
              {STEPS.map(s=>{
                const done=stepDone.includes(s.id), active=currentStep===s.id;
                return (
                  <div key={s.id} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background:done?"#977DFF":active?"#977DFF22":"#1a1a1a", border:`1px solid ${done||active?"#977DFF":"#333"}`, boxShadow:active?"0 0 15px #977DFF66":"none" }}>
                      {done?"✓":s.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color:done?"#977DFF":active?"#fff":"#444" }}>{s.label}</p>
                      <p className="text-xs" style={{ color:"#555" }}>{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {prompt && (
          <div className="rounded-2xl p-5 mb-6" style={{ background:"#0d0d0d", border:"1px solid #1e1e1e" }}>
            <p className="text-xs font-semibold mb-2" style={{ color:"#555" }}>🤖 GEMINI MEGA PROMPT</p>
            <p className="text-xs leading-relaxed" style={{ color:"#444" }}>{prompt}</p>
          </div>
        )}

        {status==="error" && (
          <div className="rounded-2xl p-5 mb-6" style={{ background:"#1a0a0a", border:"1px solid #ff444422" }}>
            <p className="text-sm font-semibold" style={{ color:"#ff6666" }}>❌ {error}</p>
          </div>
        )}

        {status==="done" && videoUrl && (
          <div className="rounded-2xl p-6 text-center" style={{ background:"#111", border:"1px solid #977DFF44", boxShadow:"0 0 40px #977DFF22" }}>
            <p className="text-sm font-semibold mb-4" style={{ color:"#977DFF" }}>✅ Your Video is Ready!</p>
            <video ref={videoRef} src={videoUrl} controls autoPlay className="w-full rounded-xl mb-4" style={{ maxHeight:500, background:"#000" }} />
            <a href={videoUrl} download="yogi-ai-video.mp4" className="inline-block px-8 py-3 rounded-xl font-bold text-sm"
              style={{ background:"linear-gradient(135deg,#977DFF,#0033FF)", color:"#fff", textDecoration:"none" }}>
              ⬇️ Download MP4
            </a>
          </div>
        )}

        <div className="text-center mt-14 text-xs" style={{ color:"#2a2a2a" }}>
          Powered by Gemini · Runway Gen-4.5 · Built by Yogi The Editor
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
        }
      `}</style>
    </main>
  );
}

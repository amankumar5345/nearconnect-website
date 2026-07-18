import React from 'react';
import { MapPin, Plus } from 'lucide-react';

const styles = `
  @keyframes mesh-drift {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes mesh-drift-alt {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-30px, 40px) scale(0.9); }
    66% { transform: translate(20px, -30px) scale(1.1); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes spin-slow {
    100% { transform: rotate(360deg); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.8; border-width: 2px; }
    100% { transform: scale(3); opacity: 0; border-width: 0px; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(10px); }
    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  .animate-mesh-1 { animation: mesh-drift 15s infinite alternate ease-in-out; }
  .animate-mesh-2 { animation: mesh-drift-alt 18s infinite alternate ease-in-out; }
  .animate-mesh-3 { animation: mesh-drift 20s infinite alternate ease-in-out; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
  }
  .glass-nav {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .text-gradient {
    background: linear-gradient(135deg, #8B5CF6, #EC4899);
    -webkit-background-clip: text;
    color: transparent;
  }
  .bg-gradient-accent {
    background: linear-gradient(135deg, #8B5CF6, #EC4899);
  }
  .card-hover {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
  }
  .card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px -10px rgba(139, 92, 246, 0.3);
  }
  .pulse-dot {
    position: relative;
    border-radius: 50%;
  }
  .pulse-dot::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid currentColor;
    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }
  
  .stagger-1 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
  .stagger-2 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
  .stagger-3 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
  .stagger-4 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
  .stagger-5 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
`;

export default function GlassMorphism() {
  return (
    <div 
      className="min-h-[100dvh] w-full text-slate-100 font-sans relative overflow-x-hidden selection:bg-pink-500/30" 
      style={{ background: 'linear-gradient(to bottom, #1a0533, #0f172a, #020617)' }}
    >
      <style>{styles}</style>
      
      {/* Background Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/30 blur-[120px] animate-mesh-1 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[100px] animate-mesh-2 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-mesh-3 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-2xl tracking-tight text-gradient">NearConnect</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-medium text-violet-200" style={{ boxShadow: '0 0 15px rgba(139,92,246,0.2)' }}>
            <MapPin size={12} className="text-violet-400" />
            South Bombay
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-accent p-[2px]">
            <div className="w-full h-full rounded-full bg-[#1a0533] border border-white/20 flex items-center justify-center text-sm font-bold text-white">
              AJ
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-32 px-6 max-w-lg mx-auto">
        
        {/* Hero */}
        <div className="mb-10 text-center stagger-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
            Discover your city's <br/>
            <span className="relative inline-block">
              <span className="relative z-10 text-white">pulse</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-accent opacity-60 -z-10 rounded-full blur-[2px]"></span>
            </span>
          </h1>
          <p className="text-lg text-[#c4b5fd] font-light">Find your tribe, host events, and truly belong to your neighborhood.</p>
        </div>

        {/* Category Orbit */}
        <div className="flex overflow-x-auto gap-3 pb-6 mb-4 -mx-6 px-6 scrollbar-hide stagger-2" style={{ scrollbarWidth: 'none' }}>
          {[
            { icon: "🚶", label: "Walk", active: true },
            { icon: "🏋️", label: "Gym", active: false },
            { icon: "🏆", label: "Tournament", active: false },
            { icon: "🏕️", label: "Trip", active: false },
            { icon: "🧺", label: "Picnic", active: false },
            { icon: "📢", label: "Notice", active: false },
            { icon: "🆘", label: "SOS", active: false },
          ].map((cat, i) => (
            <button key={i} className={`flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-2xl shrink-0 transition-all ${cat.active ? 'bg-gradient-accent text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] border border-white/20' : 'glass-card text-slate-300 hover:bg-white/10'}`}>
              <span className="text-2xl drop-shadow-md">{cat.icon}</span>
              <span className="text-xs font-light tracking-wide">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Live Near You */}
        <section className="mb-10 stagger-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-wide">Live Near You</h2>
            <span className="text-xs text-pink-400 font-medium cursor-pointer hover:text-pink-300 transition-colors">View All</span>
          </div>
          
          <div className="grid gap-5">
            {[
              { cat: "Morning Walk", title: "Marine Drive Sunrise Walk", host: "Priya", join: 12, max: 20, fee: "Free", color: "from-blue-500 to-violet-500" },
              { cat: "Tournament", title: "Sunday Chess Blitz", host: "Rahul", join: 8, max: 16, fee: "$5", color: "from-pink-500 to-rose-500" },
              { cat: "Gym", title: "HIIT Group Session", host: "Vikram", join: 4, max: 10, fee: "$10", color: "from-emerald-400 to-cyan-500" },
            ].map((event, i) => (
              <div key={i} className="glass-card card-hover relative overflow-hidden group cursor-pointer">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${event.color} opacity-80`} />
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{event.cat}</span>
                    <span className="text-sm font-medium bg-white/10 px-2.5 py-1 rounded-md text-white/90 border border-white/5">{event.fee}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-4 text-white leading-tight">{event.title}</h3>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                        {event.host[0]}
                      </div>
                      <span className="text-xs font-light text-slate-300">by {event.host}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] text-slate-400">{event.join}/{event.max} joined</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-accent rounded-full" style={{ width: `${(event.join/event.max)*100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-gradient-accent text-white px-6 py-2 rounded-full font-semibold shadow-[0_0_20px_rgba(236,72,153,0.5)] transform scale-95 group-hover:scale-100 transition-transform">
                    Join Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map Pulse */}
        <section className="mb-10 stagger-4">
          <h2 className="text-xl font-bold tracking-wide mb-4">Map Pulse</h2>
          <div className="glass-card h-48 relative overflow-hidden flex items-center justify-center bg-[#0a0f1e]/50 border-white/5">
            <div className="absolute inset-0 opacity-50" style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 20px 20px, 20px 20px'
            }} />
            
            <div className="absolute top-[30%] left-[20%] text-pink-500 pulse-dot">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_12px_#EC4899]" />
            </div>
            <div className="absolute top-[60%] left-[40%] text-violet-500 pulse-dot" style={{ animationDelay: '0.5s' }}>
              <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_15px_#8B5CF6]" />
            </div>
            <div className="absolute top-[40%] right-[30%] text-cyan-400 pulse-dot" style={{ animationDelay: '1s' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            </div>
            
            <div className="absolute bottom-4 text-[11px] text-slate-300 font-medium glass-card px-4 py-1.5 rounded-full shadow-lg">
              12 active events near you
            </div>
          </div>
        </section>

        {/* Activity Feed */}
        <section className="mb-8 stagger-5">
          <h2 className="text-xl font-bold tracking-wide mb-4">Activity Feed</h2>
          <div className="glass-card p-5 flex flex-col gap-5">
            {[
              { text: "Priya joined Morning Walk", time: "10m ago", color: "bg-blue-500", initial: "P" },
              { text: "Rahul created Chess Tournament", time: "1h ago", color: "bg-pink-500", initial: "R" },
              { text: "Vikram updated HIIT Group Session", time: "2h ago", color: "bg-emerald-500", initial: "V" },
              { text: "Neha commented on Sunday Picnic", time: "3h ago", color: "bg-orange-500", initial: "N" },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                  {act.initial}
                </div>
                <div className="flex-1 text-sm font-light text-slate-200">{act.text}</div>
                <div className="text-[10px] text-slate-500 font-medium">{act.time}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-[-4px] rounded-full bg-gradient-accent opacity-60 blur-md animate-[spin-slow_4s_linear_infinite] group-hover:opacity-100 transition-opacity" />
          <button className="relative w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center text-white shadow-2xl transform group-hover:scale-105 transition-all focus:outline-none border border-white/20">
            <Plus size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}

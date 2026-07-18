import React, { useState, useEffect } from "react";
import { Search, Bell, MapPin, Navigation, Plus, User, Users, Clock, Calendar, Zap, ShieldAlert, ArrowRight } from "lucide-react";

// --- Mock Data ---
const EVENT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "walk", label: "Morning Walk" },
  { id: "tournaments", label: "Tournaments" },
  { id: "gym", label: "Gym" },
  { id: "trips", label: "Trips" },
  { id: "picnics", label: "Picnics" },
  { id: "notices", label: "Notices" },
  { id: "sos", label: "SOS", isSos: true },
];

const EVENTS = [
  {
    id: 1,
    title: "Morning Walk at Cubbon Park",
    host: "Rahul S.",
    hostInitials: "RS",
    date: "Tomorrow, 6:00 AM",
    location: "Cubbon Park Gate 2",
    participants: 12,
    maxParticipants: 20,
    fee: "Free",
    color: "#FF6B2C",
    category: "Morning Walk"
  },
  {
    id: 2,
    title: "BGMI Weekly Tournament",
    host: "Viper Gaming",
    hostInitials: "VG",
    date: "Today, 8:00 PM",
    location: "Online",
    participants: 45,
    maxParticipants: 100,
    fee: "₹150",
    color: "#39FF14",
    category: "Tournaments"
  },
  {
    id: 3,
    title: "Nandi Hills Sunrise Trip",
    host: "Adventures Co.",
    hostInitials: "AC",
    date: "Saturday, 4:00 AM",
    location: "Nandi Hills Base",
    participants: 8,
    maxParticipants: 15,
    fee: "₹800",
    color: "#B026FF",
    category: "Trips"
  },
  {
    id: 4,
    title: "Lal Bagh Potluck Picnic",
    host: "Neha K.",
    hostInitials: "NK",
    date: "Sunday, 11:30 AM",
    location: "Lal Bagh Glass House",
    participants: 25,
    maxParticipants: 40,
    fee: "Free",
    color: "#FFBF00",
    category: "Picnics"
  },
  {
    id: 5,
    title: "Chess Club Blitz",
    host: "Koromangala Chess",
    hostInitials: "KC",
    date: "Friday, 7:00 PM",
    location: "Third Wave Coffee",
    participants: 16,
    maxParticipants: 32,
    fee: "₹200",
    color: "#00BFFF",
    category: "Tournaments"
  },
  {
    id: 6,
    title: "Weekend HIIT Session",
    host: "FitSquad",
    hostInitials: "FS",
    date: "Saturday, 7:00 AM",
    location: "Cult.fit Koramangala",
    participants: 18,
    maxParticipants: 20,
    fee: "₹300",
    color: "#FF073A",
    category: "Gym"
  }
];

export default function DarkCityscape() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCount, setActiveCount] = useState(24);

  // Ticking number effect for "active now"
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount(prev => {
        const diff = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        let next = prev + diff;
        if (next < 20) next = 20;
        if (next > 35) next = 35;
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 font-['Inter'] relative overflow-x-hidden selection:bg-[#FF6B2C] selection:text-white pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700;900&display=swap');

        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 12px var(--glow-color)); }
          50% { opacity: 0.6; filter: drop-shadow(0 0 4px var(--glow-color)); }
        }
        
        @keyframes pulse-dot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 204, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 229, 204, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 204, 0); }
        }

        @keyframes kinetic-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .bg-kinetic {
          background: linear-gradient(-45deg, #FF6B2C15, #00E5CC15, #0a0a0f, #B026FF15, #FF6B2C15);
          background-size: 400% 400%;
          animation: kinetic-gradient 20s ease infinite;
        }

        .glass-nav {
          background: rgba(10, 10, 15, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .glass-card {
          background: linear-gradient(145deg, rgba(30, 30, 35, 0.6) 0%, rgba(15, 15, 20, 0.6) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .text-glow {
          text-shadow: 0 0 20px currentColor;
        }

        .animate-stagger > * {
          opacity: 0;
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
        .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
        .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
        .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
        .animate-stagger > *:nth-child(5) { animation-delay: 0.5s; }
        .animate-stagger > *:nth-child(6) { animation-delay: 0.6s; }

        .fab-glow {
          animation: pulse-glow 3s infinite ease-in-out;
        }

        .map-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .shimmer-text {
          background: linear-gradient(to right, #666 20%, #fff 40%, #fff 60%, #666 80%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sweep 4s linear infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-nav px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-grotesk text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#FF6B2C] fill-[#FF6B2C]" />
              NearConnect
            </h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
              <div className="w-2 h-2 rounded-full bg-[#00E5CC]" style={{ animation: 'pulse-dot 2s infinite' }} />
              <span className="text-gray-300 font-medium">Koramangala, Bangalore</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#FF6B2C]"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B2C] to-[#00E5CC] p-[2px] cursor-pointer ml-2">
              <div className="w-full h-full rounded-full bg-[#0a0a0f] border-2 border-[#0a0a0f] overflow-hidden flex items-center justify-center">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent`} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 p-8 lg:p-12 bg-kinetic border border-white/5 flex flex-col justify-center min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]/80 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-[#00E5CC]" />
              <span className="text-sm font-medium text-[#00E5CC] tracking-wide uppercase">Discover your city</span>
            </div>
            
            <h2 className="font-grotesk text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight text-glow" style={{ '--glow-color': 'rgba(255, 255, 255, 0.1)' } as any}>
              What's happening <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B2C] to-[#FFBF00]">around you?</span>
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-white">127 events</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/5">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-white">3.2k members</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5CC]/10 backdrop-blur-md border border-[#00E5CC]/30 text-[#00E5CC]">
                <div className="w-2 h-2 rounded-full bg-[#00E5CC]" style={{ animation: 'pulse-dot 2s infinite' }} />
                <span><strong className="text-white min-w-[20px] inline-block text-center">{activeCount}</strong> active now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar gap-3 mb-4">
          {EVENT_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-300 border flex items-center gap-2
                  ${isActive 
                    ? cat.isSos 
                      ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : 'bg-[#FF6B2C]/20 border-[#FF6B2C] text-[#FF6B2C] shadow-[0_0_15px_rgba(255,107,44,0.3)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {cat.isSos && <ShieldAlert className="w-4 h-4" />}
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger mb-20">
          {EVENTS.map((event) => (
            <div 
              key={event.id} 
              className="glass-card rounded-2xl overflow-hidden group flex flex-col relative"
            >
              {/* Left Color Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: event.color }} />
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/50 border border-white/10" style={{ color: event.color }}>
                    {event.category}
                  </span>
                  <span className="text-sm font-bold bg-white/10 text-white px-3 py-1 rounded-full">
                    {event.fee}
                  </span>
                </div>
                
                <h3 className="font-grotesk text-xl font-bold text-white mb-2 leading-tight group-hover:text-glow transition-all" style={{ '--glow-color': event.color + '66' } as any}>
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0f]" style={{ backgroundColor: event.color }}>
                    {event.hostInitials}
                  </div>
                  <span className="text-sm text-gray-400">by <span className="text-white font-medium">{event.host}</span></span>
                </div>

                <div className="space-y-3 mb-8 mt-auto">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {event.location}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Participants</span>
                    <span className="text-white font-medium">{event.participants} / {event.maxParticipants}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden mb-6">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(event.participants / event.maxParticipants) * 100}%`,
                        backgroundColor: event.color,
                        boxShadow: `0 0 10px ${event.color}`
                      }}
                    />
                  </div>

                  <button className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 group-hover:bg-[#FF6B2C] group-hover:text-black group-hover:border-[#FF6B2C] shadow-[0_0_0_rgba(255,107,44,0)] group-hover:shadow-[0_0_20px_rgba(255,107,44,0.4)]">
                    Join Event
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Teaser */}
        <div className="rounded-3xl overflow-hidden glass-card border border-white/5 relative h-[400px] flex items-center justify-center group cursor-pointer mb-12">
          {/* Map Grid Background */}
          <div className="absolute inset-0 map-grid opacity-20" />
          
          {/* Glowing Pins on Map */}
          <div className="absolute top-[30%] left-[25%] animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="relative">
              <div className="w-4 h-4 bg-[#FF6B2C] rounded-full" />
              <div className="absolute inset-0 bg-[#FF6B2C] rounded-full blur-md opacity-50" />
            </div>
          </div>
          <div className="absolute top-[60%] left-[45%] animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
            <div className="relative">
              <div className="w-5 h-5 bg-[#00E5CC] rounded-full" />
              <div className="absolute inset-0 bg-[#00E5CC] rounded-full blur-md opacity-50" />
            </div>
          </div>
          <div className="absolute top-[40%] right-[30%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="relative">
              <div className="w-3 h-3 bg-[#B026FF] rounded-full" />
              <div className="absolute inset-0 bg-[#B026FF] rounded-full blur-md opacity-50" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          
          <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:border-white/20">
            <Navigation className="w-8 h-8 text-[#00E5CC] mx-auto mb-4" />
            <h3 className="font-grotesk text-2xl font-bold text-white mb-2">Explore the Map</h3>
            <p className="text-gray-400 text-sm max-w-[250px] mx-auto">Find events happening in your immediate vicinity interactively.</p>
          </div>
        </div>

      </main>

      {/* FAB */}
      <button 
        className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 w-16 h-16 bg-[#FF6B2C] rounded-full flex items-center justify-center text-white z-50 hover:scale-110 transition-transform duration-300"
        style={{ '--glow-color': 'rgba(255, 107, 44, 0.6)' } as any}
      >
        <div className="absolute inset-0 rounded-full fab-glow pointer-events-none" />
        <Plus className="w-8 h-8 relative z-10" />
      </button>

      <style>{`
        /* Hide scrollbar for category list */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

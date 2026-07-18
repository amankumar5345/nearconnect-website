import React from 'react';
import { 
  Sun, Bell, MapPin, Users, Calendar, 
  Home, MessageSquare, User, AlertCircle, 
  Heart, Megaphone, Activity
} from 'lucide-react';

export default function WarmCommunity() {
  const section1 = [
    { id: 1, category: 'Wellness', title: 'Morning Walk & Chai', host: 'Mrs. Sharma', time: '7:00 AM', color: 'bg-emerald-400', avatars: [{i:'P', bg:'bg-rose-400'}, {i:'R', bg:'bg-sky-400'}, {i:'K', bg:'bg-amber-400'}] },
    { id: 2, category: 'Sports', title: 'Sunday Badminton', host: 'Rahul', time: '8:30 AM', color: 'bg-blue-400', avatars: [{i:'A', bg:'bg-violet-400'}, {i:'T', bg:'bg-fuchsia-400'}] },
    { id: 3, category: 'Pets', title: 'Dog Park Meetup', host: 'Kavita', time: '9:00 AM', color: 'bg-orange-400', avatars: [{i:'D', bg:'bg-emerald-400'}] },
  ];

  const section2 = [
    { id: 4, category: 'Hobby', title: 'Weekend Plant Swap', host: 'Priya', time: 'Sat 10 AM', color: 'bg-emerald-500', avatars: [{i:'S', bg:'bg-rose-400'}, {i:'M', bg:'bg-amber-400'}] },
    { id: 5, category: 'Community', title: 'Local Art Walk', host: 'Amit', time: 'Sun 4 PM', color: 'bg-purple-500', avatars: [{i:'V', bg:'bg-sky-400'}, {i:'J', bg:'bg-emerald-400'}, {i:'R', bg:'bg-violet-400'}] },
  ];

  const section3 = [
    { id: 6, category: 'Fitness', title: 'Society Gym Intro', host: 'Vikram', time: 'Today 6 PM', color: 'bg-orange-500', avatars: [{i:'N', bg:'bg-rose-400'}, {i:'D', bg:'bg-fuchsia-400'}] },
    { id: 7, category: 'Games', title: 'Chess Tournament', host: 'Neha', time: 'Today 8 PM', color: 'bg-indigo-500', avatars: [{i:'P', bg:'bg-amber-400'}, {i:'L', bg:'bg-emerald-400'}] },
  ];

  const EventCard = ({ item }: { item: any }) => (
    <div className="min-w-[240px] w-[240px] bg-white rounded-2xl p-4 warm-shadow shrink-0 snap-center border border-[#E8632A]/5 flex flex-col hover:border-[#E8632A]/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
        <span className="text-[10px] font-extrabold text-[#1C1917]/50 uppercase tracking-wider">{item.category}</span>
      </div>
      <h3 className="font-extrabold text-lg text-[#1C1917] leading-tight mb-1">{item.title}</h3>
      <p className="text-xs text-[#1C1917]/50 font-medium mb-4">Hosted by {item.host}</p>
      
      <div className="flex items-center justify-between mt-auto mb-4">
        <div className="bg-[#FDF6EC] text-[#E8632A] text-xs font-extrabold px-3 py-1.5 rounded-lg border border-[#E8632A]/10">
          {item.time}
        </div>
        <div className="flex -space-x-2">
          {item.avatars.map((av: any, i: number) => (
            <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-[2px] border-white ${av.bg} shadow-sm`} style={{ zIndex: 10 - i }}>
              {av.i}
            </div>
          ))}
        </div>
      </div>
      <button className="w-full bg-white hover:bg-[#E8632A] text-[#E8632A] hover:text-white transition-all duration-300 py-2.5 rounded-xl text-sm font-bold border border-[#E8632A]/20 shadow-sm active:scale-95">
        Join Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF6EC] sm:bg-[#FDF6EC]/50 flex justify-center w-full font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; display: inline-block; }
        .animate-slide-up { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-pulse-soft { animation: pulseSoft 2s ease-in-out infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .warm-shadow {
          box-shadow: 0 8px 24px rgba(232,99,42,0.12);
        }
      `}} />

      <div className="w-full max-w-md bg-[#FDF6EC] relative shadow-none sm:shadow-2xl overflow-x-hidden pb-24 sm:border-x sm:border-[#E8632A]/10">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 pt-10 pb-4 bg-[#FDF6EC]/90 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-[#E8632A]/10 p-2.5 rounded-full">
              <Sun className="w-6 h-6 text-[#E8632A]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-[#E8632A] tracking-wider uppercase mb-0.5">NearConnect</span>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-extrabold text-[#1C1917] tracking-tight">Good morning, Arjun</h1>
                <span className="text-lg animate-float">👋🏽</span>
              </div>
            </div>
          </div>
          <div className="relative p-2.5 bg-white rounded-full warm-shadow cursor-pointer hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-[#1C1917]" />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#E8632A] rounded-full border-2 border-white"></span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-6 py-2">
          <div className="bg-gradient-to-br from-[#E8632A] to-[#F59E0B] rounded-[28px] p-7 text-white warm-shadow relative overflow-hidden animate-slide-up">
            {/* Abstract shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <h2 className="text-[28px] font-extrabold leading-tight mb-2 relative z-10 tracking-tight">
              Your neighborhood<br/>is alive!
            </h2>
            <p className="text-white/90 text-sm font-medium mb-6 relative z-10 max-w-[200px]">
              3 new events were just posted on your street.
            </p>
            
            <div className="flex gap-3 overflow-x-auto hide-scrollbar relative z-10 pb-1">
              <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-white/20 shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-extrabold text-white tracking-wide">127 events</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-white/20 shadow-sm">
                <Users className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-extrabold text-white tracking-wide">3.2k neighbors</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-white/20 shadow-sm">
                <Activity className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-extrabold text-white tracking-wide">24 active</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOS Strip */}
        <div className="px-6 py-3 animate-slide-up delay-100">
          <div className="bg-gradient-to-r from-[#ef4444] to-[#E8632A] rounded-2xl p-4 flex items-center justify-between text-white warm-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2.5 rounded-full animate-pulse-soft">
                <AlertCircle className="w-5 h-5 text-white fill-white/20" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white">Lost Golden Retriever</h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">2 blocks away • 10m ago</p>
              </div>
            </div>
            <button className="bg-white text-[#ef4444] text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm active:scale-95 relative z-10">
              Respond
            </button>
          </div>
        </div>

        {/* Happening Tomorrow */}
        <div className="mt-6 animate-slide-up delay-200">
          <div className="flex items-center justify-between px-6 mb-4">
            <h3 className="text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#E8632A]" />
              Happening Tomorrow
            </h3>
            <button className="text-xs font-extrabold text-[#E8632A] hover:text-[#F59E0B] transition-colors">See all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-6 snap-x snap-mandatory">
            {section1.map((item) => <EventCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Notice Board */}
        <div className="px-6 pt-2 pb-6 animate-slide-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#F59E0B]" />
              Notice Board
            </h3>
            <button className="text-xs font-extrabold text-[#E8632A] hover:text-[#F59E0B] transition-colors">See all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl warm-shadow border border-[#F59E0B]/20 relative overflow-hidden group hover:border-[#F59E0B]/40 transition-colors cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F59E0B]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <span className="inline-block px-2.5 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-extrabold rounded-md uppercase tracking-wider mb-3">Announcement</span>
              <h4 className="font-extrabold text-[#1C1917] text-sm mb-1.5 group-hover:text-[#F59E0B] transition-colors">Block Party Planning</h4>
              <p className="text-xs text-[#1C1917]/60 font-medium leading-relaxed">Join the committee for this year's summer block party. We meet on Sundays!</p>
            </div>
            <div className="bg-white p-5 rounded-2xl warm-shadow border border-[#E8632A]/20 relative overflow-hidden group hover:border-[#E8632A]/40 transition-colors cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E8632A]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <span className="inline-block px-2.5 py-1 bg-[#E8632A]/10 text-[#E8632A] text-[10px] font-extrabold rounded-md uppercase tracking-wider mb-3">Help Wanted</span>
              <h4 className="font-extrabold text-[#1C1917] text-sm mb-1.5 group-hover:text-[#E8632A] transition-colors">Plant Watering</h4>
              <p className="text-xs text-[#1C1917]/60 font-medium leading-relaxed">Need someone to water my indoor plants next week (Tue-Fri).</p>
            </div>
          </div>
        </div>

        {/* This Weekend */}
        <div className="mt-2 animate-slide-up delay-400">
          <div className="flex items-center justify-between px-6 mb-4">
            <h3 className="text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#E8632A]" />
              This Weekend
            </h3>
            <button className="text-xs font-extrabold text-[#E8632A] hover:text-[#F59E0B] transition-colors">See all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-6 snap-x snap-mandatory">
            {section2.map((item) => <EventCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Near You */}
        <div className="mt-2 animate-slide-up delay-400">
          <div className="flex items-center justify-between px-6 mb-4">
            <h3 className="text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E8632A]" />
              Near You
            </h3>
            <button className="text-xs font-extrabold text-[#E8632A] hover:text-[#F59E0B] transition-colors">See all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-6 snap-x snap-mandatory">
            {section3.map((item) => <EventCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-md border-t border-[#E8632A]/10 pb-5 sm:pb-0 pointer-events-auto rounded-t-3xl sm:rounded-none sm:border-x warm-shadow">
            <div className="flex justify-around items-center h-16 px-4">
              <button className="flex flex-col items-center gap-1.5 text-[#E8632A]">
                <Home className="w-5 h-5" fill="currentColor" />
                <span className="text-[10px] font-extrabold tracking-wide">Home</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-[#1C1917]/40 hover:text-[#E8632A] transition-colors">
                <MapPin className="w-5 h-5" />
                <span className="text-[10px] font-extrabold tracking-wide">Map</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-[#1C1917]/40 hover:text-[#E8632A] transition-colors relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E8632A] rounded-full border border-white"></span>
                <span className="text-[10px] font-extrabold tracking-wide">Activities</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-[#1C1917]/40 hover:text-[#E8632A] transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-[10px] font-extrabold tracking-wide">Chat</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-[#1C1917]/40 hover:text-[#E8632A] transition-colors">
                <User className="w-5 h-5" />
                <span className="text-[10px] font-extrabold tracking-wide">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Layout } from "@/components/layout";
import { MapPin, Navigation, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapView() {
  return (
    <Layout>
      <div className="relative w-full h-[100dvh] md:h-screen flex flex-col">
        {/* Map Header Overlay */}
        <div className="absolute top-0 inset-x-0 p-4 z-10 flex gap-2 overflow-x-auto no-scrollbar pointer-events-none">
          <div className="pointer-events-auto flex gap-2">
            <Button variant="secondary" className="rounded-full shadow-md bg-background text-foreground h-10 border border-border">
              <ListFilter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            {["Morning Walks", "Sports", "Social", "Help Needed"].map(tag => (
              <Badge key={tag} tag={tag} />
            ))}
          </div>
        </div>

        {/* Static Map Background to simulate map UI */}
        <div className="flex-1 bg-[#e5e3df] relative overflow-hidden">
          {/* Grid pattern to look like a map */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCA0MEg0MFYwSDBWNDBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-30" />
          
          {/* Map paths/roads simulation */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 200 C 100 250, 300 150, 500 300 S 800 400, 1000 200" fill="none" stroke="#fff" strokeWidth="12" className="opacity-70" />
            <path d="M-100 200 C 100 250, 300 150, 500 300 S 800 400, 1000 200" fill="none" stroke="#eab308" strokeWidth="4" className="opacity-50" />
            
            <path d="M200 -100 C 250 100, 150 300, 300 500 S 400 800, 200 1000" fill="none" stroke="#fff" strokeWidth="16" className="opacity-70" />
            
            <path d="M500 -100 C 550 200, 450 400, 600 600 S 700 900, 500 1100" fill="none" stroke="#fff" strokeWidth="8" className="opacity-70" />
            
            {/* Park / Green area */}
            <path d="M100 400 Q 200 300 300 400 T 200 600 Z" fill="#d1fae5" className="opacity-40" />
            <path d="M600 100 Q 700 50 800 150 T 700 300 Z" fill="#d1fae5" className="opacity-40" />
          </svg>

          {/* Simulated Map Pins */}
          <div className="absolute top-[30%] left-[20%]">
            <MapMarker type="social" title="Evening Tea Meetup" time="Today, 5 PM" />
          </div>
          
          <div className="absolute top-[45%] left-[40%]">
            <MapMarker type="gym" title="CrossFit Group" time="Tomorrow, 6 AM" />
          </div>
          
          <div className="absolute top-[25%] left-[60%]">
            <MapMarker type="tournament" title="Chess Tourney" time="Sat, 10 AM" />
          </div>
          
          <div className="absolute top-[65%] left-[30%]">
            <MapMarker type="sos" title="Lost Golden Retriever" time="Urgent" />
          </div>

          <div className="absolute top-[55%] left-[70%]">
            <MapMarker type="walk" title="Senior Citizen Walk" time="Today, 6 PM" />
          </div>

          {/* Current Location Marker */}
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping" />
              <div className="absolute w-24 h-24 bg-primary/10 rounded-full" />
              <div className="w-5 h-5 bg-white border-4 border-primary rounded-full relative z-10 shadow-lg" />
            </div>
          </div>
        </div>

        {/* Locate Me Button */}
        <div className="absolute bottom-20 md:bottom-6 right-4 z-10">
          <Button size="icon" className="w-12 h-12 rounded-full shadow-lg bg-background text-foreground hover:bg-muted border border-border">
            <Navigation className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}

function Badge({ tag }: { tag: string }) {
  return (
    <div className="pointer-events-auto shrink-0 bg-background text-foreground border border-border px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap">
      {tag}
    </div>
  );
}

function MapMarker({ type, title, time }: { type: string, title: string, time: string }) {
  const colors: Record<string, string> = {
    social: "bg-purple-500",
    gym: "bg-zinc-800",
    tournament: "bg-yellow-500",
    sos: "bg-red-500",
    walk: "bg-green-500"
  };
  
  const color = colors[type] || "bg-primary";

  return (
    <div className="group relative flex flex-col items-center cursor-pointer">
      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-card border border-border shadow-lg rounded-xl p-2 z-20 pointer-events-none transform -translate-x-1/2 left-1/2">
        <p className="font-display font-bold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <div className={`${color} w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-10 hover:scale-110 transition-transform`}>
        <MapPin className="w-4 h-4 text-white" />
      </div>
      <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white absolute top-[28px] drop-shadow-sm`} />
    </div>
  );
}

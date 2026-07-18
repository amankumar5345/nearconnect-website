import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";

const EVENT_TYPES = [
  { id: "morning_walk", title: "Morning Walk / Run", desc: "Find accountability buddies for your 6AM routine", icon: "👟", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "gym", title: "Gym Session", desc: "Looking for a spotter or workout partner", icon: "💪", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  { id: "tournament", title: "Game Tournament", desc: "Host a BGMI squad, chess match, or carrom game", icon: "🎮", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "trip", title: "Trip / Picnic", desc: "Organize a weekend getaway or local picnic", icon: "⛺", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "social", title: "Social Gathering", desc: "Tea meetup, book club, or casual hangout", icon: "☕", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "other", title: "Something Else", desc: "Anything that brings the neighborhood together", icon: "✨", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

export default function NewEventType() {
  return (
    <Layout>
      <div className="flex-1 bg-background flex flex-col h-full">
        <header className="shrink-0 h-16 border-b border-border flex items-center px-4 bg-card">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
            <Link href="/feed">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-display font-semibold text-lg">What do you want to host?</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="font-display font-bold text-3xl mb-2">Choose event type</h2>
              <p className="text-muted-foreground text-lg">Pick the category that best fits your idea to help neighbors find it easily.</p>
            </div>
            
            <div className="grid gap-3">
              {EVENT_TYPES.map(type => (
                <Link key={type.id} href={`/events/new/${type.id}`}>
                  <div className="group bg-card border border-border p-4 sm:p-5 rounded-2xl flex items-center gap-5 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shrink-0 transition-transform group-hover:scale-105 ${type.color}`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

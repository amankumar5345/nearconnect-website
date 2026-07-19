import { Event } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Trophy } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const typeConfig: Record<string, { label: string; dotColor: string; badgeColor: string }> = {
  morning_walk: { label: "Morning Walk", dotColor: "bg-emerald-400",  badgeColor: "bg-emerald-100 text-emerald-800" },
  gym:          { label: "Gym Session",  dotColor: "bg-orange-500",   badgeColor: "bg-orange-100 text-orange-800" },
  tournament:   { label: "Tournament",   dotColor: "bg-indigo-500",   badgeColor: "bg-indigo-100 text-indigo-800" },
  trip:         { label: "Trip",         dotColor: "bg-purple-500",   badgeColor: "bg-purple-100 text-purple-800" },
  picnic:       { label: "Picnic",       dotColor: "bg-amber-400",    badgeColor: "bg-amber-100 text-amber-800" },
  social:       { label: "Social",       dotColor: "bg-pink-400",     badgeColor: "bg-pink-100 text-pink-800" },
  sos:          { label: "SOS",          dotColor: "bg-red-500",      badgeColor: "bg-red-100 text-red-800" },
  other:        { label: "Other",        dotColor: "bg-gray-400",     badgeColor: "bg-gray-100 text-gray-800" },
};

const AVATAR_COLORS = ["bg-rose-400", "bg-sky-400", "bg-amber-400", "bg-violet-400", "bg-emerald-400", "bg-fuchsia-400"];

function AvatarStack({ count, hostName }: { count: number; hostName?: string }) {
  const initials = hostName ? [hostName[0].toUpperCase(), ...Array.from({ length: Math.min(count - 1, 3) }, (_, i) => String.fromCharCode(65 + i))] : [];
  return (
    <div className="flex -space-x-2">
      {initials.map((letter, i) => (
        <div
          key={i}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-[2px] border-white shadow-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
          style={{ zIndex: 10 - i }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

/** Compact card — used in horizontal scroll sections */
export function CompactEventCard({ event }: { event: Event }) {
  const config = typeConfig[event.type] || typeConfig.other;
  const startDate = new Date(event.startAt);

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div
        className="min-w-[220px] w-[220px] bg-white rounded-2xl p-4 shrink-0 snap-center border border-primary/5 flex flex-col hover:border-primary/20 transition-all duration-300 cursor-pointer"
        style={{ boxShadow: "0 8px 24px rgba(232,99,42,0.10)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor} shrink-0`} />
          <span className="text-[10px] font-extrabold text-foreground/50 uppercase tracking-wider truncate">{config.label}</span>
          {event.isTournament && <Trophy className="w-3 h-3 text-amber-500 ml-auto shrink-0" />}
        </div>

        <h3 className="font-extrabold text-base text-foreground leading-tight mb-1 line-clamp-2">{event.title}</h3>
        <p className="text-xs text-foreground/50 font-medium mb-4">by {event.host?.name?.split(" ")[0]}</p>

        <div className="flex items-center justify-between mt-auto mb-3">
          <div className="bg-primary/8 text-primary text-xs font-extrabold px-3 py-1.5 rounded-lg border border-primary/10">
            {format(startDate, "MMM d, h:mm a")}
          </div>
          <AvatarStack count={event.currentParticipants || 1} hostName={event.host?.name} />
        </div>

        <div className="w-full bg-white hover:bg-primary text-primary hover:text-white transition-all duration-300 py-2.5 rounded-xl text-xs font-bold border border-primary/20 shadow-sm text-center active:scale-95">
          Join Now
        </div>
      </div>
    </Link>
  );
}

/** Full card — used in grid views */
export function EventCard({ event }: EventCardProps) {
  const config = typeConfig[event.type] || typeConfig.other;
  const startDate = new Date(event.startAt);
  const fillPct = event.maxParticipants
    ? Math.min(100, (event.currentParticipants / event.maxParticipants) * 100)
    : 0;

  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div
        className="bg-white rounded-2xl p-5 border border-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer"
        style={{ boxShadow: "0 8px 24px rgba(232,99,42,0.10)" }}
      >
        {/* Category + Title */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor} shrink-0 mt-0.5`} />
            <span className="text-[10px] font-extrabold text-foreground/50 uppercase tracking-wider">{config.label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {event.isTournament && (
              <Badge className="text-[10px] bg-amber-100 text-amber-700 border-none gap-1 font-bold">
                <Trophy className="w-3 h-3" /> Prize
              </Badge>
            )}
            {event.entryFee && (
              <span className="text-[10px] font-extrabold text-primary bg-primary/8 px-2 py-0.5 rounded-full border border-primary/10">
                ₹{event.entryFee}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-extrabold text-lg text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {/* Host */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
            {event.host?.name?.[0] || "H"}
          </div>
          <span className="text-xs text-foreground/50 font-medium">by {event.host?.name || "Host"}</span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{format(startDate, "EEE, MMM d · h:mm a")}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-foreground/60">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Participants progress */}
        {event.maxParticipants && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-bold text-foreground/50 mb-1.5">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Participants</span>
              <span>{event.currentParticipants} / {event.maxParticipants}</span>
            </div>
            <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button className="w-full bg-white hover:bg-primary text-primary hover:text-white transition-all duration-300 py-2.5 rounded-xl text-sm font-bold border border-primary/20 shadow-sm active:scale-95">
          View Details
        </button>
      </div>
    </Link>
  );
}

import { Event } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Trophy } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { UserAvatar } from "./user-avatar";

interface EventCardProps {
  event: Event;
}

const typeConfig = {
  morning_walk: { label: "Morning Walk", color: "bg-green-100 text-green-800" },
  gym: { label: "Gym Session", color: "bg-zinc-100 text-zinc-800" },
  tournament: { label: "Tournament", color: "bg-yellow-100 text-yellow-800" },
  trip: { label: "Trip", color: "bg-blue-100 text-blue-800" },
  picnic: { label: "Picnic", color: "bg-orange-100 text-orange-800" },
  social: { label: "Social", color: "bg-purple-100 text-purple-800" },
  sos: { label: "SOS", color: "bg-red-100 text-red-800" },
  other: { label: "Other", color: "bg-gray-100 text-gray-800" },
};

export function EventCard({ event }: EventCardProps) {
  const config = typeConfig[event.type] || typeConfig.other;
  const startDate = new Date(event.startAt);

  return (
    <Card className="overflow-hidden group hover-elevate transition-all border-border shadow-sm">
      <Link href={`/events/${event.id}`} className="block">
        {event.imageUrl ? (
          <div className="h-40 w-full overflow-hidden bg-muted relative">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className={`border-none ${config.color}`}>
                {config.label}
              </Badge>
              {event.isTournament && (
                <Badge className="bg-primary text-primary-foreground border-none gap-1">
                  <Trophy className="w-3 h-3" /> Prize
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-5 px-5 pb-0 flex justify-between items-start">
            <Badge variant="secondary" className={`border-none ${config.color}`}>
              {config.label}
            </Badge>
            {event.isTournament && (
              <Badge className="bg-primary text-primary-foreground border-none gap-1">
                <Trophy className="w-3 h-3" /> Prize
              </Badge>
            )}
          </div>
        )}

        <div className="p-5">
          <h3 className="font-display font-semibold text-lg line-clamp-1 mb-1 text-foreground">
            {event.title}
          </h3>
          
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(startDate, "MMM d, h:mm a")}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground line-clamp-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>
                {event.currentParticipants} 
                {event.maxParticipants ? ` / ${event.maxParticipants}` : ""} joined
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <UserAvatar user={event.host} className="w-6 h-6" />
              <span className="text-xs font-medium text-foreground">
                {event.host?.name?.split(" ")[0]}
              </span>
            </div>
            
            <Button size="sm" className="rounded-full h-8 px-4 font-medium" asChild>
              <span>View Details</span>
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}

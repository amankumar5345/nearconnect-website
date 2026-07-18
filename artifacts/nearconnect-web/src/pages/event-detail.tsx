import { Layout } from "@/components/layout";
import { Link, useRoute } from "wouter";
import { 
  useGetEvent, 
  useGetEventRegistrations, 
  useRegisterForEvent,
  getGetEventQueryKey,
  getGetEventRegistrationsQueryKey
} from "@workspace/api-client-react";
import { useAuthStore } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { ArrowLeft, Calendar, MapPin, Users, Trophy, IndianRupee, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function EventDetail() {
  const [, params] = useRoute("/events/:eventId");
  const eventId = Number(params?.eventId);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  
  const { data: event, isLoading: eventLoading } = useGetEvent(eventId, {
    query: { enabled: !!eventId, queryKey: getGetEventQueryKey(eventId) }
  });

  const { data: registrations } = useGetEventRegistrations(eventId, {
    query: { enabled: !!eventId, queryKey: getGetEventRegistrationsQueryKey(eventId) }
  });

  const registerMutation = useRegisterForEvent();

  const isHost = event?.hostId === user?.id;
  const isRegistered = registrations?.some(r => r.userId === user?.id);
  const isFull = event?.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;

  const handleJoin = () => {
    setIsJoining(true);
    registerMutation.mutate({ eventId, data: {} }, {
      onSuccess: () => {
        toast.success("Successfully joined the event!");
        queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) });
        queryClient.invalidateQueries({ queryKey: getGetEventRegistrationsQueryKey(eventId) });
        setIsJoining(false);
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to join event");
        setIsJoining(false);
      }
    });
  };

  if (eventLoading) {
    return (
      <Layout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <Button asChild className="mt-4"><Link href="/feed">Back to feed</Link></Button>
        </div>
      </Layout>
    );
  }

  const startDate = new Date(event.startAt);

  return (
    <Layout>
      <div className="flex flex-col h-[100dvh] md:h-screen bg-background pb-20 md:pb-0">
        <header className="shrink-0 absolute top-0 inset-x-0 z-10 p-4 flex justify-between items-center pointer-events-none">
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/80 backdrop-blur pointer-events-auto" asChild>
            <Link href="/feed">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/80 backdrop-blur pointer-events-auto">
            <Share2 className="w-5 h-5 text-foreground" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          <div className="h-72 md:h-96 bg-muted relative">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <Calendar className="w-20 h-20 text-primary/40 mb-4" />
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 text-white">
              <div className="flex gap-2 mb-3">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-none uppercase tracking-wider text-[10px] font-bold">
                  {event.type.replace('_', ' ')}
                </Badge>
                {event.status === 'ongoing' && (
                  <Badge className="bg-green-500 text-white border-none uppercase tracking-wider text-[10px] font-bold animate-pulse">
                    Live Now
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-2 drop-shadow-sm">{event.title}</h1>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-background rounded-t-3xl -mt-6 relative z-10 p-5 md:p-8">
            
            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <Card className="p-3 border-border bg-card flex flex-col">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </div>
                <span className="font-semibold text-sm">{format(startDate, "MMM d, yyyy")}</span>
              </Card>
              
              <Card className="p-3 border-border bg-card flex flex-col">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5" /> Time
                </div>
                <span className="font-semibold text-sm">{format(startDate, "h:mm a")}</span>
              </Card>

              <Card className="p-3 border-border bg-card flex flex-col">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </div>
                <span className="font-semibold text-sm line-clamp-1">{event.location || "TBD"}</span>
              </Card>
              
              <Card className="p-3 border-border bg-card flex flex-col">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
                  <IndianRupee className="w-3.5 h-3.5" /> Entry
                </div>
                <span className="font-semibold text-sm text-green-600">
                  {event.entryFee ? `₹${event.entryFee}` : 'Free'}
                </span>
              </Card>
            </div>

            {event.isTournament && event.prize && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-yellow-900">Tournament Prize</h3>
                  <p className="text-yellow-700 text-sm">{event.prize}</p>
                </div>
              </div>
            )}

            {/* Host Section */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border mb-8">
              <div className="flex items-center gap-3">
                <UserAvatar user={event.host} className="w-12 h-12 border-2 border-background" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Hosted by</p>
                  <p className="font-display font-semibold">{event.host?.name}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link href={`/profile/${event.host?.id}`}>View Profile</Link>
              </Button>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="font-display font-bold text-xl mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Participants */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Attendees ({event.currentParticipants}{event.maxParticipants ? `/${event.maxParticipants}` : ''})
                </h3>
              </div>
              
              {registrations && registrations.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {registrations.slice(0, 10).map((reg) => (
                    <div key={reg.id} className="flex flex-col items-center gap-1 w-16">
                      <UserAvatar user={reg.user} className="w-12 h-12" />
                      <span className="text-[10px] font-medium text-center line-clamp-1 w-full">{reg.user?.name?.split(' ')[0]}</span>
                    </div>
                  ))}
                  {registrations.length > 10 && (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      +{registrations.length - 10}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">Be the first to join!</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar (Fixed Bottom) */}
        <div className="shrink-0 p-4 bg-card border-t border-border pb-safe">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="font-semibold text-sm">
                {event.maxParticipants 
                  ? `${event.maxParticipants - event.currentParticipants} spots left`
                  : 'Unlimited spots'
                }
              </p>
            </div>
            
            {isHost ? (
              <Button className="w-full sm:w-auto h-12 rounded-xl px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Manage Event
              </Button>
            ) : isRegistered ? (
              <div className="flex w-full sm:w-auto gap-2">
                <Button variant="outline" className="flex-1 sm:w-auto h-12 rounded-xl text-green-600 border-green-200 bg-green-50 cursor-default hover:bg-green-50" disabled>
                  ✓ Registered
                </Button>
                {/* Find the group chat room if we had the logic here */}
                <Button className="flex-1 sm:w-auto h-12 rounded-xl" asChild>
                  <Link href="/chat">Open Chat</Link>
                </Button>
              </div>
            ) : isFull ? (
              <Button disabled className="w-full sm:w-auto h-12 rounded-xl px-8" variant="secondary">
                Event is Full
              </Button>
            ) : (
              <Button 
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full sm:w-auto h-12 rounded-xl px-8 font-bold text-base shadow-md hover:-translate-y-1 transition-transform"
              >
                {isJoining ? "Joining..." : "Join Event"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

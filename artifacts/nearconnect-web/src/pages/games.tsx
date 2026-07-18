import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Trophy, Gamepad2, Plus, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListEvents, getListEventsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Games() {
  const { data: events, isLoading } = useListEvents(
    { type: "tournament" },
    { query: { queryKey: getListEventsQueryKey({ type: "tournament" }) } }
  );

  return (
    <Layout>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Games & Tournaments</h1>
            <p className="text-sm text-muted-foreground">Local e-sports and board games</p>
          </div>
          <Button className="rounded-full shadow-sm" asChild>
            <Link href="/events/new/tournament">
              <Plus className="w-4 h-4 mr-2" />
              Host Match
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {["BGMI", "Chess", "Carrom", "FIFA"].map((game, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Gamepad2 className="w-8 h-8 text-primary mb-2" />
                <span className="font-display font-bold">{game}</span>
              </div>
            ))}
          </div>

          <h2 className="font-display font-bold text-xl mb-4">Upcoming Matches</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map(event => (
                <Card key={event.id} className="p-0 overflow-hidden border-border group hover-elevate transition-all">
                  <Link href={`/events/${event.id}`} className="flex flex-col sm:flex-row">
                    {event.imageUrl ? (
                      <div className="sm:w-48 h-32 sm:h-auto shrink-0 relative">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="sm:w-48 h-32 sm:h-auto shrink-0 bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Trophy className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-bold text-lg line-clamp-1">{event.title}</h3>
                        {event.prize && (
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ml-2">
                            Prize: {event.prize}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-auto pt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.startAt), "MMM d, h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{event.currentParticipants}{event.maxParticipants ? `/${event.maxParticipants}` : ''} players</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 border border-dashed border-border rounded-3xl bg-card">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg">No active tournaments</h3>
              <p className="text-muted-foreground mb-4">Be the first to organize a neighborhood cup!</p>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/events/new/tournament">Create Tournament</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

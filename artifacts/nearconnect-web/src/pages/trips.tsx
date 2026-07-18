import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Map, Plus, Calendar, MapPin, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListEvents, getListEventsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Trips() {
  const { data: events, isLoading } = useListEvents(
    { type: "trip" },
    { query: { queryKey: getListEventsQueryKey({ type: "trip" }) } }
  );

  return (
    <Layout>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Trips & Picnics</h1>
            <p className="text-sm text-muted-foreground">Weekend getaways with neighbors</p>
          </div>
          <Button className="rounded-full shadow-sm" asChild>
            <Link href="/events/new/trip">
              <Plus className="w-4 h-4 mr-2" />
              Plan a Trip
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          
          <div className="relative h-48 rounded-3xl overflow-hidden mb-8 group">
            <img 
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Camping trip" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">FEATURED</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-1">Lonavala Weekend Drive</h2>
              <p className="text-white/80 line-clamp-1">Looking for 3 more cars to join the convoy this Saturday!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Bus className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl">Upcoming Departures</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(event => (
                <Card key={event.id} className="overflow-hidden border-border group hover-elevate">
                  <Link href={`/events/${event.id}`}>
                    <div className="h-40 bg-blue-100 relative">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-300">
                          <Map className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-foreground">
                        {event.entryFee ? `₹${event.entryFee}/person` : 'Free entry'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-lg mb-3 line-clamp-1">{event.title}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(new Date(event.startAt), "MMM d")} - {event.endAt ? format(new Date(event.endAt), "MMM d") : 'Day trip'}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 line-clamp-1">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 border border-dashed border-border rounded-3xl bg-card">
              <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg">No upcoming trips</h3>
              <p className="text-muted-foreground mb-4">Time to plan a weekend getaway!</p>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/events/new/trip">Organize a Trip</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

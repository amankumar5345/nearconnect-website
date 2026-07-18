import { useGetFeed, useGetEventStats, getGetFeedQueryKey, getGetEventStatsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CalendarDays, Activity } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Feed() {
  const { data: events, isLoading: loadingEvents } = useGetFeed(
    { limit: 20 },
    { query: { queryKey: getGetFeedQueryKey({ limit: 20 }) } }
  );

  const { data: stats, isLoading: loadingStats } = useGetEventStats({
    query: { queryKey: getGetEventStatsQueryKey() }
  });

  return (
    <Layout>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Neighborhood Feed</h1>
            <p className="text-sm text-muted-foreground">Happening around you</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Stats Banner */}
          {!loadingStats && stats && (
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-primary mb-2" />
                <span className="text-2xl font-bold font-display text-primary">{stats.totalUsers}</span>
                <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">Neighbors</span>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <CalendarDays className="w-6 h-6 text-yellow-600 mb-2" />
                <span className="text-2xl font-bold font-display text-yellow-600">{stats.upcomingEvents}</span>
                <span className="text-xs font-medium text-yellow-600/80 uppercase tracking-wider">Upcoming</span>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Activity className="w-6 h-6 text-accent mb-2" />
                <span className="text-2xl font-bold font-display text-accent">{stats.activeToday}</span>
                <span className="text-xs font-medium text-accent/80 uppercase tracking-wider">Active Today</span>
              </div>
            </div>
          )}

          {/* Create Event CTA */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Got an idea?</h3>
              <p className="text-sm text-muted-foreground">Host a walk, game, or meetup for your neighbors.</p>
            </div>
            <Button className="rounded-full shrink-0 shadow-sm" asChild>
              <Link href="/events/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Feed */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl">For You</h2>
            
            {loadingEvents ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-3xl bg-muted/30">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">It's quiet here...</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                  There are no upcoming events in your area right now. Be the first to host something!
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/events/new">Host an Event</Link>
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <Button size="icon" className="w-14 h-14 rounded-full shadow-lg" asChild>
          <Link href="/events/new">
            <Plus className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </Layout>
  );
}

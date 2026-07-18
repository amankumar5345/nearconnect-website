import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useAuthStore } from "@/hooks/use-auth";
import { useGetMe, useGetMyEvents, useGetMyRegistrations, useLogout, getGetMyEventsQueryKey, getGetMyRegistrationsQueryKey } from "@workspace/api-client-react";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/event-card";
import { Settings, LogOut, MapPin, CalendarDays, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { logout: clearLocalUser } = useAuthStore();
  const { data: user, isLoading: userLoading } = useGetMe();
  const logoutMutation = useLogout();
  
  const { data: hostedEvents, isLoading: hostedLoading } = useGetMyEvents({
    query: { queryKey: getGetMyEventsQueryKey() }
  });
  
  const { data: registeredEvents, isLoading: registeredLoading } = useGetMyRegistrations({
    query: { queryKey: getGetMyRegistrationsQueryKey() }
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearLocalUser();
        window.location.href = "/";
      }
    });
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-card border-b border-border">
          <div className="h-32 bg-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBDNC40NzcgMCAwIDQuNDc3IDAgMTBzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTUuNTIzIDAgMTAgMHptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIgZmlsbD0iI2YwNWEyOCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-4">
              <div className="relative">
                {userLoading ? (
                  <Skeleton className="w-24 h-24 rounded-full border-4 border-card" />
                ) : (
                  <UserAvatar user={user} className="w-24 h-24 border-4 border-card shadow-sm" />
                )}
              </div>
              
              <div className="flex-1">
                {userLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <div>
                    <h1 className="font-display font-bold text-2xl">{user?.name}</h1>
                    {user?.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full shadow-sm" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Settings</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </div>
            </div>

            {user?.bio && (
              <p className="text-foreground max-w-2xl mb-4">{user.bio}</p>
            )}

            {user?.attributes && user.attributes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {user.attributes.map(attr => (
                  <span key={attr} className="bg-muted px-3 py-1 rounded-full text-xs font-medium border border-border">
                    {attr.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
            
            {!userLoading && user && (
              <div className="flex gap-6 mt-6 pt-6 border-t border-border">
                <div>
                  <span className="font-display font-bold text-xl block">{user.eventsHosted || 0}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Hosted</span>
                </div>
                <div>
                  <span className="font-display font-bold text-xl block">{user.eventsJoined || 0}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Joined</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <Tabs defaultValue="joined" className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 mb-8 bg-muted p-1 rounded-xl">
              <TabsTrigger value="joined" className="rounded-lg">Joined Events</TabsTrigger>
              <TabsTrigger value="hosted" className="rounded-lg">Hosted by me</TabsTrigger>
            </TabsList>
            
            <TabsContent value="joined" className="space-y-4">
              {registeredLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
                </div>
              ) : registeredEvents && registeredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registeredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-3xl bg-card">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-6">You haven't joined any events yet.</p>
                  <Button className="rounded-full" asChild>
                    <Link href="/feed">Explore Events</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hosted" className="space-y-4">
              {hostedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
                </div>
              ) : hostedEvents && hostedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-3xl bg-card">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg mb-2">Be a host</h3>
                  <p className="text-muted-foreground mb-6">Organize something fun for your neighborhood.</p>
                  <Button className="rounded-full" asChild>
                    <Link href="/events/new">Create Event</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

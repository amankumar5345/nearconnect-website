import { Layout } from "@/components/layout";
import { Link, useRoute } from "wouter";
import { useGetUser, getGetUserQueryKey } from "@workspace/api-client-react";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfile() {
  const [, params] = useRoute("/profile/:userId");
  const userId = Number(params?.userId);

  const { data: user, isLoading } = useGetUser(userId, {
    query: { enabled: !!userId, queryKey: getGetUserQueryKey(userId) }
  });

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        <header className="shrink-0 absolute top-0 inset-x-0 z-10 p-4 flex justify-between items-center pointer-events-none">
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/80 backdrop-blur pointer-events-auto" asChild>
            <Link href="/feed">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
          </Button>
        </header>

        <div className="bg-card border-b border-border min-h-[40vh] md:min-h-0">
          <div className="h-32 md:h-48 bg-secondary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBDNC40NzcgMCAwIDQuNDc3IDAgMTBzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTUuNTIzIDAgMTAgMHptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIgZmlsbD0iI2ZmYWUwMCIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+PC9zdmc+')] opacity-50" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 md:-mt-20 mb-6">
              <div className="relative">
                {isLoading ? (
                  <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card" />
                ) : (
                  <UserAvatar user={user} className="w-32 h-32 md:w-40 md:h-40 border-4 border-card shadow-sm" />
                )}
              </div>
              
              <div className="flex-1 mt-2 sm:mt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ) : (
                  <div>
                    <h1 className="font-display font-bold text-3xl">{user?.name}</h1>
                    {user?.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Button className="rounded-full shadow-sm px-6 h-12 w-full sm:w-auto" asChild>
                  <Link href="/chat">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Link>
                </Button>
              </div>
            </div>

            {user?.bio && (
              <p className="text-foreground max-w-2xl mb-6 text-lg">{user.bio}</p>
            )}

            {user?.attributes && user.attributes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {user.attributes.map(attr => (
                  <span key={attr} className="bg-primary/5 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20">
                    {attr.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
            
            {!isLoading && user && (
              <div className="flex gap-8 mt-8 pt-8 border-t border-border">
                <div className="text-center sm:text-left">
                  <span className="font-display font-bold text-3xl block text-primary">{user.eventsHosted || 0}</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Events Hosted</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-display font-bold text-3xl block text-secondary">{user.eventsJoined || 0}</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Events Joined</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

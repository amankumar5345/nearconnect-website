import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { useListChatRooms, getListChatRoomsQueryKey } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Users, User, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

export default function Chat() {
  const [, setLocation] = useLocation();
  const { data: rooms, isLoading } = useListChatRooms({
    query: { queryKey: getListChatRoomsQueryKey() }
  });

  return (
    <Layout>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Messages</h1>
            <p className="text-sm text-muted-foreground">Event groups and direct chats</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-muted/10">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms && rooms.length > 0 ? (
            <div className="divide-y divide-border">
              {rooms.map(room => {
                const isGroup = room.type === 'event' || room.type === 'group';
                
                return (
                  <button
                    key={room.id}
                    onClick={() => setLocation(`/chat/${room.id}`)}
                    className="w-full text-left p-4 md:p-6 flex items-center gap-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="relative shrink-0">
                      {room.avatarUrl ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-border">
                          <img src={room.avatarUrl} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-border ${isGroup ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {isGroup ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                      )}
                      {room.unreadCount ? (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                          {room.unreadCount > 9 ? '9+' : room.unreadCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-display font-semibold text-base truncate pr-2">
                          {room.name}
                        </h3>
                        {room.lastMessageAt && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(room.lastMessageAt), { addSuffix: false }).replace('about ', '')}
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm truncate ${room.unreadCount ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {room.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">No messages yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                When you join events, you'll be added to group chats automatically to coordinate with neighbors.
              </p>
              <Link href="/feed" className="text-primary font-medium hover:underline">
                Discover events to join
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

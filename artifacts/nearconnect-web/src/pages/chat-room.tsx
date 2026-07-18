import { useState, useRef, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { 
  useGetChatMessages, 
  useSendMessage,
  getListChatRoomsQueryKey,
  getGetChatMessagesQueryKey,
  useListChatRooms
} from "@workspace/api-client-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { UserAvatar } from "@/components/user-avatar";

export default function ChatRoom() {
  const [, params] = useRoute("/chat/:roomId");
  const roomId = Number(params?.roomId);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: rooms } = useListChatRooms({
    query: { queryKey: getListChatRoomsQueryKey() }
  });
  
  const room = rooms?.find(r => r.id === roomId);

  const { data: messages, isLoading } = useGetChatMessages(roomId, {
    query: { 
      enabled: !!roomId,
      queryKey: getGetChatMessagesQueryKey(roomId)
    }
  });

  const sendMessageMutation = useSendMessage({
    mutation: {
      onSuccess: () => {
        setInputText("");
        queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey(roomId) });
        queryClient.invalidateQueries({ queryKey: getListChatRoomsQueryKey() });
      }
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !roomId) return;
    
    sendMessageMutation.mutate({ 
      roomId, 
      data: { text: inputText.trim() } 
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen bg-background w-full">
      {/* Header */}
      <header className="shrink-0 h-16 bg-card border-b border-border flex items-center px-4 shrink-0">
        <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
          <Link href="/chat">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {room?.type === 'event' ? <Users className="w-5 h-5" /> : <span className="font-bold">{room?.name?.[0] || '#'}</span>}
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-semibold text-base truncate">{room?.name || 'Chat Room'}</h2>
            {room?.participantCount && (
              <p className="text-xs text-muted-foreground">{room.participantCount} members</p>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fcfaf8] flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-2/3 h-16 bg-muted rounded-2xl rounded-tl-none self-start" />
            <div className="w-1/2 h-12 bg-primary/20 rounded-2xl rounded-tr-none self-end" />
            <div className="w-3/4 h-20 bg-muted rounded-2xl rounded-tl-none self-start" />
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((msg, i) => {
              const isMe = msg.userId === user?.id;
              const showAvatar = !isMe && (i === 0 || messages[i-1].userId !== msg.userId);
              
              return (
                <div key={msg.id} className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? 'self-end' : 'self-start'}`}>
                  {!isMe && (
                    <div className="w-8 shrink-0 flex items-end">
                      {showAvatar && <UserAvatar user={msg.user} className="w-8 h-8" />}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                      <span className="text-xs text-muted-foreground ml-1 mb-1 font-medium">
                        {msg.user?.name?.split(' ')[0]}
                      </span>
                    )}
                    
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      isMe 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-white border border-border text-foreground rounded-bl-sm shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                    
                    <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full">
            <div className="bg-white px-4 py-2 rounded-full border border-border text-sm shadow-sm">
              This is the beginning of your chat history.
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 md:p-4 bg-card border-t border-border mb-safe">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full h-12 px-5 bg-muted/50 border-transparent focus-visible:bg-background"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12 rounded-full shrink-0 shadow-sm"
            disabled={!inputText.trim() || sendMessageMutation.isPending}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

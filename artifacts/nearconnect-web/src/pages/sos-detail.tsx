import { Layout } from "@/components/layout";
import { Link, useRoute } from "wouter";
import { useListSosRequests, useRespondToSos, getListSosRequestsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { ArrowLeft, MapPin, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function SOSDetail() {
  const [, params] = useRoute("/sos/:id");
  const sosId = Number(params?.id);
  const queryClient = useQueryClient();
  
  const [message, setMessage] = useState("");
  const [hasResponded, setHasResponded] = useState(false);

  const { data: requests, isLoading } = useListSosRequests({
    query: { queryKey: getListSosRequestsQueryKey() }
  });

  const respondMutation = useRespondToSos();
  const request = requests?.find(r => r.id === sosId);

  const handleRespond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    respondMutation.mutate({
      sosId,
      data: { message }
    }, {
      onSuccess: () => {
        toast.success("Response sent!");
        setHasResponded(true);
        queryClient.invalidateQueries({ queryKey: getListSosRequestsQueryKey() });
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to send response");
      }
    });
  };

  if (isLoading) {
    return <Layout><div className="p-8 animate-pulse bg-red-50 h-full">Loading alert...</div></Layout>;
  }

  if (!request) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <h2 className="text-2xl font-bold">SOS Alert not found</h2>
          <Button asChild className="mt-4"><Link href="/sos">Back to SOS List</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[100dvh] md:h-screen bg-background">
        <header className="shrink-0 h-16 border-b border-border flex items-center px-4 bg-card z-10">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
            <Link href="/sos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-display font-semibold text-lg leading-tight">SOS Alert Details</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-muted/10">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="bg-white border-2 border-red-200 rounded-3xl overflow-hidden shadow-sm relative">
              <div className="h-3 bg-red-500 w-full absolute top-0 inset-x-0" />
              
              <div className="p-6 md:p-8 pt-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Urgent SOS
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <h2 className="font-display font-bold text-3xl mb-4 text-foreground">{request.title}</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {request.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-muted/50 rounded-2xl mb-8">
                  <div className="flex items-center gap-3 flex-1">
                    <UserAvatar user={request.requester} className="w-12 h-12" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Requested by</p>
                      <p className="font-display font-semibold text-lg">{request.requester?.name}</p>
                    </div>
                  </div>
                  
                  {request.location && (
                    <div className="flex-1 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                      </p>
                      <p className="font-medium">{request.location}</p>
                    </div>
                  )}
                </div>

                {!hasResponded ? (
                  <form onSubmit={handleRespond} className="space-y-4">
                    <h3 className="font-display font-bold text-xl">Can you help?</h3>
                    <Textarea 
                      placeholder="Let the requester know how you can help or that you're on the way..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px] rounded-xl resize-none"
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-lg font-bold bg-red-600 hover:bg-red-700 text-white"
                      disabled={respondMutation.isPending}
                    >
                      {respondMutation.isPending ? "Sending..." : "Send Response"}
                    </Button>
                  </form>
                ) : (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-display font-bold text-xl mb-2">Response Sent</h3>
                    <p className="text-sm">Your contact info and message have been sent to the requester. They will reach out to you if needed.</p>
                  </div>
                )}
              </div>
            </div>

            {request.responseCount ? (
              <div className="text-center p-4">
                <p className="text-muted-foreground font-medium">
                  {request.responseCount} neighbors have already offered help.
                </p>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </Layout>
  );
}

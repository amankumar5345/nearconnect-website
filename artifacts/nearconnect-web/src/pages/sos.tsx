import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { ShieldAlert, AlertCircle, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListSosRequests, getListSosRequestsQueryKey } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";

export default function SOS() {
  const { data: requests, isLoading } = useListSosRequests({ 
    query: { queryKey: getListSosRequestsQueryKey() } 
  });

  const activeRequests = requests?.filter(r => r.status === 'open') || [];

  return (
    <Layout>
      <header className="sticky top-0 z-30 bg-red-50 dark:bg-red-950/20 backdrop-blur-md border-b border-red-100 dark:border-red-900/30 px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-red-900 dark:text-red-400">Community SOS</h1>
              <p className="text-sm text-red-700/70 dark:text-red-500/70">Urgent help requests from neighbors</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-muted/10">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-red-600 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl mb-2">Need immediate help?</h2>
                <p className="text-red-100 max-w-md">Alert neighbors within a 2km radius. Use this only for urgent situations that require community assistance.</p>
              </div>
              <Button size="lg" className="w-full md:w-auto rounded-full bg-white text-red-600 hover:bg-red-50 font-bold h-14 px-8 text-lg" asChild>
                <Link href="/sos/new">
                  Raise SOS Alert
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Active Alerts ({activeRequests.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-40 bg-white border border-border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : activeRequests.length > 0 ? (
            <div className="space-y-4">
              {activeRequests.map(request => (
                <Card key={request.id} className="overflow-hidden border-red-200 shadow-sm">
                  <div className="h-2 bg-red-500 w-full" />
                  <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Urgent Help Needed</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <h3 className="font-display font-bold text-xl mb-2">{request.title}</h3>
                      <p className="text-muted-foreground mb-4">{request.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-foreground">
                        <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg">
                          <MapPin className="w-4 h-4 text-primary" />
                          {request.location || "Location not provided"}
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg">
                          <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                            {request.requester?.name?.[0]}
                          </div>
                          {request.requester?.name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0 md:w-48">
                      <Button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white" asChild>
                        <Link href={`/sos/${request.id}`}>I Can Help</Link>
                      </Button>
                      <Button variant="outline" className="w-full rounded-xl">
                        Share Alert
                      </Button>
                      {request.responseCount ? (
                        <p className="text-center text-xs text-muted-foreground mt-2">
                          {request.responseCount} neighbors responding
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-white">
              <ShieldAlert className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-green-700">All is peaceful</h3>
              <p className="text-muted-foreground mb-4">There are no active SOS requests in your area right now.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

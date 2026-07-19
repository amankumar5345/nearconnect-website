import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { ShieldAlert, AlertCircle, MapPin, Clock } from "lucide-react";
import { useListSosRequests, getListSosRequestsQueryKey } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";

export default function SOS() {
  const { data: requests, isLoading } = useListSosRequests({
    query: { queryKey: getListSosRequestsQueryKey() },
  });

  const activeRequests = requests?.filter(r => r.status === "open") || [];

  return (
    <Layout>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 md:px-6 pt-10 md:pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2.5 rounded-2xl">
              <ShieldAlert className="w-5 h-5 text-red-600 nc-pulse-soft" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-foreground">Community SOS</h1>
              <p className="text-xs text-foreground/50 font-medium">Urgent help from neighbors</p>
            </div>
          </div>
          <Link href="/sos/new">
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
              style={{ boxShadow: "0 4px 12px rgba(239,68,68,0.25)" }}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="hidden md:inline">Raise SOS</span>
            </button>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 space-y-5">

          {/* Hero Banner */}
          <div
            className="bg-gradient-to-br from-red-500 to-[#E8632A] rounded-[24px] p-6 md:p-8 text-white relative overflow-hidden nc-slide-up"
            style={{ boxShadow: "0 12px 36px rgba(239,68,68,0.30)" }}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-2xl mb-2">Need immediate help?</h2>
                <p className="text-red-100 font-medium text-sm max-w-xs leading-relaxed">
                  Alert neighbors within a 2km radius. Use this only for urgent situations.
                </p>
              </div>
              <Link href="/sos/new">
                <button className="shrink-0 flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-extrabold text-base hover:bg-red-50 transition-colors shadow-md">
                  Raise SOS Alert
                </button>
              </Link>
            </div>
          </div>

          {/* Active Alerts Header */}
          <div className="flex items-center justify-between nc-slide-up-1">
            <h2 className="font-extrabold text-lg text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Active Alerts
              <span className="ml-1 bg-red-100 text-red-600 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {activeRequests.length}
              </span>
            </h2>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-border" />
              ))}
            </div>
          )}

          {/* SOS Cards */}
          {!isLoading && activeRequests.length > 0 && (
            <div className="space-y-4 nc-slide-up-2">
              {activeRequests.map(request => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl overflow-hidden border border-red-100 hover:border-red-200 transition-all"
                  style={{ boxShadow: "0 4px 20px rgba(239,68,68,0.10)" }}
                >
                  {/* Red top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-red-500 to-[#E8632A]" />

                  <div className="p-5 md:p-6">
                    {/* Badge + time */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Urgent Help Needed
                      </span>
                      <span className="text-xs text-foreground/50 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl text-foreground mb-2">{request.title}</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed mb-5">{request.description}</p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-xl text-sm font-bold text-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {request.location || "Location not shared"}
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-xl text-sm font-bold text-foreground">
                        <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-extrabold">
                          {request.requester?.name?.[0]}
                        </div>
                        {request.requester?.name || "Neighbor"}
                      </div>
                      {request.responseCount ? (
                        <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-xl text-sm font-bold text-red-600">
                          {request.responseCount} responding
                        </div>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link href={`/sos/${request.id}`} className="flex-1">
                        <button
                          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
                        >
                          I Can Help
                        </button>
                      </Link>
                      <button className="px-5 py-3 rounded-xl border border-border text-sm font-bold text-foreground hover:border-red-300 hover:text-red-600 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && activeRequests.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-green-200 rounded-3xl bg-white nc-slide-up-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-extrabold text-lg mb-1 text-green-800">All is peaceful</h3>
              <p className="text-foreground/50 text-sm max-w-xs mx-auto">
                No active SOS requests in your area right now.
              </p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

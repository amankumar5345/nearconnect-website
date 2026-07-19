import {
  useGetFeed,
  useGetEventStats,
  useListSosRequests,
  useListNotices,
  getGetFeedQueryKey,
  getGetEventStatsQueryKey,
  getListSosRequestsQueryKey,
  getListNoticesQueryKey,
  Event,
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { CompactEventCard, EventCard } from "@/components/event-card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/hooks/use-auth";
import {
  Sun, Bell, Calendar, Users, Activity, MapPin,
  AlertCircle, Megaphone, Plus, ChevronRight,
} from "lucide-react";

// Sun is used in JSX below; keep the import
const _useSun = Sun;
import { addDays, startOfDay, isAfter, isBefore } from "date-fns";

function getGreeting(name?: string) {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${time}, ${name?.split(" ")[0] || "neighbor"}`;
}

function groupEvents(events: Event[]) {
  const now = new Date();
  const tomorrowStart = startOfDay(addDays(now, 1));
  const tomorrowEnd = startOfDay(addDays(now, 2));
  const weekendEnd = startOfDay(addDays(now, 6));

  const tomorrow: Event[] = [];
  const thisWeekend: Event[] = [];
  const comingUp: Event[] = [];

  events.forEach((e) => {
    const d = new Date(e.startAt);
    if (isAfter(d, tomorrowStart) && isBefore(d, tomorrowEnd)) {
      tomorrow.push(e);
    } else if (isAfter(d, tomorrowEnd) && isBefore(d, weekendEnd)) {
      thisWeekend.push(e);
    } else {
      comingUp.push(e);
    }
  });

  return { tomorrow, thisWeekend, comingUp };
}

function HorizontalSection({
  title,
  icon: Icon,
  iconColor,
  events,
  href,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  events: Event[];
  href: string;
}) {
  if (events.length === 0) return null;
  return (
    <div className="nc-slide-up-2">
      <div className="flex items-center justify-between px-4 md:px-6 mb-4">
        <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </h3>
        <Link href={href} className="flex items-center gap-1 text-xs font-extrabold text-primary hover:text-secondary transition-colors">
          See all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto nc-hide-scrollbar px-4 md:px-6 pb-6 snap-x snap-mandatory">
        {events.map((event) => (
          <CompactEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default function Feed() {
  const { user } = useAuthStore();

  const { data: events, isLoading: loadingEvents } = useGetFeed(
    {},
    { query: { queryKey: getGetFeedQueryKey({}) } }
  );

  const { data: stats, isLoading: loadingStats } = useGetEventStats({
    query: { queryKey: getGetEventStatsQueryKey() },
  });

  const { data: sosRequests } = useListSosRequests({
    query: { queryKey: getListSosRequestsQueryKey() },
  });

  const { data: notices } = useListNotices(
    {},
    { query: { queryKey: getListNoticesQueryKey({}) } }
  );

  const activeSOS = sosRequests?.find((r) => r.status === "open");
  const recentNotices = notices?.slice(0, 2) || [];
  const { tomorrow, thisWeekend, comingUp } = groupEvents(events || []);

  const noticeAccentColors = ["border-secondary/30", "border-primary/30"];
  const noticeBadgeColors = [
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-primary/10", text: "text-primary" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-red-100", text: "text-red-700" },
  ];

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-background">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 md:px-6 pt-10 md:pt-4 pb-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-2xl">
                <Sun className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-primary tracking-widest uppercase mb-0.5">NearConnect</span>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-extrabold text-foreground tracking-tight leading-tight">
                    {getGreeting(user?.name)}
                  </h1>
                  <span className="text-lg nc-float">👋🏽</span>
                </div>
              </div>
            </div>
            <Link href="/profile">
              <button className="relative p-2.5 bg-white rounded-2xl nc-warm-shadow cursor-pointer hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
              </button>
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto w-full pb-8 space-y-6">
          {/* Hero Card */}
          <div className="px-4 md:px-6 pt-4 nc-slide-up">
            <div
              className="bg-gradient-to-br from-[#E8632A] to-[#F59E0B] rounded-[28px] p-7 text-white relative overflow-hidden"
              style={{ boxShadow: "0 12px 40px rgba(232,99,42,0.30)" }}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />

              <h2 className="text-[26px] font-extrabold leading-tight mb-2 relative z-10 tracking-tight">
                Your neighborhood<br />is alive!
              </h2>
              <p className="text-white/90 text-sm font-medium mb-6 relative z-10 max-w-[220px]">
                {loadingStats
                  ? "Checking what's happening nearby..."
                  : `${stats?.upcomingEvents ?? 0} events happening around you`}
              </p>

              <div className="flex gap-3 overflow-x-auto nc-hide-scrollbar relative z-10 pb-1">
                <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-white/20 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span className="text-[11px] font-extrabold text-white tracking-wide">
                    {stats?.upcomingEvents ?? "…"} events
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-white/20 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-white" />
                  <span className="text-[11px] font-extrabold text-white tracking-wide">
                    {stats?.totalUsers ?? "…"} neighbors
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-white/20 shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-white" />
                  <span className="text-[11px] font-extrabold text-white tracking-wide">
                    {stats?.activeToday ?? "…"} active now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SOS Strip */}
          {activeSOS && (
            <div className="px-4 md:px-6 nc-slide-up-1">
              <div
                className="bg-gradient-to-r from-red-500 to-[#E8632A] rounded-2xl p-4 flex items-center justify-between text-white relative overflow-hidden cursor-pointer hover:from-red-600 transition-all"
                style={{ boxShadow: "0 8px 24px rgba(239,68,68,0.25)" }}
                onClick={() => window.location.href = `/sos/${activeSOS.id}`}
              >
                <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-white/20 p-2.5 rounded-full nc-pulse-soft">
                    <AlertCircle className="w-5 h-5 text-white fill-white/20" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight">{activeSOS.title}</h3>
                    <p className="text-xs text-white/90 font-medium mt-0.5">
                      {activeSOS.location || "Nearby"} • Just now
                    </p>
                  </div>
                </div>
                <button
                  className="bg-white text-red-500 text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors shadow-sm active:scale-95 relative z-10"
                  onClick={e => { e.stopPropagation(); window.location.href = `/sos/${activeSOS.id}`; }}
                >
                  Respond
                </button>
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {loadingEvents && (
            <div className="px-4 md:px-6 space-y-4">
              <Skeleton className="h-6 w-48 rounded-xl" />
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-[220px] rounded-2xl shrink-0" />
                ))}
              </div>
            </div>
          )}

          {/* Happening Tomorrow */}
          <HorizontalSection
            title="Happening Tomorrow"
            icon={Calendar}
            iconColor="text-primary"
            events={tomorrow}
            href="/activities"
          />

          {/* Notice Board */}
          {recentNotices.length > 0 && (
            <div className="px-4 md:px-6 nc-slide-up-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-secondary" />
                  Notice Board
                </h3>
                <Link href="/notices" className="flex items-center gap-1 text-xs font-extrabold text-primary hover:text-secondary transition-colors">
                  See all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentNotices.map((notice, i) => {
                  const badgeColor = noticeBadgeColors[i % noticeBadgeColors.length];
                  const borderColor = noticeAccentColors[i % noticeAccentColors.length];
                  return (
                    <Link key={notice.id} href="/notices">
                      <div
                        className={`bg-white p-5 rounded-2xl border ${borderColor} relative overflow-hidden group hover:shadow-md transition-all cursor-pointer`}
                        style={{ boxShadow: "0 4px 16px rgba(232,99,42,0.08)" }}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/8 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
                        <span className={`inline-block px-2.5 py-1 ${badgeColor.bg} ${badgeColor.text} text-[10px] font-extrabold rounded-lg uppercase tracking-wider mb-3`}>
                          {notice.category?.replace("_", " ") || "Notice"}
                        </span>
                        <h4 className="font-extrabold text-foreground text-sm mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                          {notice.title}
                        </h4>
                        <p className="text-xs text-foreground/60 font-medium leading-relaxed line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* This Weekend */}
          <HorizontalSection
            title="This Weekend"
            icon={Calendar}
            iconColor="text-secondary"
            events={thisWeekend}
            href="/activities"
          />

          {/* Near You / Coming Up */}
          <HorizontalSection
            title="Near You"
            icon={MapPin}
            iconColor="text-primary"
            events={comingUp}
            href="/activities"
          />

          {/* Fallback: all events grid if no sections have events */}
          {!loadingEvents && tomorrow.length === 0 && thisWeekend.length === 0 && comingUp.length === 0 && events && events.length > 0 && (
            <div className="px-4 md:px-6 nc-slide-up-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  All Events
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loadingEvents && (!events || events.length === 0) && (
            <div className="px-4 md:px-6 nc-slide-up-2">
              <div className="text-center py-16 border-2 border-dashed border-primary/20 rounded-3xl bg-white">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-extrabold text-lg mb-1">It's quiet here...</h3>
                <p className="text-foreground/60 text-sm max-w-xs mx-auto mb-6">
                  No events yet in your area. Be the first to host something!
                </p>
                <Link href="/events/new">
                  <button className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    Host an Event
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Create Event prompt */}
          {!loadingEvents && events && events.length > 0 && (
            <div className="px-4 md:px-6 pb-4 nc-slide-up-4">
              <div
                className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary/10"
                style={{ boxShadow: "0 4px 16px rgba(232,99,42,0.08)" }}
              >
                <div>
                  <h3 className="font-extrabold text-base text-foreground">Got something planned?</h3>
                  <p className="text-sm text-foreground/60">Host a walk, game, or meetup for your neighbors.</p>
                </div>
                <Link href="/events/new">
                  <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shrink-0">
                    <Plus className="w-4 h-4" />
                    Create Event
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile FAB */}
        <div className="md:hidden fixed bottom-20 right-4 z-40">
          <Link href="/events/new">
            <button
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center nc-glow"
              style={{ boxShadow: "0 8px 24px rgba(232,99,42,0.40)" }}
            >
              <Plus className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

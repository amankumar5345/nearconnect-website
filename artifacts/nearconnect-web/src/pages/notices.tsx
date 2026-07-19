import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Megaphone, Plus, Search, AlertTriangle } from "lucide-react";
import { useListNotices, ListNoticesCategory, getListNoticesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { format } from "date-fns";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "lost_found", label: "Lost & Found", bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-400" },
  { id: "announcement", label: "Announcements", bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-400" },
  { id: "help_wanted", label: "Help Wanted", bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-400" },
  { id: "urgent", label: "Urgent", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
];

export default function Notices() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const params = selectedCategory === "all" ? {} : { category: selectedCategory as ListNoticesCategory };

  const { data: notices, isLoading } = useListNotices(
    params,
    { query: { queryKey: getListNoticesQueryKey(params) } }
  );

  const filtered = notices?.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Layout>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 md:px-6 pt-10 md:pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/15 p-2.5 rounded-2xl">
              <Megaphone className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-foreground">Notice Board</h1>
              <p className="text-xs text-foreground/50 font-medium">Community updates & news</p>
            </div>
          </div>
          <Link href="/notices/new">
            <button
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
              style={{ boxShadow: "0 4px 12px rgba(232,99,42,0.25)" }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Post Notice</span>
            </button>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 space-y-5">

          {/* Search */}
          <div className="relative nc-slide-up">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl border border-border text-sm font-medium text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
              style={{ boxShadow: "0 4px 16px rgba(232,99,42,0.06)" }}
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto nc-hide-scrollbar pb-1 nc-slide-up-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-foreground/60 border-border hover:border-primary/30 hover:text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-border" />
              ))}
            </div>
          )}

          {/* Notices masonry */}
          {!isLoading && filtered.length > 0 && (
            <div className="columns-1 sm:columns-2 gap-4 space-y-4 nc-slide-up-2">
              {filtered.map((notice) => {
                const isUrgent = notice.category === "urgent";
                const catConfig = CATEGORIES.find(c => c.id === notice.category);

                return (
                  <div
                    key={notice.id}
                    className="break-inside-avoid bg-white rounded-2xl p-5 mb-4 border border-primary/8 hover:border-primary/20 transition-all cursor-default"
                    style={{ boxShadow: "0 4px 16px rgba(232,99,42,0.08)" }}
                  >
                    {/* Category + Date */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${catConfig?.bg || "bg-muted"} ${catConfig?.text || "text-foreground/70"}`}>
                        {isUrgent && <AlertTriangle className="w-3 h-3" />}
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">
                          {catConfig?.label || notice.category?.replace("_", " ") || "Notice"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-foreground/40">
                        {format(new Date(notice.createdAt), "MMM d")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-base text-foreground mb-2 leading-snug">{notice.title}</h3>

                    {/* Content */}
                    <p className="text-sm text-foreground/60 font-medium leading-relaxed whitespace-pre-wrap mb-4 line-clamp-4">
                      {notice.content}
                    </p>

                    {/* Image */}
                    {notice.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-4 bg-muted">
                        <img src={notice.imageUrl} alt="Notice" className="w-full h-auto max-h-48 object-cover" />
                      </div>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-extrabold">
                        {notice.author?.name?.[0] || "A"}
                      </div>
                      <span className="text-xs font-bold text-foreground/60">{notice.author?.name || "Anonymous"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-primary/20 rounded-3xl bg-white nc-slide-up-2">
              <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-extrabold text-lg mb-1">Nothing here yet</h3>
              <p className="text-foreground/50 text-sm max-w-xs mx-auto mb-6">The board is empty. Be the first to post a notice!</p>
              <Link href="/notices/new">
                <button className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                  Post a Notice
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

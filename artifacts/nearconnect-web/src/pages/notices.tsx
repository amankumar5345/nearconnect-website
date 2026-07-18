import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Megaphone, Plus, Search, Tag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useListNotices, ListNoticesCategory, getListNoticesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { format } from "date-fns";

const CATEGORIES = [
  { id: "all", label: "All Notices" },
  { id: "lost_found", label: "Lost & Found", color: "bg-yellow-100 text-yellow-800" },
  { id: "announcement", label: "Announcements", color: "bg-blue-100 text-blue-800" },
  { id: "help_wanted", label: "Help Wanted", color: "bg-green-100 text-green-800" },
  { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

export default function Notices() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const params = selectedCategory === "all" ? {} : { category: selectedCategory as ListNoticesCategory };
  
  const { data: notices, isLoading } = useListNotices(
    params,
    { query: { queryKey: getListNoticesQueryKey(params) } }
  );

  return (
    <Layout>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Notice Board</h1>
            <p className="text-sm text-muted-foreground">Community updates and news</p>
          </div>
          <Button className="rounded-full shadow-sm" asChild>
            <Link href="/notices/new">
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Post Notice</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-muted/10">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search notices..." 
                className="pl-10 rounded-xl h-12 bg-white"
              />
            </div>
            <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === cat.id 
                      ? "bg-foreground text-background border-foreground" 
                      : "bg-white text-muted-foreground hover:bg-muted border-border"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white border border-border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : notices && notices.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {notices.map(notice => {
                const isUrgent = notice.category === 'urgent';
                const catConfig = CATEGORIES.find(c => c.id === notice.category) || CATEGORIES[1];
                
                return (
                  <Card key={notice.id} className={`break-inside-avoid overflow-hidden border-border hover-elevate transition-all ${isUrgent ? 'border-red-200 shadow-sm shadow-red-100' : ''}`}>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="secondary" className={`border-none ${catConfig.color}`}>
                          {isUrgent && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {catConfig.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(notice.createdAt), "MMM d")}</span>
                      </div>
                      
                      <h3 className="font-display font-bold text-lg mb-2">{notice.title}</h3>
                      <p className="text-muted-foreground text-sm whitespace-pre-wrap mb-4">{notice.content}</p>
                      
                      {notice.imageUrl && (
                        <div className="rounded-xl overflow-hidden mb-4 mt-2 bg-muted">
                          <img src={notice.imageUrl} alt="Notice attachment" className="w-full h-auto object-cover max-h-48" />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {notice.author?.name?.[0] || 'A'}
                        </div>
                        <span className="text-xs font-medium text-foreground">{notice.author?.name || 'Anonymous'}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-white">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg">No notices found</h3>
              <p className="text-muted-foreground mb-4">The board is clear. Be the first to post!</p>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/notices/new">Post a Notice</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

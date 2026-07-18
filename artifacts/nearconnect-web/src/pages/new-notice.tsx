import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNotice, NoticeInputCategory } from "@workspace/api-client-react";
import { useState } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function NewNotice() {
  const [, setLocation] = useLocation();
  const createMutation = useCreateNotice();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: NoticeInputCategory.general,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please provide a title and content");
      return;
    }

    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast.success("Notice posted successfully");
        setLocation("/notices");
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to post notice");
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-[100dvh] md:h-screen bg-background">
        <header className="shrink-0 h-16 border-b border-border flex items-center px-4 bg-card">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
            <Link href="/notices">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-display font-semibold text-lg">Post Notice</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 rounded-3xl">
              
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: NoticeInputCategory.general, label: "General" },
                    { id: NoticeInputCategory.lost_found, label: "Lost & Found" },
                    { id: NoticeInputCategory.announcement, label: "Announcement" },
                    { id: NoticeInputCategory.urgent, label: "Urgent" },
                  ].map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`text-center py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
                        formData.category === cat.id 
                          ? cat.id === 'urgent' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-primary/10 border-primary text-primary' 
                          : 'bg-background border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>

              {formData.category === NoticeInputCategory.urgent && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-3 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>Urgent notices are highlighted and pinned for 24 hours. For emergencies, please use the SOS feature instead.</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Headline *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Found Keys at Joggers Park"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Details *</Label>
                <Textarea 
                  id="content" 
                  placeholder="Provide all necessary details..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="min-h-[150px] rounded-xl resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-medium mt-4"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Posting..." : "Post to Board"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

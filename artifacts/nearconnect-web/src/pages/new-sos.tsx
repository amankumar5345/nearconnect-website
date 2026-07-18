import { useState } from "react";
import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSosRequest } from "@workspace/api-client-react";
import { ArrowLeft, ShieldAlert, MapPin, Info } from "lucide-react";
import { toast } from "sonner";

export default function NewSOS() {
  const [, setLocation] = useLocation();
  const createMutation = useCreateSosRequest();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please provide an alert title and description");
      return;
    }

    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast.success("SOS Alert Broadcasted!");
        setLocation("/sos");
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to broadcast SOS");
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-[100dvh] md:h-screen bg-background">
        <header className="shrink-0 h-16 border-b border-red-200 flex items-center px-4 bg-red-50 text-red-900">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full text-red-900 hover:bg-red-100" asChild>
            <Link href="/sos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-display font-semibold text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> Raise SOS Alert
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-red-50/30">
          <div className="max-w-2xl mx-auto">
            
            <div className="bg-red-100 text-red-800 p-5 rounded-2xl mb-8 flex gap-3 shadow-sm border border-red-200">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold mb-1">Use for emergencies only</p>
                <p>This will send an immediate notification to all neighbors within a 2km radius. For non-urgent matters, use the Notice Board.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-red-100 p-6 sm:p-8 rounded-3xl shadow-sm">
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-red-900 font-bold">What is the emergency? *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Medical emergency, Need blood donor O+"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="h-14 rounded-xl border-red-200 focus-visible:ring-red-500 bg-red-50/50 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-red-900 font-bold">Exact Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 h-5 w-5 text-red-400" />
                  <Input 
                    id="location" 
                    placeholder="Building name, street, landmarks..."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="h-14 pl-10 rounded-xl border-red-200 focus-visible:ring-red-500 bg-red-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-red-900 font-bold">Additional Details *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide any details that would help neighbors respond quickly..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[150px] rounded-xl resize-none border-red-200 focus-visible:ring-red-500 bg-red-50/50"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-2xl text-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25 transition-all"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Broadcasting..." : "Broadcast SOS Alert"}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 font-medium">
                  By clicking this, I confirm this is a genuine community emergency.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

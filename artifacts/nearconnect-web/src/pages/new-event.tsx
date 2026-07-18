import { useState } from "react";
import { Layout } from "@/components/layout";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent, EventInputType } from "@workspace/api-client-react";
import { ArrowLeft, Calendar, MapPin, Users, Trophy } from "lucide-react";
import { toast } from "sonner";
import { format, addHours } from "date-fns";

export default function NewEventForm() {
  const [, params] = useRoute("/events/new/:type");
  const [, setLocation] = useLocation();
  const typeStr = params?.type || "other";
  
  // Cast the URL param to our EventInputType, default to 'other' if invalid
  const eventType: EventInputType = Object.values(EventInputType).includes(typeStr as any) 
    ? (typeStr as EventInputType) 
    : EventInputType.other;
    
  const isTournament = eventType === 'tournament';
  
  const createEventMutation = useCreateEvent();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    maxParticipants: "",
    entryFee: "",
    prize: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      toast.error("Please fill in the required fields");
      return;
    }
    
    // Create ISO string for startAt
    const startAt = new Date(`${formData.date}T${formData.time}`).toISOString();
    // Default end time is 2 hours later
    const endAt = addHours(new Date(startAt), 2).toISOString();
    
    createEventMutation.mutate({
      data: {
        title: formData.title,
        description: formData.description || null,
        type: eventType,
        location: formData.location || null,
        startAt,
        endAt,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        entryFee: formData.entryFee ? parseInt(formData.entryFee) : null,
        isTournament,
        prize: formData.prize || null,
        // Mock default lat/lng for Bandra, Mumbai area
        lat: 19.0596,
        lng: 72.8295,
      }
    }, {
      onSuccess: (data) => {
        toast.success("Event created successfully!");
        setLocation(`/events/${data.id}`);
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to create event");
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-[100dvh] md:h-screen bg-background">
        <header className="shrink-0 h-16 border-b border-border flex items-center px-4 bg-card z-10">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
            <Link href="/events/new">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="font-display font-semibold text-lg leading-tight">Create {eventType.replace('_', ' ')}</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-6 rounded-3xl">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-display font-bold mb-4">Basic Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">Event Title *</Label>
                      <Input 
                        id="title" 
                        placeholder={isTournament ? "e.g. Weekend BGMI Custom Room" : "e.g. Morning Jog at Carter Road"}
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Tell your neighbors what to expect..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="min-h-[100px] rounded-xl resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              {/* Time & Place */}
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold mb-4">When & Where</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="date" 
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="h-12 pl-10 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input 
                      id="time" 
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location / Venue</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder={isTournament ? "e.g. Discord server link or local cafe" : "e.g. Joggers Park Gate 1"}
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="h-12 pl-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              {/* Logistics */}
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold mb-4">Logistics</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="maxParticipants" 
                        type="number"
                        placeholder="Leave empty for unlimited"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                        className="h-12 pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground font-medium">₹</span>
                      <Input 
                        id="entryFee" 
                        type="number"
                        placeholder="0 for free"
                        value={formData.entryFee}
                        onChange={(e) => setFormData({...formData, entryFee: e.target.value})}
                        className="h-12 pl-9 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {isTournament && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-border border-dashed">
                    <Label htmlFor="prize">Tournament Prize</Label>
                    <div className="relative">
                      <Trophy className="absolute left-3 top-3 h-5 w-5 text-yellow-500" />
                      <Input 
                        id="prize" 
                        placeholder="e.g. ₹1000 pool or 'Bragging rights'"
                        value={formData.prize}
                        onChange={(e) => setFormData({...formData, prize: e.target.value})}
                        className="h-12 pl-10 rounded-xl bg-yellow-50/50 border-yellow-200 focus-visible:ring-yellow-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-md hover:-translate-y-1 transition-transform duration-200"
                disabled={createEventMutation.isPending}
              >
                {createEventMutation.isPending ? "Creating..." : "Host Event"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

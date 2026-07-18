import { useState } from "react";
import { Layout } from "@/components/layout";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetEvent, useRegisterForEvent, getGetEventQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, CheckCircle2, Users, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function EventRegistration() {
  const [, params] = useRoute("/events/:eventId/register");
  const eventId = Number(params?.eventId);
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: "",
    teamSize: "1",
    notes: ""
  });

  const { data: event, isLoading } = useGetEvent(eventId, {
    query: { enabled: !!eventId, queryKey: getGetEventQueryKey(eventId) }
  });

  const registerMutation = useRegisterForEvent();

  const handleNext = () => setStep(2);

  const handleSubmit = () => {
    registerMutation.mutate({
      eventId,
      data: {
        teamName: formData.teamName || null,
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : 1,
        notes: formData.notes || null
      }
    }, {
      onSuccess: () => {
        setStep(3);
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to register");
      }
    });
  };

  if (isLoading || !event) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  const isTeamRegistration = event.isTournament || event.type === 'trip';

  return (
    <Layout>
      <div className="flex flex-col h-[100dvh] md:h-screen bg-background">
        <header className="shrink-0 h-16 border-b border-border flex items-center px-4 bg-card z-10">
          {step < 3 && (
            <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => step === 2 ? setStep(1) : window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="font-display font-semibold text-lg leading-tight">Register for Event</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-xl mx-auto">
            
            {step < 3 && (
              <div className="flex items-center mb-8 px-2 gap-2">
                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                  <Badge variant="secondary" className="bg-white border-none mb-3">Event Summary</Badge>
                  <h2 className="font-display font-bold text-2xl mb-2">{event.title}</h2>
                  {event.entryFee ? (
                    <div className="flex items-center gap-2 text-green-700 font-bold bg-green-100 px-3 py-1.5 rounded-lg inline-flex">
                      <Receipt className="w-4 h-4" /> Entry: ₹{event.entryFee}
                    </div>
                  ) : (
                    <div className="text-muted-foreground font-medium">Free Entry</div>
                  )}
                </div>

                <Card className="p-6 border-border">
                  <h3 className="font-display font-bold text-lg mb-4">Registration Details</h3>
                  <div className="space-y-4">
                    {isTeamRegistration && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="teamName">Team / Group Name (Optional)</Label>
                          <Input 
                            id="teamName" 
                            placeholder="e.g. The Invincibles"
                            value={formData.teamName}
                            onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teamSize">How many people?</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              id="teamSize" 
                              type="number"
                              min="1"
                              value={formData.teamSize}
                              onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                              className="h-12 pl-10 rounded-xl"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes to Host (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Any special requests or info..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="min-h-[100px] rounded-xl resize-none"
                      />
                    </div>
                  </div>
                </Card>

                <Button onClick={handleNext} className="w-full h-14 rounded-2xl text-lg font-bold">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <Card className="p-8 text-center border-border">
                  <h2 className="font-display font-bold text-2xl mb-6">Confirm Registration</h2>
                  
                  <div className="space-y-4 text-left bg-muted/50 p-6 rounded-2xl mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground">Event</p>
                      <p className="font-medium text-lg">{event.title}</p>
                    </div>
                    {isTeamRegistration && (
                      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Team</p>
                          <p className="font-medium">{formData.teamName || 'Solo'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Size</p>
                          <p className="font-medium">{formData.teamSize} people</p>
                        </div>
                      </div>
                    )}
                    {event.entryFee && (
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">Total Fee</p>
                        <p className="font-bold text-2xl text-green-600">₹{(event.entryFee * parseInt(formData.teamSize || '1'))}</p>
                        <p className="text-xs text-muted-foreground mt-1">To be paid directly to host</p>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    disabled={registerMutation.isPending}
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-md"
                  >
                    {registerMutation.isPending ? "Confirming..." : "Confirm Registration"}
                  </Button>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="font-display font-bold text-3xl mb-4">You're in!</h2>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto mb-8">
                  Your registration is confirmed. You've been added to the event group chat.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" className="h-12 rounded-xl px-8">
                    <Link href={`/events/${eventId}`}>View Event</Link>
                  </Button>
                  <Button asChild className="h-12 rounded-xl px-8">
                    <Link href="/chat">Open Chat</Link>
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}

// Ensure Badge is imported correctly since it's not at the top
import { Badge } from "@/components/ui/badge";

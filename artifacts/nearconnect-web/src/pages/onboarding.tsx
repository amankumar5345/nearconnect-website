import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUpdateMe, useGetMe } from "@workspace/api-client-react";
import { useAuthStore } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, User, Activity, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ATTRIBUTES = [
  { id: "morning_walker", label: "Morning Walker" },
  { id: "gamer", label: "Gamer" },
  { id: "gym_bro", label: "Gym Enthusiast" },
  { id: "foodie", label: "Foodie" },
  { id: "pet_lover", label: "Pet Lover" },
  { id: "traveler", label: "Traveler" },
  { id: "social_butterfly", label: "Social Butterfly" },
  { id: "sports", label: "Sports Fan" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuthStore();
  const updateMeMutation = useUpdateMe();
  const { data: me } = useGetMe({ query: { enabled: !!user } });
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: "",
    bio: "",
    attributes: [] as string[]
  });

  useEffect(() => {
    if (me) {
      setFormData({
        location: me.location || "",
        bio: me.bio || "",
        attributes: me.attributes || []
      });
    }
  }, [me]);

  const toggleAttribute = (id: string) => {
    setFormData(prev => {
      const attributes = prev.attributes.includes(id)
        ? prev.attributes.filter(a => a !== id)
        : [...prev.attributes, id];
      return { ...prev, attributes };
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.location) {
      toast.error("Please enter your location");
      return;
    }
    setStep(2);
  };

  const handleComplete = () => {
    updateMeMutation.mutate({ data: formData }, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        toast.success("Profile completed!");
        setLocation("/feed");
      },
      onError: (err: any) => {
        toast.error(err.error || "Failed to update profile");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex gap-2">
            <div className={cn("h-2 rounded-full w-12 transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
            <div className={cn("h-2 rounded-full w-12 transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Step {step} of 2</span>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h1 className="font-display font-bold text-2xl mb-2">Where are you based?</h1>
                <p className="text-muted-foreground">We use this to show you events in your neighborhood.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Neighborhood / Area</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="e.g. Bandra West, Mumbai"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell your neighbors a bit about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-[100px] rounded-xl resize-none"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                className="w-full h-12 rounded-xl text-base font-medium mt-8"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h1 className="font-display font-bold text-2xl mb-2">What are you into?</h1>
                <p className="text-muted-foreground">Select a few interests to personalize your feed.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {ATTRIBUTES.map((attr) => {
                  const isSelected = formData.attributes.includes(attr.id);
                  return (
                    <button
                      key={attr.id}
                      onClick={() => toggleAttribute(attr.id)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border text-left transition-all",
                        isSelected 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border hover:border-primary/50 text-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center border",
                        isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-medium text-sm">{attr.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleComplete} 
                  className="flex-[2] h-12 rounded-xl text-base font-medium"
                  disabled={updateMeMutation.isPending}
                >
                  {updateMeMutation.isPending ? "Saving..." : "Complete Profile"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

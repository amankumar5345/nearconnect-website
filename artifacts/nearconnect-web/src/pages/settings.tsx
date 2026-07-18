import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useAuthStore } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react";
import { useLogout } from "@workspace/api-client-react";

export default function Settings() {
  const { user, logout: clearLocalUser } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearLocalUser();
        window.location.href = "/";
      }
    });
  };

  return (
    <Layout>
      <div className="flex-1 bg-background flex flex-col h-full">
        <header className="shrink-0 h-16 border-b border-border flex items-center px-4 bg-card">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
            <Link href="/profile">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-display font-semibold text-lg">Settings</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Account
                </h2>
              </div>
              <div className="divide-y divide-border">
                <div className="p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer" onClick={() => window.location.href='/onboarding'}>
                  <div>
                    <p className="font-medium text-sm">Edit Profile</p>
                    <p className="text-xs text-muted-foreground mt-1">Change your name, location, and bio</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Email/Phone</p>
                    <p className="text-xs text-muted-foreground mt-1">Contact support to change</p>
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">{user?.name}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Notifications
                </h2>
              </div>
              <div className="divide-y divide-border">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Event Reminders</p>
                    <p className="text-xs text-muted-foreground mt-1">Get notified before events start</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">New Messages</p>
                    <p className="text-xs text-muted-foreground mt-1">Chat alerts and mentions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Emergency SOS</p>
                    <p className="text-xs text-muted-foreground mt-1">Alerts from neighbors</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Privacy
                </h2>
              </div>
              <div className="divide-y divide-border">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Show exact location</p>
                    <p className="text-xs text-muted-foreground mt-1">Only to confirmed attendees</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Profile visibility</p>
                    <p className="text-xs text-muted-foreground mt-1">Visible to all neighbors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Button 
              variant="destructive" 
              className="w-full h-12 rounded-xl"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground py-4">
              NearConnect v1.0.0
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

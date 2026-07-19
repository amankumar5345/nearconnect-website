import { Link, useLocation } from "wouter";
import { Home, MapPin, Heart, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/feed" },
    { icon: MapPin, label: "Map", href: "/map" },
    { icon: Heart, label: "Activities", href: "/activities" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex min-h-[100dvh] bg-background w-full">
      {/* Desktop Sidebar — warm community style */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 z-50 nc-warm-shadow">
        <div className="p-6 border-b border-border">
          <Link href="/feed" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E8632A] to-[#F59E0B] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold font-display text-lg leading-none">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-foreground leading-none">NearConnect</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Your neighborhood</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/50 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <item.icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive && item.href === "/feed" ? "currentColor" : "none"}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
          <p className="text-xs font-bold text-foreground/60 mb-2">Your area</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary nc-pulse-soft" />
            <span className="text-xs font-extrabold text-foreground">Koramangala, Bangalore</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-[100dvh] flex flex-col relative">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar — warm community style */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div
          className="w-full max-w-md pointer-events-auto bg-white/95 backdrop-blur-md border-t border-primary/10 rounded-t-3xl"
          style={{ boxShadow: "0 -8px 32px rgba(232, 99, 42, 0.12)" }}
        >
          <div className="flex justify-around items-center h-16 px-4 pb-1">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 transition-colors w-14",
                    isActive ? "text-primary" : "text-foreground/40 hover:text-primary"
                  )}
                >
                  <item.icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive && item.href === "/feed" ? "currentColor" : "none"}
                  />
                  <span className="text-[10px] font-extrabold tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

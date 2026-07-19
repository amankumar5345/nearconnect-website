import { Link } from "wouter";
import { MapPin, Users, HeartHandshake, ArrowRight, ShieldCheck, Gamepad2, Coffee, Sun, Bell } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-background/90 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-5xl mx-auto w-full h-full flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold font-display text-lg leading-none">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-foreground leading-none">NearConnect</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Your neighborhood</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/login">
              <button className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                Join Neighborhood
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative px-4 md:px-8 pt-12 pb-0 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            {/* Greeting pill */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm nc-slide-up border border-primary/20">
                <MapPin className="w-4 h-4" />
                <span>Your neighborhood's social layer</span>
              </div>
            </div>

            {/* Hero Card */}
            <div
              className="bg-gradient-to-br from-[#E8632A] to-[#F59E0B] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden nc-slide-up-1 mb-8"
              style={{ boxShadow: "0 24px 60px rgba(232,99,42,0.35)" }}
            >
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 p-2.5 rounded-2xl nc-float">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/80 font-bold text-sm">Find your people nearby</span>
                </div>

                <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
                  Your neighborhood<br />
                  <span className="text-white/90 underline decoration-white/30 decoration-4 underline-offset-4">is alive.</span>
                </h1>

                <p className="text-white/85 text-base md:text-lg font-medium mb-8 max-w-lg leading-relaxed">
                  Discover local events, join morning walks, host game nights, and connect with the community living just down the street.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/login">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full text-base font-extrabold hover:bg-white/90 transition-colors shadow-md">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/20 text-white px-7 py-3.5 rounded-full text-base font-extrabold hover:bg-white/30 transition-colors border border-white/30">
                      Explore Local Feed
                    </button>
                  </Link>
                </div>
              </div>

              {/* Floating stat pills */}
              <div className="relative z-10 flex flex-wrap gap-3 mt-8 pt-8 border-t border-white/20">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                  <Bell className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-extrabold text-white">127 events nearby</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                  <Users className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-extrabold text-white">3.2k neighbors</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-white nc-pulse-soft" />
                  <span className="text-xs font-extrabold text-white">24 active now</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center max-w-xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3 text-foreground">
                Everything happening nearby
              </h2>
              <p className="text-foreground/60 font-medium">
                From casual meetups to community support, NearConnect brings local life into focus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Coffee, title: "Morning Walks & Gym", desc: "Find your 6 AM accountability buddies nearby.", accent: "bg-emerald-100 text-emerald-700", border: "hover:border-emerald-200" },
                { icon: Gamepad2, title: "Games & Tournaments", desc: "Host a BGMI squad or a local chess match.", accent: "bg-purple-100 text-purple-700", border: "hover:border-purple-200" },
                { icon: Users, title: "Trips & Picnics", desc: "Fill those empty car seats for your weekend hike.", accent: "bg-blue-100 text-blue-700", border: "hover:border-blue-200" },
                { icon: ShieldCheck, title: "Notice Board", desc: "Lost pets, announcements, and local news.", accent: "bg-amber-100 text-amber-700", border: "hover:border-amber-200" },
                { icon: HeartHandshake, title: "Community SOS", desc: "Ask for urgent help from neighbors who can actually reach you.", accent: "bg-red-100 text-red-700", border: "hover:border-red-200" },
                { icon: MapPin, title: "Discover the Map", desc: "See every event, walk, and meetup pinned around you.", accent: "bg-primary/10 text-primary", border: "hover:border-primary/30" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl bg-white border border-border ${feature.border} transition-all cursor-default group`}
                  style={{ boxShadow: "0 4px 16px rgba(232,99,42,0.06)" }}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${feature.accent} group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="bg-gradient-to-br from-[#E8632A] to-[#F59E0B] rounded-3xl p-10 text-white relative overflow-hidden"
              style={{ boxShadow: "0 20px 60px rgba(232,99,42,0.30)" }}
            >
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 nc-float">
                  <Sun className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-display text-3xl font-extrabold mb-3">
                  Ready to meet your neighbors?
                </h2>
                <p className="text-white/85 mb-8 font-medium">
                  Join thousands of people building real community around them.
                </p>
                <Link href="/login">
                  <button className="bg-white text-primary px-8 py-3.5 rounded-full text-base font-extrabold hover:bg-white/90 transition-colors shadow-md">
                    Join the Neighborhood →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t border-border bg-white text-center text-foreground/50 px-4">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold font-display text-sm leading-none">N</span>
          </div>
          <span className="font-display font-extrabold text-base text-foreground">NearConnect</span>
        </div>
        <p className="text-sm font-medium">© 2024 NearConnect · Connecting neighborhoods</p>
      </footer>
    </div>
  );
}

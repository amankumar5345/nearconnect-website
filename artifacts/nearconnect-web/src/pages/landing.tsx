import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Users, HeartHandshake, ArrowRight, ShieldCheck, Gamepad2, Coffee } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fcfaf8] flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-[#fcfaf8]/80 backdrop-blur-md z-50 border-b border-border flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold font-display text-xl leading-none">N</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">NearConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Button className="rounded-full font-medium" asChild>
              <Link href="/login">Join Neighborhood</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative px-4 md:px-8 pt-20 pb-24 md:pt-32 md:pb-40 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px]" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-primary font-medium text-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <MapPin className="w-4 h-4" />
              <span>Your neighborhood's social layer</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6 animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              Find your people.<br />
              <span className="text-primary">Right around the corner.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in slide-in-from-bottom-6 fade-in duration-700 delay-200">
              Discover local events, join morning walks, host game nights, and connect with the community living just down the street. Make your city feel like home.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
              <Button size="lg" className="rounded-full text-base h-14 px-8 w-full sm:w-auto" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base h-14 px-8 w-full sm:w-auto border-border bg-white text-foreground hover:bg-muted" asChild>
                <Link href="/login">Explore Local Feed</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Everything happening nearby</h2>
              <p className="text-muted-foreground">From casual meetups to community support, NearConnect brings local life into focus.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Coffee, title: "Morning Walks & Gym", desc: "Find your 6 AM accountability buddies.", color: "bg-green-100 text-green-600" },
                { icon: Gamepad2, title: "Games & Tournaments", desc: "Host a BGMI squad or a local chess match.", color: "bg-purple-100 text-purple-600" },
                { icon: Users, title: "Trips & Picnics", desc: "Fill those empty car seats for your weekend hike.", color: "bg-blue-100 text-blue-600" },
                { icon: ShieldCheck, title: "Notice Board", desc: "Lost pets, announcements, and local news.", color: "bg-yellow-100 text-yellow-600" },
                { icon: HeartHandshake, title: "Community SOS", desc: "Ask for urgent help from neighbors who can actually reach you.", color: "bg-red-100 text-red-600" },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-[#fcfaf8] border border-border flex flex-col items-start hover:border-primary/30 transition-colors">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 border-t border-border bg-white text-center text-muted-foreground px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold font-display text-sm leading-none">N</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground">NearConnect</span>
        </div>
        <p>© 2024 NearConnect. Connecting neighborhoods.</p>
      </footer>
    </div>
  );
}

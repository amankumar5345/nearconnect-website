import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListEvents, ListEventsType, getListEventsQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/event-card";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const EVENT_TYPES = [
  { id: "all", label: "All" },
  { id: "morning_walk", label: "Morning Walks" },
  { id: "gym", label: "Gym Sessions" },
  { id: "tournament", label: "Tournaments" },
  { id: "trip", label: "Trips" },
  { id: "picnic", label: "Picnics" },
  { id: "social", label: "Social" },
  { id: "sos", label: "SOS" }
];

export default function Activities() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const params = selectedType === "all" ? {} : { type: selectedType as ListEventsType };
  
  const { data: events, isLoading } = useListEvents(
    params,
    { query: { queryKey: getListEventsQueryKey(params) } }
  );

  const filteredEvents = events?.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border pt-4 pb-2 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display font-bold text-2xl mb-4">Activities & Events</h1>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                className="pl-10 rounded-xl h-12 bg-muted border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {EVENT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type.id 
                      ? "bg-foreground text-background" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredEvents && filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try a different search term." : "There are no events of this type nearby."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

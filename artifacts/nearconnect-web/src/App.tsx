import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Onboarding from '@/pages/onboarding';
import Feed from '@/pages/feed';
import MapView from '@/pages/map';
import Activities from '@/pages/activities';
import Games from '@/pages/games';
import Trips from '@/pages/trips';
import Notices from '@/pages/notices';
import SOS from '@/pages/sos';
import Chat from '@/pages/chat';
import ChatRoom from '@/pages/chat-room';
import Profile from '@/pages/profile';
import UserProfile from '@/pages/user-profile';
import Settings from '@/pages/settings';
import EventDetail from '@/pages/event-detail';
import NewEventType from '@/pages/new-event-type';
import NewEventForm from '@/pages/new-event';
import EventRegistration from '@/pages/event-registration';
import NewNotice from '@/pages/new-notice';
import NewSOS from '@/pages/new-sos';
import SOSDetail from '@/pages/sos-detail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      
      {/* Main app routes */}
      <Route path="/feed" component={Feed} />
      <Route path="/map" component={MapView} />
      <Route path="/activities" component={Activities} />
      <Route path="/games" component={Games} />
      <Route path="/trips" component={Trips} />
      <Route path="/notices" component={Notices} />
      <Route path="/sos" component={SOS} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:roomId" component={ChatRoom} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/:userId" component={UserProfile} />
      <Route path="/settings" component={Settings} />
      
      {/* Actions */}
      <Route path="/events/new" component={NewEventType} />
      <Route path="/events/new/:type" component={NewEventForm} />
      <Route path="/events/:eventId" component={EventDetail} />
      <Route path="/events/:eventId/register" component={EventRegistration} />
      
      <Route path="/notices/new" component={NewNotice} />
      <Route path="/sos/new" component={NewSOS} />
      <Route path="/sos/:id" component={SOSDetail} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider />
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

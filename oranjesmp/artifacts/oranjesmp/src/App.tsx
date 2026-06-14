import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Ranks from "@/pages/ranks";
import Shop from "@/pages/shop";
import Contact from "@/pages/contact";
import OverOns from "@/pages/over-ons";
import Nieuws from "@/pages/nieuws";
import NieuwsDetail from "@/pages/nieuws-detail";

// Admin
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminRanks from "@/pages/admin/ranks";
import AdminNieuws from "@/pages/admin/nieuws";
import AdminShop from "@/pages/admin/shop";
import AdminBetalingen from "@/pages/admin/betalingen";
import AdminInstellingen from "@/pages/admin/instellingen";
import AdminTeam from "@/pages/admin/team";
import AdminGebruikers from "@/pages/admin/gebruikers";

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
      <Route path="/" component={Home} />
      <Route path="/over-ons" component={OverOns} />
      <Route path="/ranks" component={Ranks} />
      <Route path="/shop" component={Shop} />
      <Route path="/contact" component={Contact} />
      <Route path="/nieuws" component={Nieuws} />
      <Route path="/nieuws/:id" component={NieuwsDetail} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/ranks" component={AdminRanks} />
      <Route path="/admin/nieuws" component={AdminNieuws} />
      <Route path="/admin/shop" component={AdminShop} />
      <Route path="/admin/betalingen" component={AdminBetalingen} />
      <Route path="/admin/instellingen" component={AdminInstellingen} />
      <Route path="/admin/team" component={AdminTeam} />
      <Route path="/admin/gebruikers" component={AdminGebruikers} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

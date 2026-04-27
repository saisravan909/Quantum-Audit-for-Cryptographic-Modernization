import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import CommandCenter from "@/pages/command-center";
import NodeInventory from "@/pages/node-inventory";
import NodeDetail from "@/pages/node-detail";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import CbomExplorer from "@/pages/cbom-explorer";
import AlertsCenter from "@/pages/alerts-center";
import TelemetryFeed from "@/pages/telemetry-feed";
import LandingPage from "@/pages/landing";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={CommandCenter} />
        <Route path="/about" component={LandingPage} />
        <Route path="/nodes" component={NodeInventory} />
        <Route path="/nodes/:id" component={NodeDetail} />
        <Route path="/compliance" component={ComplianceDashboard} />
        <Route path="/cbom" component={CbomExplorer} />
        <Route path="/alerts" component={AlertsCenter} />
        <Route path="/telemetry" component={TelemetryFeed} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
  }, []);

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

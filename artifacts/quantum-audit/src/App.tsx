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
import InnovatorPage from "@/pages/innovator";
import RegulatoryPage from "@/pages/regulatory";
import DemoPage from "@/pages/demo";
import IndustriesPage from "@/pages/industries";
import CyberIntelPage from "@/pages/cyber-intel";
import RoadmapPage from "@/pages/roadmap";
import PipelineDiagram from "@/pages/pipeline-diagram";
import HandshakeInspector from "@/pages/handshake-inspector";
import RiskScorecard from "@/pages/risk-scorecard";
import ThreatClock from "@/pages/threat-clock";
import ConfigBuilder from "@/pages/config-builder";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={CommandCenter} />
        <Route path="/about" component={LandingPage} />
        <Route path="/innovator" component={InnovatorPage} />
        <Route path="/regulatory" component={RegulatoryPage} />
        <Route path="/demo" component={DemoPage} />
        <Route path="/industries" component={IndustriesPage} />
        <Route path="/cyber-intel" component={CyberIntelPage} />
        <Route path="/roadmap" component={RoadmapPage} />
        <Route path="/nodes" component={NodeInventory} />
        <Route path="/nodes/:id" component={NodeDetail} />
        <Route path="/compliance" component={ComplianceDashboard} />
        <Route path="/cbom" component={CbomExplorer} />
        <Route path="/alerts" component={AlertsCenter} />
        <Route path="/telemetry" component={TelemetryFeed} />
        <Route path="/pipeline" component={PipelineDiagram} />
        <Route path="/handshake" component={HandshakeInspector} />
        <Route path="/risk-map" component={RiskScorecard} />
        <Route path="/threat-clock" component={ThreatClock} />
        <Route path="/config-builder" component={ConfigBuilder} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  useEffect(() => {
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

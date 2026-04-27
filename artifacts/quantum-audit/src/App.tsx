import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";
import { ClerkProvider, useClerk } from "@clerk/react";
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
import Assessment from "@/pages/assessment";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import { ClickGateProvider } from "@/contexts/click-gate-context";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#007aae",
    colorForeground: "#1c1c1e",
    colorMutedForeground: "#6e6e73",
    colorDanger: "#d92c2c",
    colorBackground: "#ffffff",
    colorInput: "#f5f5f7",
    colorInputForeground: "#1c1c1e",
    colorNeutral: "#d2d2d7",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-[440px] max-w-full overflow-hidden rounded-2xl shadow-xl border border-[#d2d2d7]",
    card: "!shadow-none !border-0 !bg-white !rounded-none",
    footer: "!shadow-none !border-0 !bg-[#f5f5f7] !rounded-none",
    headerTitle: "text-[#1c1c1e] font-semibold text-xl",
    headerSubtitle: "text-[#6e6e73]",
    socialButtonsBlockButton: "border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7] text-[#1c1c1e] shadow-sm",
    socialButtonsBlockButtonText: "text-[#1c1c1e] font-medium",
    formFieldLabel: "text-[#1c1c1e] text-sm font-medium",
    formFieldInput: "bg-[#f5f5f7] border border-[#d2d2d7] text-[#1c1c1e] focus:border-[#007aae]",
    formButtonPrimary: "bg-[#007aae] text-white hover:bg-[#006090] font-medium shadow-sm",
    footerActionLink: "text-[#007aae] hover:text-[#005f8a] font-medium",
    footerActionText: "text-[#6e6e73]",
    dividerText: "text-[#6e6e73] text-xs",
    dividerLine: "bg-[#d2d2d7]",
    identityPreviewEditButton: "text-[#007aae]",
    formFieldSuccessText: "text-[#007aae]",
    alertText: "text-[#1c1c1e]",
    alert: "border border-[#d2d2d7] bg-[#f5f5f7]",
    logoBox: "justify-center",
    logoImage: "h-10 w-10",
    otpCodeFieldInput: "bg-[#f5f5f7] border-[#d2d2d7] text-[#1c1c1e]",
    formFieldRow: "gap-3",
    main: "gap-5",
    footerAction: "bg-[#f5f5f7]",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
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
        <Route path="/assessment" component={Assessment} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back to QVault",
            subtitle: "Sign in to your cryptographic governance dashboard",
          },
        },
        signUp: {
          start: {
            title: "Join QVault",
            subtitle: "Create your account to access all PQC compliance tools",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <ClickGateProvider>
            <Router />
          </ClickGateProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

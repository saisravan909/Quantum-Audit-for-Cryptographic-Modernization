import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";
import { ClerkProvider, useClerk } from "@clerk/react";
import { dark } from "@clerk/themes";
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
  baseTheme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#00ccff",
    colorForeground: "#eef3fc",
    colorMutedForeground: "#7a99b8",
    colorDanger: "#ff4d4d",
    colorBackground: "#0b1323",
    colorInput: "#162030",
    colorInputForeground: "#eef3fc",
    colorNeutral: "#1c2d42",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-[440px] max-w-full overflow-hidden rounded-xl border border-[#1c2d42]",
    card: "!shadow-none !border-0 !bg-[#0f1a29] !rounded-none",
    footer: "!shadow-none !border-0 !bg-[#0b1323] !rounded-none",
    headerTitle: "text-[#eef3fc] font-semibold",
    headerSubtitle: "text-[#7a99b8]",
    socialButtonsBlockButtonText: "text-[#eef3fc]",
    socialButtonsBlockButton: "border-[#1c2d42] hover:bg-[#162030]",
    formFieldLabel: "text-[#7a99b8] text-sm",
    formFieldInput: "bg-[#162030] border-[#1c2d42] text-[#eef3fc]",
    formButtonPrimary: "bg-[#00ccff] text-black hover:bg-[#00b3e0] font-medium",
    footerActionLink: "text-[#00ccff] hover:text-[#00e5ff]",
    footerActionText: "text-[#7a99b8]",
    dividerText: "text-[#3a5570]",
    dividerLine: "bg-[#1c2d42]",
    identityPreviewEditButton: "text-[#00ccff]",
    formFieldSuccessText: "text-[#00ccff]",
    alertText: "text-[#eef3fc]",
    alert: "border-[#1c2d42] bg-[#162030]",
    logoBox: "justify-center",
    logoImage: "h-10 w-10",
    otpCodeFieldInput: "bg-[#162030] border-[#1c2d42] text-[#eef3fc]",
    formFieldRow: "gap-3",
    main: "gap-5",
    footerAction: "bg-[#0b1323]",
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
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

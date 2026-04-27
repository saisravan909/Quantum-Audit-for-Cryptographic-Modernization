import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Server, FileText, Bell, CheckCircle, Orbit, Info, User, Scale, Play, Building2, Cpu, GitBranch, Menu, X } from "lucide-react";
import { QuantumKeyLogo } from "@/components/QuantumKeyLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const mainNav = [
    { href: "/dashboard", label: "Command Center", icon: Orbit },
    { href: "/nodes", label: "Node Inventory", icon: Server },
    { href: "/telemetry", label: "Telemetry Feed", icon: Activity },
    { href: "/compliance", label: "Compliance Velocity", icon: CheckCircle },
    { href: "/cbom", label: "CBOM Explorer", icon: FileText },
    { href: "/alerts", label: "Zero Trust Alerts", icon: Bell },
  ];

  const infoNav = [
    { href: "/", label: "About QVault", icon: Info },
    { href: "/innovator", label: "About the Innovator", icon: User },
    { href: "/regulatory", label: "Regulatory Mapping", icon: Scale },
    { href: "/industries", label: "Industry Use Cases", icon: Building2 },
    { href: "/cyber-intel", label: "Cyber Intel", icon: Cpu },
    { href: "/demo", label: "Live Demo", icon: Play },
    { href: "/roadmap", label: "Roadmap", icon: GitBranch },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/" || location === "/about";
    return location === href || location.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo header */}
      <Link href="/" className="block border-b border-border hover:bg-orange-500/5 transition-colors group">
        <div className="flex items-center gap-2 px-3 pt-2 pb-0">
          <div style={{ marginLeft: "-8px", marginBottom: "-8px" }}>
            <QuantumKeyLogo width={100} height={60} />
          </div>
          <div style={{ marginLeft: "-4px" }}>
            <div className="font-bold text-[13px] tracking-widest text-orange-400 uppercase group-hover:text-orange-300 transition-colors" style={{ fontFamily: "'Orbitron', monospace" }}>QVault</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest">PQC Command Center</div>
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="mono text-[9px] text-muted-foreground/50 tracking-[0.3em] uppercase px-3 pb-1">Platform</div>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive(item.href)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}

        <div className="py-2">
          <div className="h-px bg-border" />
        </div>

        <div className="mono text-[9px] text-muted-foreground/50 tracking-[0.3em] uppercase px-3 pb-1">Info</div>
        {infoNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive(item.href)
                ? "bg-orange-500/10 text-orange-400 font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground flex justify-between items-center">
          <span>SYS: ONLINE</span>
          <span className="text-primary font-mono">2026.1</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Desktop sidebar (always visible md+) ── */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar (slide-in drawer) ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 border-r border-border bg-card flex flex-col md:hidden
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-12 md:h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-4 md:px-6 justify-between shrink-0">
          {/* Hamburger on mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-mono text-primary uppercase tracking-widest">Live Telemetry Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono text-muted-foreground">
            <span className="hidden sm:inline">NIST 800-207</span>
            <span className="hidden sm:inline">|</span>
            <span>CNSA 2.0</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { Activity, Server, FileText, Bell, CheckCircle, Orbit, Info, User, Scale, Play, Building2, Cpu } from "lucide-react";
import { QuantumKeyLogo } from "@/components/QuantumKeyLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

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
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/" || location === "/about";
    return location === href || location.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Animated logo header */}
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
          {/* Main tools */}
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
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="py-2">
            <div className="h-px bg-border" />
          </div>

          {/* Info pages */}
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
              <item.icon className="w-4 h-4" />
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
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Live Telemetry Active</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>NIST 800-207</span>
            <span>|</span>
            <span>CNSA 2.0</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}

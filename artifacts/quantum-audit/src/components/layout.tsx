import { Link, useLocation } from "wouter";
import { Shield, Activity, Server, FileText, Bell, CheckCircle, Orbit } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Command Center", icon: Orbit },
    { href: "/nodes", label: "Node Inventory", icon: Server },
    { href: "/telemetry", label: "Telemetry Feed", icon: Activity },
    { href: "/compliance", label: "Compliance Velocity", icon: CheckCircle },
    { href: "/cbom", label: "CBOM Explorer", icon: FileText },
    { href: "/alerts", label: "Zero Trust Alerts", icon: Bell },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Shield className="text-primary w-8 h-8" />
          <div>
            <div className="font-bold text-sm tracking-widest text-primary uppercase">QUANTUM</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Audit Command</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
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
        <div className="flex-1 overflow-auto p-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
}

import { useGetComplianceVelocity, useGetComplianceOverview, getGetComplianceVelocityQueryKey, getGetComplianceOverviewQueryKey } from "@workspace/api-client-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { CheckCircle, ShieldAlert, Shield, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ComplianceDashboard() {
  const { data: velocity } = useGetComplianceVelocity({ query: { queryKey: getGetComplianceVelocityQueryKey() } });
  const { data: overview } = useGetComplianceOverview({ query: { queryKey: getGetComplianceOverviewQueryKey() } });

  if (!velocity || !overview) return <div className="p-8 text-primary font-mono animate-pulse uppercase">Compiling compliance matrices...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Compliance Velocity</h1>
        <p className="text-muted-foreground mt-1">NIST 800-207 and CNSA 2.0 readiness tracking across all enclaves.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border bg-card p-5 rounded-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-32 h-32" /></div>
          <span className="text-sm font-medium text-muted-foreground mb-1 block uppercase tracking-widest">Overall Rate</span>
          <span className="text-4xl font-bold text-foreground font-mono">{overview.overallComplianceRate}%</span>
        </div>
        <div className="border border-border bg-card p-5 rounded-lg relative overflow-hidden group ring-1 ring-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.05)]">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-primary"><Shield className="w-32 h-32" /></div>
          <span className="text-sm font-medium text-primary mb-1 block uppercase tracking-widest">CNSA 2.0</span>
          <span className="text-4xl font-bold text-foreground font-mono">{overview.cnsa20Rate}%</span>
        </div>
        <div className="border border-border bg-card p-5 rounded-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-accent"><Shield className="w-32 h-32" /></div>
          <span className="text-sm font-medium text-accent mb-1 block uppercase tracking-widest">Zero Trust Score</span>
          <span className="text-4xl font-bold text-foreground font-mono">{overview.zeroTrustScore}/100</span>
        </div>
        <div className="border border-border bg-card p-5 rounded-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-destructive"><ShieldAlert className="w-32 h-32" /></div>
          <span className="text-sm font-medium text-destructive mb-1 block uppercase tracking-widest">At-Risk Nodes</span>
          <span className="text-4xl font-bold text-foreground font-mono">{overview.atRiskNodes + overview.criticalNodes}</span>
        </div>
      </div>

      <div className="border border-border bg-card rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6 uppercase tracking-widest flex items-center gap-2">
          <ActivityIcon /> Adoption Velocity
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMlKem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMlDsa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="mlKemAdoption" name="ML-KEM (Kyber)" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMlKem)" />
              <Area type="monotone" dataKey="mlDsaAdoption" name="ML-DSA (Dilithium)" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorMlDsa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border bg-card rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6 uppercase tracking-widest">Framework Readiness</h2>
          <div className="space-y-6">
            {overview.frameworks.map((fw, i) => (
              <motion.div key={fw.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="uppercase text-muted-foreground">{fw.name}</span>
                  <span className={fw.compliance > 80 ? "text-primary" : fw.compliance > 50 ? "text-accent" : "text-destructive"}>{fw.compliance}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${fw.compliance > 80 ? "bg-primary" : fw.compliance > 50 ? "bg-accent" : "bg-destructive"}`} 
                    style={{ width: `${fw.compliance}%` }} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="border border-border bg-card rounded-lg p-6 flex flex-col justify-center">
          <div className="text-center space-y-4">
            <ShieldCheck className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl uppercase tracking-widest text-muted-foreground font-light">Compliance Report Engine</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">Generate cryptographic agility reports formatted for federal agency submission and congressional oversight committees.</p>
            <button className="mt-4 px-6 py-2 bg-primary/10 text-primary border border-primary/30 rounded font-medium uppercase tracking-widest text-sm hover:bg-primary/20 transition-colors w-full max-w-xs mx-auto">
              Export Audit Artifact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity text-primary"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
  );
}

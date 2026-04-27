import { useGetDashboardSummary, useGetHndlExposure, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Activity, ShieldAlert, Zap, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function CommandCenter() {
  const { data: summary } = useGetDashboardSummary({ query: { refetchInterval: 5000, queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: hndlExposure } = useGetHndlExposure();

  if (!summary) return <div className="p-8 text-primary font-mono animate-pulse">INITIATING COMMAND CENTER...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">Real-time PQC readiness and HNDL threat vector analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-border bg-card p-5 rounded-lg flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Cpu className="w-16 h-16" /></div>
          <span className="text-sm font-medium text-muted-foreground mb-1 z-10">PQC Enabled Nodes</span>
          <span className="text-4xl font-bold text-primary font-mono z-10">{summary.pqcEnabledNodes} / {summary.totalNodes}</span>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="border border-border bg-card p-5 rounded-lg flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><ShieldAlert className="w-16 h-16 text-destructive" /></div>
          <span className="text-sm font-medium text-muted-foreground mb-1 z-10">Critical Alerts</span>
          <span className="text-4xl font-bold text-destructive font-mono z-10">{summary.criticalAlerts}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-border bg-card p-5 rounded-lg flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Activity className="w-16 h-16 text-accent" /></div>
          <span className="text-sm font-medium text-muted-foreground mb-1 z-10">HNDL Exposure Score</span>
          <span className="text-4xl font-bold text-accent font-mono z-10">{summary.hndlExposureScore}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border border-border bg-card p-5 rounded-lg flex flex-col relative overflow-hidden ring-1 ring-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Zap className="w-16 h-16 text-primary" /></div>
          <span className="text-sm font-medium text-primary mb-1 z-10">CNSA 2.0 Compliance</span>
          <span className="text-4xl font-bold text-foreground font-mono z-10">{summary.cnsa20ComplianceRate}%</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border bg-card rounded-lg p-5">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            HNDL Exposure Vector
          </h2>
          <div className="h-[300px] w-full">
            {hndlExposure ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hndlExposure} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExposed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="exposedBytes" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorExposed)" />
                  <Area type="monotone" dataKey="protectedBytes" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorProtected)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">LOADING TELEMETRY...</div>
            )}
          </div>
        </div>
        <div className="border border-border bg-card rounded-lg p-5">
            <h2 className="text-lg font-medium mb-4 text-primary">Traffic Classification</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1 font-mono">
                  <span>Hybrid PQC</span>
                  <span className="text-primary">{summary.hybridPqcTrafficPct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${summary.hybridPqcTrafficPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-mono">
                  <span>Classical Only</span>
                  <span className="text-destructive">{summary.classicalOnlyTrafficPct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: `${summary.classicalOnlyTrafficPct}%` }} />
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

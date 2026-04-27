import { useParams, Link } from "wouter";
import { useGetNode, useGetNodeRiskScore, getGetNodeQueryKey, getGetNodeRiskScoreQueryKey } from "@workspace/api-client-react";
import { Server, Activity, ShieldAlert, Cpu, ArrowLeft, Terminal } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function NodeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");

  const { data: node, isLoading: nodeLoading } = useGetNode(id, { query: { enabled: !!id, queryKey: getGetNodeQueryKey(id) } });
  const { data: riskScore, isLoading: riskLoading } = useGetNodeRiskScore(id, { query: { enabled: !!id, queryKey: getGetNodeRiskScoreQueryKey(id) } });

  if (nodeLoading || riskLoading) return <div className="p-8 text-primary font-mono animate-pulse uppercase tracking-widest">Establishing secure link...</div>;
  if (!node || !riskScore) return <div className="p-8 text-destructive font-mono uppercase tracking-widest">Node not found or access denied</div>;

  const gaugeData = [
    { name: "Risk", value: riskScore.score },
    { name: "Safe", value: 100 - riskScore.score }
  ];

  const gaugeColor = riskScore.score > 75 ? "hsl(var(--destructive))" : riskScore.score > 50 ? "hsl(var(--accent))" : "hsl(var(--primary))";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <Link href="/nodes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium uppercase tracking-wider mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-card border border-border rounded-lg">
            <Server className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
              {node.hostname}
              <span className="text-sm px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono tracking-normal">ID: {node.id}</span>
            </h1>
            <p className="text-muted-foreground font-mono mt-1 text-sm">{node.ipAddress} • {node.environment}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border bg-card rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="absolute top-4 left-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">Quantum Risk Score</h3>
          
          <div className="w-48 h-48 mt-8 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={gaugeColor} />
                  <Cell fill="hsl(var(--secondary))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-4xl font-bold font-mono" style={{ color: gaugeColor }}>{riskScore.score}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>
          
          <div className="w-full mt-4 bg-secondary p-4 rounded text-sm text-center border border-border/50">
            <span className="font-medium text-foreground block mb-1">Recommendation:</span>
            <span className="text-muted-foreground">{riskScore.recommendation}</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-border bg-card rounded-lg p-6">
            <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> System Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">TLS Version</div>
                <div className="font-mono text-sm bg-secondary p-2 rounded border border-border/50">{node.tlsVersion}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">OpenSSL</div>
                <div className="font-mono text-sm bg-secondary p-2 rounded border border-border/50">{node.opensslVersion}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Kernel</div>
                <div className="font-mono text-sm bg-secondary p-2 rounded border border-border/50">{node.kernelVersion}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">PQC Enabled</div>
                <div className="font-mono text-sm bg-secondary p-2 rounded border border-border/50 flex items-center gap-2">
                  {node.pqcEnabled ? (
                    <><span className="w-2 h-2 rounded-full bg-primary" /> TRUE</>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-destructive" /> FALSE</>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border bg-card rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/50">
              <h3 className="text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" /> Risk Factors (ML Weighted)
              </h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {riskScore.factors.map((factor, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{factor.factor}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{factor.value}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-secondary rounded text-xs font-mono">
                          W: {(factor.weight * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

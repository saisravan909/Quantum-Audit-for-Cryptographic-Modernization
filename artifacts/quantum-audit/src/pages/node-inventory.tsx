import { useListNodes } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Server, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function NodeInventory() {
  const { data: nodes, isLoading } = useListNodes();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'at-risk': return <Activity className="w-4 h-4 text-accent" />;
      case 'critical': return <ShieldAlert className="w-4 h-4 text-destructive" />;
      case 'migrating': return <Activity className="w-4 h-4 text-blue-400" />;
      default: return <Server className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return "text-primary border-primary/20 bg-primary/10";
      case 'at-risk': return "text-accent border-accent/20 bg-accent/10";
      case 'critical': return "text-destructive border-destructive/20 bg-destructive/10";
      case 'migrating': return "text-blue-400 border-blue-400/20 bg-blue-400/10";
      default: return "text-muted-foreground border-border bg-secondary";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Node Inventory</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Global infrastructure registry and PQC risk assessment.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium tracking-widest">Node ID / Hostname</th>
                <th className="px-6 py-4 font-medium tracking-widest">Environment</th>
                <th className="px-6 py-4 font-medium tracking-widest">PQC Status</th>
                <th className="px-6 py-4 font-medium tracking-widest">Risk Score</th>
                <th className="px-6 py-4 font-medium tracking-widest">Last Seen</th>
                <th className="px-6 py-4 font-medium tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-mono animate-pulse">
                    SCANNING INFRASTRUCTURE...
                  </td>
                </tr>
              ) : nodes?.map((node, i) => (
                <motion.tr 
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border hover:bg-secondary/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded bg-card border border-border`}>
                        <Server className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{node.hostname}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{node.ipAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground uppercase tracking-wider">
                      {node.environment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(node.status)}`}>
                      {getStatusIcon(node.status)}
                      <span className="uppercase tracking-wider">{node.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${node.riskScore > 75 ? 'bg-destructive' : node.riskScore > 50 ? 'bg-accent' : 'bg-primary'}`} 
                          style={{ width: `${node.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono">{node.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                    {format(new Date(node.lastSeen), "yyyy-MM-dd HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/nodes/${node.id}`} className="text-primary hover:text-primary/80 font-medium uppercase tracking-wider text-xs">
                      Inspect
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

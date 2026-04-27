import { useListAlerts, useAcknowledgeAlert, getListAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertsCenter() {
  const queryClient = useQueryClient();
  const { data: alerts, isLoading } = useListAlerts({ query: { queryKey: getListAlertsQueryKey() } });
  
  const ackAlert = useAcknowledgeAlert();

  const handleAcknowledge = (id: number) => {
    ackAlert.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
      }
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-accent" />;
      case 'medium': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return "border-destructive/30 bg-destructive/5";
      case 'high': return "border-accent/30 bg-accent/5";
      case 'medium': return "border-blue-400/30 bg-blue-400/5";
      default: return "border-border bg-secondary";
    }
  };

  const activeAlerts = alerts?.filter(a => !a.acknowledged) || [];
  const ackedAlerts = alerts?.filter(a => a.acknowledged) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Zero Trust Alerts</h1>
        <p className="text-muted-foreground mt-1">Real-time classical fallback and HNDL threat event feed.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          Active Threats ({activeAlerts.length})
        </h2>
        
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground font-mono animate-pulse border border-border rounded-lg bg-card">
            POLLING SENSORS...
          </div>
        ) : activeAlerts.length === 0 ? (
          <div className="p-8 text-center border border-border rounded-lg bg-card text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-primary opacity-50" />
            <p className="uppercase tracking-widest text-sm">No active alerts. Perimeter secure.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {activeAlerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                  className={`p-4 border rounded-lg flex items-start gap-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-foreground tracking-tight">{alert.title}</h3>
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs font-mono bg-background border border-border px-2 py-1 rounded">Node: {alert.nodeId}</span>
                      <span className="text-xs font-mono bg-background border border-border px-2 py-1 rounded">Type: {alert.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={ackAlert.isPending}
                    className="shrink-0 px-3 py-1.5 border border-border bg-background hover:bg-secondary rounded text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    Acknowledge
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {ackedAlerts.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2 border-b border-border pb-2">
            Acknowledged History
          </h2>
          <div className="space-y-2 opacity-60 grayscale-[50%]">
            {ackedAlerts.map(alert => (
              <div key={alert.id} className="p-3 border border-border bg-card rounded-lg flex items-center gap-4 text-sm">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium line-through">{alert.title}</span>
                  <span className="text-xs font-mono text-muted-foreground">Ack'd {alert.acknowledgedAt && formatDistanceToNow(new Date(alert.acknowledgedAt), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

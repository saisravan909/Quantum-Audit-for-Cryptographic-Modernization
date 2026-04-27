import { useGetTelemetryStream, getGetTelemetryStreamQueryKey } from "@workspace/api-client-react";
import { Activity, ShieldAlert, Cpu } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export default function TelemetryFeed() {
  const { data: stream, isLoading } = useGetTelemetryStream({ query: { refetchInterval: 3000, queryKey: getGetTelemetryStreamQueryKey() } });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when new items arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stream]);

  return (
    <div className="p-3 md:p-0 h-[calc(100dvh-3rem)] md:h-[calc(100dvh-3.5rem)]">
    <div className="h-full flex flex-col max-w-7xl mx-auto border border-border rounded-lg bg-[#0a0a0a] overflow-hidden shadow-2xl">
      <div className="p-3 md:p-4 border-b border-border bg-card/80 backdrop-blur flex justify-between items-center shrink-0 gap-3">
        <div>
          <h1 className="text-base md:text-xl font-bold tracking-tight uppercase flex items-center gap-2 md:gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
            Live TLS Telemetry
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5 hidden sm:block">eBPF Packet Inspection Engine Active</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" /> <span className="hidden xs:inline">Hybrid</span> PQC
          </div>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-destructive shrink-0" /> Classical
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
        {isLoading ? (
          <div className="text-primary animate-pulse py-4">INITIALIZING CAPTURE INTERFACE...</div>
        ) : stream?.length === 0 ? (
          <div className="text-muted-foreground py-4">WAITING FOR HANDSHAKES...</div>
        ) : (
          <AnimatePresence initial={false}>
            {stream?.map((event) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded border ${event.isHybridPqc ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-muted-foreground">
                  <span className="text-foreground font-bold">{format(new Date(event.timestamp), "HH:mm:ss.SSS")}</span>
                  <span>|</span>
                  <span>{event.sourceIp} &rarr; {event.destIp}</span>
                  <span>|</span>
                  <span className="bg-secondary px-1.5 py-0.5 rounded">{event.tlsVersion}</span>
                  <span className="bg-secondary px-1.5 py-0.5 rounded">{event.cipherSuite}</span>
                  <span className="ml-auto flex items-center gap-1">
                    {event.isHybridPqc ? (
                      <span className="text-primary uppercase tracking-wider font-bold text-[10px]">SECURE: PQC HYBRID</span>
                    ) : (
                      <span className="text-destructive uppercase tracking-wider font-bold text-[10px] animate-pulse">VULN: CLASSICAL</span>
                    )}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase text-[10px] tracking-widest">Extension: key_share</div>
                    <div className="break-all text-muted-foreground/50 leading-relaxed bg-black/40 p-2 rounded">
                      {event.keyShareHex.substring(0, 64)}...
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-foreground mt-1 bg-secondary/30 p-1.5 rounded inline-block"
                    >
                      &rarr; Decoded: {event.keyShareDecoded}
                    </motion.div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase text-[10px] tracking-widest">Extension: supported_groups</div>
                    <div className="break-all text-muted-foreground/50 leading-relaxed bg-black/40 p-2 rounded">
                      {event.supportedGroupsHex.substring(0, 64)}...
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-foreground mt-1 bg-secondary/30 p-1.5 rounded inline-block"
                    >
                      &rarr; Decoded: {event.supportedGroupsDecoded}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
    </div>
  );
}

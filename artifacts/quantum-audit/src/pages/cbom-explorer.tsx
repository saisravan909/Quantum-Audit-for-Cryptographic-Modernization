import { useState } from "wouter";
import { useListCbom, useCreateCbomEntry, getListCbomQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, ShieldAlert, CheckCircle2, GitCommit } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function CbomExplorer() {
  const queryClient = useQueryClient();
  const { data: cbomData, isLoading } = useListCbom({ query: { queryKey: getListCbomQueryKey() } });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return "text-primary border-primary/20 bg-primary/10";
      case 'deprecated': return "text-destructive border-destructive/20 bg-destructive/10";
      case 'migrating': return "text-accent border-accent/20 bg-accent/10";
      case 'replaced': return "text-muted-foreground border-border bg-secondary";
      default: return "text-muted-foreground border-border bg-secondary";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">CBOM Explorer</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Living Cryptographic Bill of Materials mapped to git commits.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground font-medium uppercase tracking-widest text-xs md:text-sm rounded hover:bg-primary/90 transition-colors shrink-0">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Entry</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium tracking-widest">Component</th>
                <th className="px-6 py-4 font-medium tracking-widest">Algorithm</th>
                <th className="px-6 py-4 font-medium tracking-widest">Key Size</th>
                <th className="px-6 py-4 font-medium tracking-widest">Status</th>
                <th className="px-6 py-4 font-medium tracking-widest">Git Commit</th>
                <th className="px-6 py-4 font-medium tracking-widest">PQC Ready</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-mono animate-pulse">
                    ANALYZING DEPENDENCY GRAPH...
                  </td>
                </tr>
              ) : cbomData?.map((entry, i) => (
                <motion.tr 
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{entry.componentName}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">v{entry.componentVersion}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">
                    {entry.algorithm}
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">
                    {entry.keySize}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border uppercase tracking-wider ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GitCommit className="w-3 h-3" />
                      <span className="font-mono text-xs">{entry.gitCommit.substring(0, 7)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {entry.pqcReady ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-destructive" />
                    )}
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

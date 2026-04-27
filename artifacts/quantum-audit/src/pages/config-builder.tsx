import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, CheckCircle, Terminal, Settings, Code, Zap, ChevronDown, FileText } from "lucide-react";

const OS_OPTIONS = [
  { id: "rhel9", label: "RHEL 9 / Rocky 9 / Alma 9", pkg: "rpm", openssl: "3.0.x", kernelMin: "5.14" },
  { id: "rhel8", label: "RHEL 8 / Rocky 8 / Alma 8", pkg: "rpm", openssl: "1.1.1", kernelMin: "4.18" },
  { id: "ubuntu2404", label: "Ubuntu 24.04 LTS (Noble)", pkg: "deb", openssl: "3.2.x", kernelMin: "6.8" },
  { id: "ubuntu2204", label: "Ubuntu 22.04 LTS (Jammy)", pkg: "deb", openssl: "3.0.x", kernelMin: "5.15" },
  { id: "debian12", label: "Debian 12 (Bookworm)", pkg: "deb", openssl: "3.0.x", kernelMin: "6.1" },
];

const COMPLIANCE_OPTIONS = [
  { id: "cnsa20", label: "CNSA 2.0", short: "CNSA", desc: "NSA Commercial National Security Algorithm Suite 2.0: required for NSS systems", color: "#f97316" },
  { id: "nist80053", label: "NIST SP 800-53 rev5", short: "800-53", desc: "Security and Privacy Controls for Information Systems (SC-12, SC-13)", color: "#22d3ee" },
  { id: "nist800207", label: "NIST SP 800-207", short: "ZTA", desc: "Zero Trust Architecture: cryptographic session verification requirements", color: "#a855f7" },
  { id: "eo14028", label: "EO 14028", short: "EO", desc: "Executive Order on Improving the Nation's Cybersecurity: federal logging and PQC readiness", color: "#22c55e" },
];

const ENVIRONMENT_OPTIONS = [
  { id: "prod", label: "Production", bufferSize: "128MB", flushInterval: "5s", logLevel: "warn" },
  { id: "staging", label: "Staging", bufferSize: "64MB", flushInterval: "10s", logLevel: "info" },
  { id: "dev", label: "Development", bufferSize: "16MB", flushInterval: "30s", logLevel: "debug" },
];

function generateConfig(os: typeof OS_OPTIONS[0], compliance: string[], env: typeof ENVIRONMENT_OPTIONS[0]) {
  const hasCSNA = compliance.includes("cnsa20");
  const hasZT = compliance.includes("nist800207");
  const hasEO = compliance.includes("eo14028");

  const fluentbit = `# ============================================================
# QVault Fluent Bit Configuration
# Generated for: ${os.label}
# Compliance: ${compliance.map(c => COMPLIANCE_OPTIONS.find(o => o.id === c)?.short).join(", ")}
# Environment: ${env.label}
# Generated: ${new Date().toISOString().split("T")[0]}
# ============================================================

[SERVICE]
    Flush         ${env.flushInterval}
    Log_Level     ${env.logLevel}
    Daemon        Off
    Parsers_File  parsers.conf
    HTTP_Server   On
    HTTP_Listen   127.0.0.1
    HTTP_Port     2020
    storage.metrics On

# --- INPUT: OpenSSL TLS Handshake Audit Log ---
[INPUT]
    Name              tail
    Path              /var/log/openssl/tls_audit.log
    Parser            openssl_tls_json
    Tag               qvault.tls.handshake
    Refresh_Interval  5
    Mem_Buf_Limit     ${env.bufferSize}
    Skip_Empty_Lines  On
    DB                /var/lib/fluent-bit/qvault_tls.db

# --- INPUT: eBPF Kernel Crypto Events ---
[INPUT]
    Name          systemd
    Tag           qvault.kernel.crypto
    Path          /run/log/journal
    Systemd_Filter _SYSTEMD_UNIT=qvault-ebpf-probe.service

# --- FILTER: Parse & Enrich TLS Handshake Data ---
[FILTER]
    Name         lua
    Match        qvault.tls.*
    Script       /etc/fluent-bit/scripts/pqc_enrich.lua
    Call         enrich_handshake

# --- FILTER: Add Node Metadata ---
[FILTER]
    Name          record_modifier
    Match         qvault.*
    Record        node_hostname \${HOSTNAME}
    Record        environment ${env.label.toLowerCase()}
    Record        openssl_version ${os.openssl}
    Record        collector_version 1.0.0${hasCSNA ? `
    Record        cnsa20_monitored true` : ""}${hasZT ? `
    Record        zero_trust_enforced true` : ""}

# --- FILTER: Drop Non-Crypto Noise ---
[FILTER]
    Name   grep
    Match  qvault.tls.*
    Regex  cipher_suite (TLS_|MLKEM|ML-KEM|RSA|ECDH|DHE)

${hasCSNA ? `# --- FILTER: CNSA 2.0 Algorithm Compliance Check ---
[FILTER]
    Name         lua
    Match        qvault.tls.*
    Script       /etc/fluent-bit/scripts/cnsa20_check.lua
    Call         check_cnsa20_compliance

` : ""}${hasEO ? `# --- FILTER: EO-14028 Audit Enrichment ---
[FILTER]
    Name          record_modifier
    Match         qvault.*
    Record        eo14028_logged true
    Record        log_category cryptographic_audit
    Record        retention_days 365

` : ""}# --- OUTPUT: OpenSearch Data Prepper ---
[OUTPUT]
    Name              http
    Match             qvault.*
    Host              data-prepper.qvault.internal
    Port              21890
    URI               /log/ingest
    Format            json_lines
    tls               On
    tls.verify        On
    tls.ca_file       /etc/qvault/tls/ca.crt
    tls.crt_file      /etc/qvault/tls/fluentbit.crt
    tls.key_file      /etc/qvault/tls/fluentbit.key
    Retry_Limit       5
    Workers           2

# --- OUTPUT: Local Fallback (Buffer during outage) ---
[OUTPUT]
    Name     file
    Match    qvault.*
    Path     /var/lib/qvault/buffer/
    File     handshake_buffer
    Format   json_lines`;

  const dataprepper = `# ============================================================
# QVault OpenSearch Data Prepper Pipeline
# Compliance: ${compliance.map(c => COMPLIANCE_OPTIONS.find(o => o.id === c)?.short).join(", ")}
# Environment: ${env.label}
# ============================================================

version: "2"

log-pipeline:
  source:
    http:
      port: 21890
      ssl: true
      ssl_certificate_file: "/etc/qvault/tls/data-prepper.crt"
      ssl_key_file: "/etc/qvault/tls/data-prepper.key"

  processor:
    # Parse raw TLS handshake JSON
    - json:
        source: "message"
        destination: "parsed"

    # Assign Quantum Risk Score (0-100)
    - substitute_string:
        entries:
          - source: "parsed/cipher_suite"
            from: "ML-KEM|MLKEM|kyber"
            to: "PQC_SAFE"

    - add_entries:
        entries:
          - key: "quantum_risk_score"
            value_expression: |
              if parsed["cipher_suite"] =~ "ML-KEM" then 0
              elif parsed["cipher_suite"] =~ "ECDH" then 75
              elif parsed["cipher_suite"] =~ "RSA" then 85
              else 50
            overwrite_if_key_exists: true

          - key: "pqc_compliant"
            value_expression: 'parsed["cipher_suite"] =~ "ML-KEM|AES-256"'
            overwrite_if_key_exists: true

${hasCSNA ? `          - key: "cnsa20_status"
            value_expression: |
              if parsed["cipher_suite"] =~ "ML-KEM-768|ML-DSA-65|AES-256" then "compliant"
              elif parsed["cipher_suite"] =~ "RSA|ECDH|SHA-1" then "non_compliant"
              else "requires_review"
            overwrite_if_key_exists: true

` : ""}${hasZT ? `    # Zero Trust: Flag classical-only fallbacks for immediate alert
    - route:
        routes:
          - name: "zero_trust_violation"
            condition: 'parsed["cipher_suite"] =~ "RSA|ECDH" and parsed["session_type"] == "internal"'
          - name: "pqc_session"
            condition: 'parsed["cipher_suite"] =~ "ML-KEM"'
          - name: "all_events"
            condition: 'true'

` : ""}  sink:
    # Primary index: all TLS events
    - opensearch:
        hosts: ["https://opensearch.qvault.internal:9200"]
        username: "\${OPENSEARCH_USER}"
        password: "\${OPENSEARCH_PASSWORD}"
        index: "qvault-tls-events-%{yyyy.MM.dd}"
        index_type: "plain"
        template_file: "/etc/qvault/index-templates/tls-events.json"
        bulk_size: 10MB
        flush_timeout: 60

    # Alert index: critical/high risk events only
    - opensearch:
        hosts: ["https://opensearch.qvault.internal:9200"]
        username: "\${OPENSEARCH_USER}"
        password: "\${OPENSEARCH_PASSWORD}"
        index: "qvault-alerts-%{yyyy.MM.dd}"
        condition: 'quantum_risk_score >= 70'
        bulk_size: 1MB
        flush_timeout: 10`;

  return { fluentbit, dataprepper };
}

export default function ConfigBuilder() {
  const [os, setOs] = useState(OS_OPTIONS[0]);
  const [compliance, setCompliance] = useState<string[]>(["cnsa20", "nist800207"]);
  const [env, setEnv] = useState(ENVIRONMENT_OPTIONS[0]);
  const [activeTab, setActiveTab] = useState<"fluentbit" | "dataprepper">("fluentbit");
  const [copied, setCopied] = useState(false);
  const [osOpen, setOsOpen] = useState(false);
  const [envOpen, setEnvOpen] = useState(false);

  const { fluentbit, dataprepper } = generateConfig(os, compliance, env);
  const activeConfig = activeTab === "fluentbit" ? fluentbit : dataprepper;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(activeConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeConfig]);

  const handleDownload = useCallback(() => {
    const filename = activeTab === "fluentbit" ? "fluent-bit.conf" : "data-prepper-pipeline.yaml";
    const blob = new Blob([activeConfig], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeConfig, activeTab]);

  const toggleCompliance = (id: string) => {
    setCompliance(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  };

  return (
    <div className="min-h-full bg-background p-4 md:p-6 pb-16">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="font-mono text-xs text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" /> Pipeline Config Builder
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Your Custom Security Config in 30 Seconds
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
          Select your operating system and compliance requirements. QVault generates a ready-to-deploy configuration for the entire data collection pipeline, no guesswork required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-4">
          {/* OS selector */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Settings className="w-3 h-3" /> Step 1: Select Your Operating System
            </div>
            <div className="relative">
              <button
                onClick={() => setOsOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/40 transition-colors text-sm"
              >
                <div>
                  <div className="font-medium text-foreground text-left">{os.label}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">OpenSSL {os.openssl} · Kernel {os.kernelMin}+</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${osOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {osOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card z-20 shadow-2xl overflow-hidden"
                  >
                    {OS_OPTIONS.map(o => (
                      <button
                        key={o.id}
                        onClick={() => { setOs(o); setOsOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-sm border-b border-border/50 last:border-0 ${os.id === o.id ? "bg-cyan-500/5" : ""}`}
                      >
                        <span className={`text-left ${os.id === o.id ? "text-cyan-400" : "text-foreground"}`}>{o.label}</span>
                        {os.id === o.id && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Compliance targets */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Step 2: Compliance Requirements (select all that apply)
            </div>
            <div className="space-y-2">
              {COMPLIANCE_OPTIONS.map(opt => {
                const active = compliance.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleCompliance(opt.id)}
                    className="w-full flex items-start gap-3 px-3 py-3 rounded-lg border transition-all text-left"
                    style={active ? { borderColor: opt.color + "55", background: opt.color + "0a" } : { borderColor: "transparent" }}
                  >
                    <div
                      className="w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all"
                      style={active ? { background: opt.color, borderColor: opt.color } : { borderColor: "#4b5563" }}
                    >
                      {active && <CheckCircle className="w-3 h-3 text-background" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: active ? opt.color : "#9ca3af" }}>{opt.label}</div>
                      <div className="text-xs text-muted-foreground/60 mt-0.5 leading-relaxed">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environment */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Step 3: Target Environment
            </div>
            <div className="relative">
              <button
                onClick={() => setEnvOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-secondary/20 hover:border-orange-500/40 transition-colors text-sm"
              >
                <div>
                  <div className="font-medium text-foreground">{env.label}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">Buffer {env.bufferSize} · Flush {env.flushInterval}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${envOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {envOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card z-20 shadow-2xl overflow-hidden"
                  >
                    {ENVIRONMENT_OPTIONS.map(e => (
                      <button
                        key={e.id}
                        onClick={() => { setEnv(e); setEnvOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-sm border-b border-border/50 last:border-0 ${env.id === e.id ? "bg-orange-500/5" : ""}`}
                      >
                        <span className={env.id === e.id ? "text-orange-400" : "text-foreground"}>{e.label}</span>
                        {env.id === e.id && <CheckCircle className="w-3.5 h-3.5 text-orange-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Generated config */}
        <div className="flex flex-col gap-3">
          {/* Tabs + action buttons */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1 rounded-lg border border-border p-1 bg-card">
              {(["fluentbit", "dataprepper"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                    activeTab === tab ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "fluentbit" ? "fluent-bit.conf" : "pipeline.yaml"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-orange-500 bg-orange-500/10 text-orange-400 text-xs font-mono uppercase tracking-wider hover:bg-orange-500/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Config output */}
          <div className="rounded-xl border border-border bg-[#0a0d12] flex-1 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-secondary/10">
              <Code className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">
                {activeTab === "fluentbit" ? "fluent-bit.conf" : "data-prepper-pipeline.yaml"}
              </span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground/40">
                {activeConfig.split("\n").length} lines · auto-generated
              </span>
            </div>
            <pre className="p-4 text-xs font-mono overflow-auto" style={{ maxHeight: "520px", lineHeight: "1.6" }}>
              <ConfigHighlight config={activeConfig} type={activeTab} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigHighlight({ config, type }: { config: string; type: "fluentbit" | "dataprepper" }) {
  const lines = config.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        let color = "#9ca3af";
        if (trimmed.startsWith("#")) color = "#4b5563";
        else if (trimmed.startsWith("[") && trimmed.endsWith("]")) color = "#f97316";
        else if (trimmed.match(/^(Name|Match|Path|Format|Host|Port|URI|source|processor|sink|version)(\s+|:)/)) color = "#22d3ee";
        else if (trimmed.match(/^(Flush|Log_Level|Daemon|HTTP_|storage|tls|index|workers|condition|routes)/i)) color = "#a855f7";
        else if (trimmed.match(/qvault|pqc|cnsa|quantum|ML-KEM|openssl/i)) color = "#22c55e";
        else if (trimmed.match(/true|false|On|Off/)) color = "#f59e0b";
        else if (trimmed.match(/^\d+|%{|"\${/)) color = "#f59e0b";
        return (
          <div key={i} className="flex">
            <span className="text-muted-foreground/20 w-8 shrink-0 text-right mr-4 select-none">{i + 1}</span>
            <span style={{ color }}>{line || "\u00a0"}</span>
          </div>
        );
      })}
    </>
  );
}

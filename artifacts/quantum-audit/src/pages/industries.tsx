import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

interface Threat { label: string; detail: string; }
interface Regulation { name: string; deadline: string; requirement: string; }
interface UseCase { title: string; scenario: string; outcome: string; }

interface Industry {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tagline: string;
  overview: string;
  threats: Threat[];
  regulations: Regulation[];
  useCases: UseCase[];
  qvaultValue: string[];
  stats: { label: string; value: string }[];
}

const INDUSTRIES: Industry[] = [
  {
    id: "defense",
    name: "Defense and Government",
    shortName: "Defense",
    icon: "🏛️",
    color: "#ff6600",
    tagline: "Protecting National Security Systems from the quantum threat",
    overview: "Defense agencies and government departments operate National Security Systems (NSS) under the strictest cryptographic mandates in the world. CNSA 2.0, NSM-10, and EO 14028 set hard deadlines for PQC migration that cannot be missed. QVault provides the real-time operational visibility that program managers, CISOs, and ATO teams need to meet those deadlines with evidence.",
    threats: [
      { label: "Harvest Now Decrypt Later", detail: "Nation-state actors are actively collecting encrypted NSS traffic today. SIGINT archives of classified communications will be decrypted when CRQC capability arrives, estimated 2029 to 2033." },
      { label: "SCIF and JWICS Exposure", detail: "Classified enclaves running RSA or ECC are producing HNDL-vulnerable traffic on every session. The exposure is retroactive — data encrypted years ago is at risk." },
      { label: "Contractor Supply Chain", detail: "Defense primes and subcontractors handle controlled unclassified information (CUI) over cryptographically vulnerable channels, creating an indirect attack surface." },
    ],
    regulations: [
      { name: "CNSA 2.0", deadline: "2030 for NSS", requirement: "Migrate to ML-KEM-1024 and ML-DSA-87 for all NSS. Deprecate RSA, ECDSA, ECDH." },
      { name: "NSM-10", deadline: "Annual reporting", requirement: "Inventory all cryptographic systems, develop migration plans, report progress to OMB and NSC." },
      { name: "EO 14028", deadline: "Phased 2021 to ongoing", requirement: "Adopt Zero Trust Architecture per NIST 800-207. Encrypt all data in transit with approved algorithms." },
      { name: "CMMC 2.0", deadline: "Required for DoD contracts", requirement: "Cryptographic protection of CUI at rest and in transit. Audit trail of all access to protected data." },
    ],
    useCases: [
      { title: "ATO Acceleration", scenario: "A Navy program office needs to demonstrate cryptographic compliance for a major system ATO renewal. The team has no inventory of what algorithms are running.", outcome: "QVault scans the estate, generates a CBOM, maps it to CNSA 2.0 requirements, and produces an evidence package in hours instead of weeks." },
      { title: "Insider Threat Detection", scenario: "A classified network segment begins negotiating non-standard cipher suites on sessions routed through a third-party enclave.", outcome: "Zero Trust Alerts fires a critical alert within seconds. The anomalous session is traced to a misconfigured gateway and remediated before classified data is exposed." },
    ],
    qvaultValue: ["CNSA 2.0 compliance scoring and gap analysis", "ATO evidence package generation via CBOM", "NSM-10 annual reporting data aggregation", "Zero Trust policy enforcement and alerting", "HNDL exposure score per classified segment"],
    stats: [{ label: "NSS Deadline", value: "2030" }, { label: "CNSA 2.0 Algorithms", value: "4" }, { label: "Frameworks Covered", value: "5" }, { label: "Avg HNDL Window", value: "18 yr" }],
  },
  {
    id: "critical",
    name: "Critical Infrastructure",
    shortName: "Critical Infra",
    icon: "⚡",
    color: "#cc4400",
    tagline: "Securing power grids, water systems, and transport from quantum-era attacks",
    overview: "Critical infrastructure operators — power utilities, water authorities, transportation networks, and telecommunications providers — face a unique challenge: their OT systems were never designed for cryptographic agility. Many SCADA and ICS systems run legacy protocols with hardcoded algorithms that cannot be patched like enterprise IT. QVault provides the visibility layer that allows operators to understand their exposure and prioritize modernization without disrupting operations.",
    threats: [
      { label: "SCADA and ICS Cryptographic Legacy", detail: "Many operational technology systems run Modbus, DNP3, or early IEC 61850 implementations with weak or no cryptographic protection. These systems cannot be taken offline for updates without service disruption." },
      { label: "Cascading Failure Risk", detail: "A cryptographic compromise of a power grid EMS or water treatment SCADA could trigger physical infrastructure failures. The consequences of a quantum-enabled attack on critical infrastructure are measured in lives, not data." },
      { label: "IT and OT Convergence", detail: "As critical infrastructure operators connect IT and OT networks for operational efficiency, they create pathways for HNDL-collected encrypted traffic to include physical control signals." },
    ],
    regulations: [
      { name: "NERC CIP", deadline: "Ongoing", requirement: "Electronic Security Perimeter protection and encryption of all BES Cyber System communications." },
      { name: "CISA Cross-Sector Goals", deadline: "2025 to 2027", requirement: "Adopt PQC for IT systems and develop OT migration roadmaps. Participate in sector ISAC information sharing." },
      { name: "NIST IR 8323", deadline: "Guidance", requirement: "Cryptographic agility for critical infrastructure position-navigation-timing systems." },
      { name: "EO 14028", deadline: "Federal operators: phased", requirement: "Zero Trust adoption, encrypted communications, software supply chain integrity." },
    ],
    useCases: [
      { title: "Regional Power Utility — HNDL Incident Response", scenario: "Cascade Valley Power discovers SCADA traffic encrypted with RSA-2048 is being mirrored to a known nation-state collection infrastructure.", outcome: "QVault alerts within minutes, CBOM identifies the 7 affected nodes, and the team deploys ML-KEM-768 on critical SCADA nodes within 4 hours — before control signals are compromised." },
      { title: "Water Authority — OT Inventory", scenario: "A municipal water authority has no inventory of what cryptographic algorithms its treatment plant control systems use.", outcome: "QVault's node discovery maps the estate, flags 12 systems using deprecated TLS 1.0 with RC4, and produces a prioritized remediation list for the next maintenance window." },
    ],
    qvaultValue: ["OT and IT convergence visibility in a single pane", "Non-disruptive cryptographic inventory via passive telemetry", "NERC CIP compliance evidence generation", "Sector ISAC incident reporting data export", "Prioritized remediation by mission criticality"],
    stats: [{ label: "Sectors Covered", value: "16" }, { label: "OT Protocol Support", value: "Roadmap" }, { label: "Avg Exposure Window", value: "20+ yr" }, { label: "CISA Priority", value: "Critical" }],
  },
  {
    id: "banking",
    name: "Banking and Financial Services",
    shortName: "Banking",
    icon: "🏦",
    color: "#3366cc",
    tagline: "Protecting financial rails and customer data from retroactive quantum decryption",
    overview: "Banks, payment processors, and financial market infrastructure operators handle some of the most sensitive data in the economy — account credentials, transaction records, wire transfers, and customer PII — all encrypted with algorithms that quantum computing will break. The financial sector faces a dual pressure: regulatory mandates from FFIEC, FinCEN, and Basel frameworks, and the existential risk that archived transaction data will be decrypted in the quantum era.",
    threats: [
      { label: "Transaction Archive Exposure", detail: "SWIFT messages, ACH transactions, and wire transfer records are encrypted with RSA and ECC. Nation-state actors archiving these records today will decrypt them when CRQC capability arrives, exposing years of financial intelligence." },
      { label: "Payment System Cryptographic Aging", detail: "EMV chip and PIN, TLS on banking APIs, and HSM key hierarchies were all designed around classical cryptographic assumptions. The migration complexity is significant but the alternative is unacceptable." },
      { label: "Third-Party and Correspondent Risk", detail: "Banks connect to thousands of counterparties, correspondent banks, and service providers over encrypted channels. Each partner's cryptographic weakness is a potential exposure point for the institution." },
    ],
    regulations: [
      { name: "FFIEC Cybersecurity Guidance", deadline: "Board-level awareness now, migration planned", requirement: "Institutions must assess quantum risk as part of IT risk management. PQC readiness expected by examiners." },
      { name: "DORA (EU)", deadline: "January 2025 effective", requirement: "Digital operational resilience including cryptographic risk management for EU-regulated financial entities." },
      { name: "PCI DSS 4.0", deadline: "March 2025 mandatory", requirement: "Strong cryptography for all cardholder data transmissions. Algorithm agility requirements being finalized." },
      { name: "NYDFS Part 500", deadline: "Ongoing amendments", requirement: "Encryption of all nonpublic information in transit and at rest. CISOs must certify annual compliance." },
    ],
    useCases: [
      { title: "Regional Bank — SWIFT Infrastructure Audit", scenario: "A mid-sized bank needs to demonstrate to its regulator that its SWIFT messaging infrastructure is not exposed to quantum-era threats.", outcome: "QVault inventories the SWIFT gateway's TLS configuration, identifies RSA-2048 key exchange, generates a CBOM, and produces a migration plan aligned to FFIEC examiner expectations." },
      { title: "Payment Processor — PCI DSS 4.0 Readiness", scenario: "A payment processor needs to assess cryptographic compliance across 200 API endpoints before a PCI DSS 4.0 audit.", outcome: "QVault scans all endpoints, identifies 23 running TLS 1.1 with weak ciphers, generates a prioritized remediation list, and tracks progress in real time against the audit deadline." },
    ],
    qvaultValue: ["FFIEC and PCI DSS cryptographic compliance evidence", "SWIFT and payment gateway algorithm inventory", "Third-party risk cryptographic posture scoring", "Real-time algorithm negotiation monitoring for all API endpoints", "Board-ready HNDL exposure reporting"],
    stats: [{ label: "PCI DSS 4.0", value: "Active" }, { label: "DORA Deadline", value: "2025" }, { label: "Avg Data Sensitivity", value: "Critical" }, { label: "Frameworks", value: "6+" }],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    shortName: "Healthcare",
    icon: "🏥",
    color: "#00aa88",
    tagline: "Protecting patient records and medical device communications from quantum exposure",
    overview: "Healthcare organizations manage some of the most sensitive personal data in existence — EHR records, genomic data, mental health records, and insurance information — all protected by HIPAA encryption requirements built on classical cryptographic algorithms. Medical devices on hospital networks add another layer of complexity: FDA-regulated devices that cannot be patched freely. QVault gives CISOs and compliance teams the visibility to understand their quantum exposure and build a migration roadmap that preserves patient safety.",
    threats: [
      { label: "EHR and Patient Data Exposure", detail: "Electronic Health Records transmitted over HL7 FHIR and DICOM connections use TLS with RSA or ECC key exchange. HNDL actors archiving this traffic today will be able to decrypt patient records in the quantum era." },
      { label: "Medical Device Cryptographic Rigidity", detail: "FDA-regulated medical devices — infusion pumps, imaging systems, patient monitors — have long certification cycles that make cryptographic updates slow and expensive. Many run outdated TLS implementations." },
      { label: "Ransomware and Quantum Convergence", detail: "Healthcare is the highest-ransomware-targeted sector. As quantum computing matures, attackers will combine HNDL-collected data with ransomware leverage, increasing extortion risk substantially." },
    ],
    regulations: [
      { name: "HIPAA Security Rule", deadline: "Ongoing", requirement: "Encryption of ePHI in transit using current industry standards. Risk analysis must include assessment of cryptographic controls." },
      { name: "FDA Cybersecurity Guidance 2023", deadline: "October 2023 effective", requirement: "Medical device manufacturers must implement postmarket cybersecurity including cryptographic agility planning." },
      { name: "HITECH Act", deadline: "Ongoing", requirement: "Breach notification requirements. Encrypted data subject to safe harbor provisions — but only if encrypted with approved algorithms." },
      { name: "NIST Healthcare Cybersecurity", deadline: "Guidance", requirement: "Healthcare sector PQC readiness planning aligned to NIST PQC standards." },
    ],
    useCases: [
      { title: "Hospital Network — EHR Infrastructure Audit", scenario: "A large hospital system's CISO needs to demonstrate to the Board that patient data transmitted over HL7 FHIR APIs is protected against quantum threats.", outcome: "QVault inventories all FHIR endpoints, identifies 8 running RSA-2048 key exchange, generates a CBOM, and produces a HIPAA-aligned migration plan with estimated remediation cost." },
      { title: "Medical Device Manufacturer — FDA Submission", scenario: "An imaging device manufacturer needs to include a cryptographic agility plan in their FDA 510k premarket submission.", outcome: "QVault's CBOM output provides the machine-readable cryptographic inventory required by FDA 2023 cybersecurity guidance, accelerating the submission process." },
    ],
    qvaultValue: ["HIPAA encryption compliance evidence generation", "HL7 FHIR and DICOM endpoint cryptographic inventory", "FDA medical device cryptographic agility planning", "Patient data HNDL exposure risk quantification", "Breach notification cryptographic safe harbor verification"],
    stats: [{ label: "HIPAA Compliance", value: "Required" }, { label: "FDA Guidance", value: "2023" }, { label: "Avg Data Life", value: "40+ yr" }, { label: "Ransomware Risk", value: "Critical" }],
  },
];

function IndustryCard({ industry }: { industry: Industry }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"threats" | "regulations" | "usecases">("threats");

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-opacity-60"
      style={{ borderColor: open ? industry.color + "44" : undefined }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-6 flex items-start gap-5 hover:bg-secondary/20 transition-colors"
      >
        <div className="text-4xl shrink-0">{industry.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="mono text-xs font-bold tracking-wider px-2 py-0.5 rounded"
              style={{ color: industry.color, background: industry.color + "22", border: `1px solid ${industry.color}44` }}>
              {industry.shortName}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">{industry.name}</h3>
          <p className="text-muted-foreground text-sm italic mb-3">{industry.tagline}</p>
          <div className="grid grid-cols-4 gap-3">
            {industry.stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-mono font-bold text-sm" style={{ color: industry.color }}>{s.value}</div>
                <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground mt-1">
          {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-black/20 p-6 space-y-6">
          <p className="text-gray-300 text-sm leading-relaxed">{industry.overview}</p>

          {/* Tab bar */}
          <div className="flex gap-2 border-b border-border pb-0">
            {(["threats", "regulations", "usecases"] as const).map(tab => {
              const labels = { threats: "Threat Landscape", regulations: "Regulations", usecases: "Use Cases" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs mono uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === tab
                      ? "border-current font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  style={activeTab === tab ? { color: industry.color, borderColor: industry.color } : {}}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Threat content */}
          {activeTab === "threats" && (
            <div className="space-y-3">
              {industry.threats.map(t => (
                <div key={t.label} className="flex gap-3 p-4 rounded border border-red-500/15 bg-red-500/5">
                  <div className="w-1 shrink-0 rounded-full bg-red-500/60 mt-1" />
                  <div>
                    <div className="text-red-400 font-semibold text-sm mb-1">{t.label}</div>
                    <div className="text-muted-foreground text-xs leading-relaxed">{t.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regulations content */}
          {activeTab === "regulations" && (
            <div className="space-y-3">
              {industry.regulations.map(r => (
                <div key={r.name} className="p-4 rounded border border-border bg-secondary/10">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="mono text-xs font-bold" style={{ color: industry.color }}>{r.name}</span>
                    <span className="mono text-[9px] text-muted-foreground/60 uppercase tracking-wider">Deadline: {r.deadline}</span>
                  </div>
                  <div className="text-muted-foreground text-xs leading-relaxed">{r.requirement}</div>
                </div>
              ))}
            </div>
          )}

          {/* Use cases content */}
          {activeTab === "usecases" && (
            <div className="space-y-4">
              {industry.useCases.map(u => (
                <div key={u.title} className="p-4 rounded border border-border bg-secondary/10">
                  <div className="font-semibold text-foreground text-sm mb-3">{u.title}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-1">Scenario</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">{u.scenario}</div>
                    </div>
                    <div>
                      <div className="mono text-[9px] text-green-500/60 uppercase tracking-widest mb-1">QVault Outcome</div>
                      <div className="text-gray-300 text-xs leading-relaxed">{u.outcome}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QVault value list */}
          <div className="rounded border border-border bg-secondary/5 p-4">
            <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3">QVault Value for {industry.shortName}</div>
            <ul className="space-y-1.5">
              {industry.qvaultValue.map(v => (
                <li key={v} className="flex items-start gap-2 text-xs text-gray-300">
                  <span style={{ color: industry.color }} className="shrink-0 mt-0.5">▸</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IndustriesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-orange-500" />
          <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">Industry Use Cases</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Quantum Risk by Sector</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Post-quantum cryptography migration looks different in every industry. The threat landscape, regulatory requirements,
          and operational constraints vary significantly. Below is how QVault applies to each sector's specific reality.
          Click any sector to expand the threat landscape, regulatory mapping, and real-world use cases.
        </p>
      </div>

      {/* Overview grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {INDUSTRIES.map(ind => (
          <div key={ind.id} className="rounded-lg border border-border bg-card p-4 text-center hover:border-opacity-60 transition-colors"
            style={{ borderColor: ind.color + "33" }}>
            <div className="text-3xl mb-2">{ind.icon}</div>
            <div className="font-mono text-xs font-bold" style={{ color: ind.color }}>{ind.shortName}</div>
          </div>
        ))}
      </div>

      {/* Expandable cards */}
      <div className="space-y-3">
        {INDUSTRIES.map(ind => <IndustryCard key={ind.id} industry={ind} />)}
      </div>

      <div className="rounded-lg border border-border bg-card/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-orange-400 font-mono">Note:</span> Regulatory timelines and requirements evolve continuously.
          Organizations should conduct independent legal and compliance review. QVault is not a substitute for qualified
          legal or regulatory counsel. All use cases are illustrative and based on publicly documented threat scenarios.
        </p>
      </div>
    </div>
  );
}

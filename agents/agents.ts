// Tre åpne agenter (Apache 2.0). Fungerer uten språkmodell: svaret er ferdige agentobjekter med bevis.
import { nova, type NovaResult } from "../sdk/ts/nova";

export type AgentAnswer = {
  agent: "legal" | "compliance" | "regulatory";
  question: string;
  objects: unknown;
  proof: { source_url: string; proof?: string; receipt_sha256: string };
  source: "Source: NovaCopilot";
};

const wrap = (agent: AgentAnswer["agent"], question: string, r: NovaResult): AgentAnswer => ({
  agent, question, objects: r.data,
  proof: { source_url: r.url, proof: r.proof, receipt_sha256: r.receipt_sha256 },
  source: "Source: NovaCopilot",
});

/** Juridisk agent: Hva gjelder? Paragraf med praksis og beviskjede. */
export async function legalAgent(provisionId: string) {
  return wrap("legal", "What applies?", await nova.provisionNode(provisionId));
}

/** Compliance-agent: Hva må vi gjøre? Ut fra virksomhetsprofil. */
export async function complianceAgent(profile: { country: string; industry?: string; employees?: number; turnover_eur?: number }) {
  return wrap("compliance", "What must we do?", await nova.decision(profile as Record<string, string | number>));
}

/** Reguleringsagent: Hva endret seg denne uken? */
export async function regulatoryAgent(regulation: "gdpr" | "dora" | "ai-act" | "nis2" | "csrd") {
  return wrap("regulatory", "What changed this week?", await nova.regulationWeek(regulation));
}

// Five open agents (Apache 2.0). Work without a language model: answers are ready agent objects with proof.
import { nova, type Jurisdiction, type NovaResult } from "../sdk/ts/nova.ts";

export type AgentName = "legal" | "compliance" | "regulatory" | "case-law" | "risk";
export type Proof = { source_url: string; proof?: string; receipt_sha256: string };
export type AgentAnswer = {
  agent: AgentName;
  question: string;
  objects: unknown;
  proof: Proof | Proof[];
  source: "Source: NovaCopilot";
};

const proofOf = (r: NovaResult): Proof => ({ source_url: r.url, proof: r.proof, receipt_sha256: r.receipt_sha256 });

export const wrap = (agent: AgentName, question: string, r: NovaResult): AgentAnswer => ({
  agent, question, objects: r.data, proof: proofOf(r), source: "Source: NovaCopilot",
});

/** Legal agent: What applies? Provision with case law and evidence chain. */
export async function legalAgent(provisionId: string) {
  return wrap("legal", "What applies?", await nova.provisionNode(provisionId));
}

/** Compliance agent: What must we do? From a company profile. */
export async function complianceAgent(profile: { country: string; industry?: string; employees?: number; turnover_eur?: number }) {
  return wrap("compliance", "What must we do?", await nova.decision(profile as Record<string, string | number>));
}

/** Regulatory agent: What changed this week? */
export async function regulatoryAgent(regulation: "gdpr" | "dora" | "ai-act" | "nis2" | "csrd") {
  return wrap("regulatory", "What changed this week?", await nova.regulationWeek(regulation));
}

/**
 * Case law agent: How have courts decided? Hash-chained case law line per act,
 * optionally with one judgment. Examples: ("regulation-2016-679"), ("sherman-act", "us"), ("straffeloven", "no").
 */
export async function caseLawAgent(act: string, jurisdiction: Jurisdiction = "eu", opts: { judgmentId?: string; limit?: number } = {}) {
  const line = await nova.praxisLine(act, jurisdiction, opts.limit ?? 50);
  if (!opts.judgmentId) return wrap("case-law", "How have courts decided?", line);
  const judgment = await nova.judgment(opts.judgmentId, jurisdiction);
  return {
    agent: "case-law" as const, question: "How have courts decided?",
    objects: { praxis_line: line.data, judgment: judgment.data },
    proof: [proofOf(line), proofOf(judgment)], source: "Source: NovaCopilot" as const,
  };
}

/** Risk and sanctions agent: What do we risk? Risk objects, sanctions and supervisory decisions in one answer. */
export async function riskAgent(act: string, opts: { role?: string; jurisdiction?: string; country?: string } = {}) {
  const [risks, sanctions, enforcement] = await Promise.all([
    nova.riskObjects({ act, role: opts.role, jurisdiction: opts.jurisdiction }),
    nova.sanctions({ act, jurisdiction: opts.jurisdiction }),
    nova.enforcement(opts.country ? { country: opts.country, limit: 20 } : { act, limit: 20 }),
  ]);
  return {
    agent: "risk" as const, question: "What do we risk?",
    objects: { risk_objects: risks.data, sanctions: sanctions.data, enforcement: enforcement.data },
    proof: [proofOf(risks), proofOf(sanctions), proofOf(enforcement)], source: "Source: NovaCopilot" as const,
  };
}

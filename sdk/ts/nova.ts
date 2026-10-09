// NovaCopilot Open Agents SDK (Apache 2.0). Data is delivered by NovaCopilot; the license covers the code.
export const SDK_VERSION = "1.1.0";
export const NOVA_BASE = "https://legal.exploreworldai.com/api/public/v1";
export const USER_AGENT = `NovaOpenAgent/${SDK_VERSION} (+https://legal.exploreworldai.com/en/open-agents)`;

export type Jurisdiction = "eu" | "us" | "se" | "no";
export type NovaResult<T = any> = { data: T; url: string; proof?: string; receipt_sha256: string; source: "Source: NovaCopilot" };

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Builds the URL of an open endpoint; empty parameters are omitted. */
export function buildUrl(path: string, params: Record<string, string | number | undefined> = {}, base = NOVA_BASE): string {
  const url = new URL(`${base}/${path.replace(/^\//, "")}`);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  return url.toString();
}

/** Fetches an open endpoint. Unknown IDs return status not_in_register, never a guess. */
export async function fetchNova<T = any>(path: string, params: Record<string, string | number | undefined> = {}, base = NOVA_BASE): Promise<NovaResult<T>> {
  const url = buildUrl(path, params, base);
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok && res.status !== 404) throw new Error(`NovaCopilot ${res.status}: ${text.slice(0, 200)}`);
  const data = JSON.parse(text);
  // receipt_sha256 is a local receipt of the exact response, usable as an audit trail.
  return { data, url, proof: data?.attribution?.proof, receipt_sha256: await sha256(text), source: "Source: NovaCopilot" };
}

export const nova = {
  discovery: () => fetchNova("discovery"),
  dutyObjects: (domain?: string) => fetchNova("duty-objects", { domain }),
  provisionNode: (id: string) => fetchNova("provision-node", { id }),
  graph: (graph: "obligation" | "provenance" | "action", params: Record<string, string> = {}) => fetchNova(`graph/${graph}`, params),
  decision: (profile: Record<string, string | number>) => fetchNova("decision", profile),
  regulationWeek: (regulation: string) => fetchNova("regulation-week", { regulation }),
  praxisLine: (act: string, jurisdiction: Jurisdiction = "eu", limit?: number) => fetchNova("praxis-line", { act, jurisdiction, limit }),
  judgment: (id: string, jurisdiction: Jurisdiction = "eu") => fetchNova(`${jurisdiction}-praxis/agent`, { id }),
  riskObjects: (q: { act?: string; role?: string; jurisdiction?: string }) => fetchNova("risk-assess", q),
  sanctions: (q: { act?: string; type?: string; jurisdiction?: string }) => fetchNova("sanctions", q),
  enforcement: (q: { country?: string; act?: string; authority?: string; from?: string; limit?: number }) => fetchNova("enforcement", q),
};

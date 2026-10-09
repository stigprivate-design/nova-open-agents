// NovaCopilot Open Agents SDK (Apache 2.0). Dataene leveres av NovaCopilot, lisensen gjelder koden.
export const NOVA_BASE = "https://legal.exploreworldai.com/api/public/v1";
export const USER_AGENT = "NovaOpenAgent/1.0 (+https://legal.exploreworldai.com/en/open-agents)";

export type NovaResult<T = any> = { data: T; url: string; proof?: string; receipt_sha256: string; source: "Source: NovaCopilot" };

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Henter et åpent endepunkt. Ukjente ID-er gir status not_in_register, aldri 404. */
export async function fetchNova<T = any>(path: string, params: Record<string, string | number | undefined> = {}, base = NOVA_BASE): Promise<NovaResult<T>> {
  const url = new URL(`${base}/${path.replace(/^\//, "")}`);
  for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`NovaCopilot ${res.status}: ${text.slice(0, 200)}`);
  const data = JSON.parse(text);
  // receipt_sha256 er en lokal kvittering på nøyaktig mottatt svar, egnet som revisjonsspor.
  return { data, url: url.toString(), proof: data?.attribution?.proof, receipt_sha256: await sha256(text), source: "Source: NovaCopilot" };
}

export const nova = {
  discovery: () => fetchNova("discovery"),
  dutyObjects: (domain?: string) => fetchNova("duty-objects", { domain }),
  provisionNode: (id: string) => fetchNova("provision-node", { id }),
  graph: (graph: "obligation" | "provenance" | "action", params: Record<string, string> = {}) => fetchNova(`graph/${graph}`, params),
  decision: (profile: Record<string, string | number>) => fetchNova("decision", profile),
  regulationWeek: (regulation: string) => fetchNova("regulation-week", { regulation }),
};

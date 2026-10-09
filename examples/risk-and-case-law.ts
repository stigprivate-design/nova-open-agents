// Run: node --experimental-strip-types examples/risk-and-case-law.ts
import { riskAgent, caseLawAgent } from "../index.ts";

const risk = await riskAgent("gdpr");
console.log("GDPR sanctions:", (risk.objects as any).sanctions.count, risk.proof);

const cases = await caseLawAgent("regulation-2016-679", "eu", { limit: 5 });
console.log("GDPR case law line:", cases.proof);

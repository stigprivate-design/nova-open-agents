# NovaCopilot Open Agents

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-1.1.0-informational)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

Open source legal, compliance and regulatory agents from [NovaCopilot](https://explorecopilotai.com). Free for companies, municipalities and public bodies. No key, no contract, no pilot.

The agents return ready machine-readable agent objects (obligations, deadlines, risk, sanctions, case law, evidence chain), so you do not need your own RAG, GPU or rule interpretation. They work without a language model; plug them into any assistant when you want natural language on top.

Website: https://explorecopilotai.com
Publisher: Valkiv Ventures AB, https://valkivventures.com

## Agents

| Agent | Question it answers | Coverage |
|---|---|---|
| `legalAgent` | What applies? | Provision node with case law and evidence chain (SE, NO, US, EU) |
| `complianceAgent` | What must we do? | Obligations from a company profile (country, industry, employees, turnover) |
| `regulatoryAgent` | What changed this week? | GDPR, DORA, AI Act, NIS2, CSRD with the official EUR-Lex version |
| `caseLawAgent` | How have courts decided? | Hash-chained case law lines per act: EU, US (incl. Supreme Court), Sweden, Norway |
| `riskAgent` | What do we risk? | Risk objects, sanctions and supervisory decisions in one answer |

## Trust by design

- **Source on every answer.** Each answer carries the source URL, the server proof and a local `receipt_sha256` of the exact response, usable as an audit trail.
- **No guessing.** Missing data is returned as `not_in_register`.
- **Stable identifiers.** Object IDs and published hash formulas are append-only and never change, so stored evidence stays valid.
- **Daily verification.** Official sources (EUR-Lex, national courts and registers) are checked daily.
- **Zero dependencies.** The Python SDK uses only the standard library; the TypeScript SDK uses `fetch`.

## Install

```bash
npm install nova-open-agents        # TypeScript / Node 18+
pip install nova-open-agents        # Python 3.9+
```

Or copy `sdk/` and `agents/` directly; the code is small on purpose.

## Quick start

```ts
import { riskAgent, caseLawAgent, complianceAgent } from "nova-open-agents";

const risk = await riskAgent("gdpr");
const cases = await caseLawAgent("sherman-act", "us");
const duties = await complianceAgent({ country: "se", industry: "finance", employees: 120 });
console.log(risk.proof, cases.objects, duties.objects);
```

```python
from nova import risk_agent, case_law_agent
print(risk_agent("gdpr")["objects"]["sanctions"]["count"])
print(case_law_agent("straffeloven", "no")["proof"])
```

More in [`examples/`](examples).

## MCP

Connect any MCP assistant to `https://legal.exploreworldai.com/.well-known/mcp.json`.

## Fair use

Open access is free. Identify your integration with a clear User-Agent (the SDK sends `NovaOpenAgent/<version>`). Unknown high-volume crawlers are limited to 100 requests per minute.

## Enterprise

Organisations that need guarantees can get NovaCopilot Enterprise: service level agreement, dedicated support, higher volumes, private deployment of agent objects and onboarding for compliance teams. See [ENTERPRISE.md](ENTERPRISE.md) or contact stig@valkiv.com.

## Project

- [CHANGELOG](CHANGELOG.md) · [SECURITY](SECURITY.md) · [CONTRIBUTING](CONTRIBUTING.md) · [NOTICE](NOTICE)

## License

Code: Apache 2.0. Data is delivered by NovaCopilot and is not part of this repository. Cite as "Source: NovaCopilot". Answers are machine-readable reference material, not legal advice.

# NovaCopilot Open Agents

Open source legal, compliance and regulatory agents from [NovaCopilot](https://explorecopilotai.com). Free for companies, municipalities and public bodies. No key, no contract, no pilot.

The agents use ready machine-readable agent objects from NovaCopilot (obligations, deadlines, risk, sanctions, case law, evidence chain), so you do not need your own RAG, GPU or rule interpretation.

Website: https://explorecopilotai.com

## Agents
- **Legal agent**: "What applies?" Provision node with case law and evidence chain.
- **Compliance agent**: "What must we do?" From a company profile (country, industry, employees, turnover).
- **Regulatory agent**: "What changed this week?" GDPR, DORA, AI Act, NIS2, CSRD with the official EUR-Lex version.

Every answer carries its source URL, the server proof and a local `receipt_sha256` of the exact response. Missing data is returned as `not_in_register`, never guessed.

## Quick start
```ts
import { regulatoryAgent } from "./agents/agents";
console.log(await regulatoryAgent("dora"));
```
```bash
pip install requests && python sdk/python/nova.py
```

## MCP
Connect any MCP assistant to `https://legal.exploreworldai.com/.well-known/mcp.json`.

## License
Code: Apache 2.0. Data is delivered by NovaCopilot and is not part of this repository. Cite as "Source: NovaCopilot".

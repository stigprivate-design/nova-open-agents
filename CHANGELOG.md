# Changelog

Follows [Semantic Versioning](https://semver.org).

## 1.2.0 (2026-10-09)
- Regulatory agent now covers ten EU acts: GDPR, DORA, AI Act, NIS2, CSRD, eIDAS, MiCA, DSA, Data Act and AMLR, each with Official Journal dates and the current consolidated EUR-Lex version.
- Fix: the regulatory agent now sends the correct parameter, so it returns the weekly overview for the chosen act.
- Developer documentation site: https://stigprivate-design.github.io/nova-open-agents-docs/

## 1.1.0 (2026-10-09)
- New `caseLawAgent`: hash-chained case law lines for EU, US, Sweden and Norway, optionally with a single judgment.
- New `riskAgent`: risk objects, sanctions and supervisory decisions in one answer.
- npm and PyPI packaging and offline tests.
- Python SDK now has zero dependencies.
- `not_in_register` answers are returned as data instead of errors.

## 1.0.0 (2026-10-08)
- First release: `legalAgent`, `complianceAgent`, `regulatoryAgent`, TypeScript and Python SDK, MCP.

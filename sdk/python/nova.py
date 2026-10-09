# NovaCopilot Open Agents SDK (Apache 2.0). Data is delivered by NovaCopilot; the license covers the code.
# No dependencies beyond the Python standard library.
import hashlib, json, urllib.error, urllib.parse, urllib.request

__version__ = "1.2.0"
NOVA_BASE = "https://legal.exploreworldai.com/api/public/v1"
USER_AGENT = f"NovaOpenAgent/{__version__} (+https://legal.exploreworldai.com/en/open-agents)"
SOURCE = "Source: NovaCopilot"
REGULATIONS = ("gdpr", "dora", "ai-act", "nis2", "csrd", "eidas", "mica", "dsa", "data-act", "amlr")


def build_url(path, **params):
    q = urllib.parse.urlencode({k: v for k, v in params.items() if v not in (None, "")})
    return f"{NOVA_BASE}/{path.lstrip('/')}" + (f"?{q}" if q else "")


def fetch_nova(path, **params):
    url = build_url(path, **params)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            body = r.read()
    except urllib.error.HTTPError as e:
        if e.code != 404:  # 404 carries not_in_register, never a guess
            raise
        body = e.read()
    data = json.loads(body)
    return {"data": data, "url": url, "proof": (data.get("attribution") or {}).get("proof"),
            "receipt_sha256": hashlib.sha256(body).hexdigest(), "source": SOURCE}


def _proof(r):
    return {"source_url": r["url"], "proof": r["proof"], "receipt_sha256": r["receipt_sha256"]}


def _answer(agent, question, objects, proofs):
    return {"agent": agent, "question": question, "objects": objects,
            "proof": proofs[0] if len(proofs) == 1 else proofs, "source": SOURCE}


def legal_agent(provision_id):
    r = fetch_nova("provision-node", id=provision_id)
    return _answer("legal", "What applies?", r["data"], [_proof(r)])


def compliance_agent(country, industry=None, employees=None, turnover_eur=None):
    r = fetch_nova("decision", country=country, industry=industry, employees=employees, turnover_eur=turnover_eur)
    return _answer("compliance", "What must we do?", r["data"], [_proof(r)])


def regulatory_agent(regulation):
    r = fetch_nova("regulation-week", reg=regulation)
    return _answer("regulatory", "What changed this week?", r["data"], [_proof(r)])


def case_law_agent(act, jurisdiction="eu", judgment_id=None, limit=50):
    line = fetch_nova("praxis-line", act=act, jurisdiction=jurisdiction, limit=limit)
    if not judgment_id:
        return _answer("case-law", "How have courts decided?", line["data"], [_proof(line)])
    j = fetch_nova(f"{jurisdiction}-praxis/agent", id=judgment_id)
    return _answer("case-law", "How have courts decided?",
                   {"praxis_line": line["data"], "judgment": j["data"]}, [_proof(line), _proof(j)])


def risk_agent(act, role=None, jurisdiction=None, country=None):
    risks = fetch_nova("risk-assess", act=act, role=role, jurisdiction=jurisdiction)
    sanctions = fetch_nova("sanctions", act=act, jurisdiction=jurisdiction)
    enf = fetch_nova("enforcement", country=country, limit=20) if country else fetch_nova("enforcement", act=act, limit=20)
    return _answer("risk", "What do we risk?",
                   {"risk_objects": risks["data"], "sanctions": sanctions["data"], "enforcement": enf["data"]},
                   [_proof(risks), _proof(sanctions), _proof(enf)])


if __name__ == "__main__":
    print(json.dumps(regulatory_agent("mica")["objects"].get("official_text"), indent=2))

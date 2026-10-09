# NovaCopilot Open Agents SDK (Apache 2.0). Dataene leveres av NovaCopilot, lisensen gjelder koden.
import hashlib, json, urllib.parse, requests

NOVA_BASE = "https://legal.exploreworldai.com/api/public/v1"
USER_AGENT = "NovaOpenAgent/1.0 (+https://legal.exploreworldai.com/en/open-agents)"

def fetch_nova(path, **params):
    q = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    url = f"{NOVA_BASE}/{path.lstrip('/')}" + (f"?{q}" if q else "")
    r = requests.get(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}, timeout=60)
    r.raise_for_status()
    data = json.loads(r.text)
    return {"data": data, "url": url, "proof": (data.get("attribution") or {}).get("proof"),
            "receipt_sha256": hashlib.sha256(r.content).hexdigest(), "source": "Source: NovaCopilot"}

def legal_agent(provision_id): return fetch_nova("provision-node", id=provision_id)
def compliance_agent(country, industry=None, employees=None): return fetch_nova("decision", country=country, industry=industry, employees=employees)
def regulatory_agent(regulation): return fetch_nova("regulation-week", regulation=regulation)

if __name__ == "__main__":
    print(json.dumps(regulatory_agent("dora")["data"].get("official_text"), indent=2))

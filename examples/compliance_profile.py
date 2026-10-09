# Run: python examples/compliance_profile.py
import json, sys
sys.path.insert(0, "sdk/python")
from nova import compliance_agent, risk_agent

duties = compliance_agent("se", industry="finance", employees=120)
print(json.dumps(duties["proof"], indent=2))
print("DORA sanctions:", risk_agent("dora")["objects"]["sanctions"].get("count"))

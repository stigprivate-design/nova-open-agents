# nova-open-agents (Python)

Five open agents on NovaCopilot agent objects. No dependencies, no key.

```python
from nova import risk_agent, case_law_agent
print(risk_agent("gdpr")["objects"]["sanctions"]["count"])
print(case_law_agent("regulation-2016-679")["proof"])
```

Full documentation: https://github.com/stigprivate-design/nova-open-agents

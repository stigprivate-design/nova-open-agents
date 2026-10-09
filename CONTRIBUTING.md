# Contributing

Contributions to the agents and SDKs are welcome under Apache 2.0.

1. Open an issue describing the change.
2. Keep agents deterministic: no guessing, always return the source and receipt.
3. Run `npm test` and `python -m unittest discover -s sdk/python`.
4. Add a line to CHANGELOG.md.

The data and register behind the endpoints are not part of this repository. Report data errors to stig@valkiv.com.

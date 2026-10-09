# Offline tests: no network calls.
import unittest
import nova


class TestNova(unittest.TestCase):
    def test_build_url_skips_empty(self):
        self.assertEqual(nova.build_url("sanctions", act="gdpr", type=None, jurisdiction=""), f"{nova.NOVA_BASE}/sanctions?act=gdpr")

    def test_answer_single_proof(self):
        a = nova._answer("risk", "q", {}, [{"source_url": "u"}])
        self.assertEqual(a["proof"], {"source_url": "u"})
        self.assertEqual(a["source"], "Source: NovaCopilot")


if __name__ == "__main__":
    unittest.main()

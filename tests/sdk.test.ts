// Offline tests: no network calls.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUrl, sha256, NOVA_BASE } from "../sdk/ts/nova.ts";

test("buildUrl omits empty parameters", () => {
  assert.equal(buildUrl("sanctions", { act: "gdpr", type: undefined, jurisdiction: "" }), `${NOVA_BASE}/sanctions?act=gdpr`);
});

test("buildUrl builds case law agent per jurisdiction", () => {
  assert.equal(buildUrl("no-praxis/agent", { id: "x" }), `${NOVA_BASE}/no-praxis/agent?id=x`);
});

test("sha256 gives known receipt", async () => {
  assert.equal(await sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

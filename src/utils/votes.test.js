import assert from "node:assert/strict";
import test from "node:test";
import { getVoteUpdate } from "./votes.js";

test("counts a new vote and switching votes by the right API delta", () => {
  assert.deepEqual(getVoteUpdate(0, 1), { nextChange: 1, delta: 1 });
  assert.deepEqual(getVoteUpdate(-1, 1), { nextChange: 1, delta: 2 });
  assert.deepEqual(getVoteUpdate(1, -1), { nextChange: -1, delta: -2 });
});

test("allows removing an existing vote and rejects invalid state", () => {
  assert.deepEqual(getVoteUpdate(1, 1), { nextChange: 0, delta: -1 });
  assert.throws(() => getVoteUpdate(2, 1), /Vote changes/);
});

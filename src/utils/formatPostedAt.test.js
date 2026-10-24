import assert from "node:assert/strict";
import test from "node:test";
import { formatPostedAt } from "./formatPostedAt.js";

test("posted times are relative for the first day and dates afterwards", () => {
  const now = Date.parse("2026-10-31T12:00:00Z");
  assert.equal(formatPostedAt("2026-10-31T11:59:00Z", now), "1m ago");
  assert.equal(formatPostedAt("2026-10-31T11:00:00Z", now), "1h ago");
  assert.equal(formatPostedAt("2026-10-30T11:59:00Z", now), "30 Oct 2026");
  assert.equal(formatPostedAt("not a date", now), "Date unavailable");
});

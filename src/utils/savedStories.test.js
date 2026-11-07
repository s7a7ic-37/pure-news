import test from "node:test";
import assert from "node:assert/strict";
import { parseSavedStories, setStorySaved, ReadingListError } from "./savedStories.js";

const story = {article_id: 34, title: "Żółć — a saved story", saved_at: "2026-11-07T17:00:00Z"};

test("reading list stores only public link metadata and preserves earlier entries", () => {
  assert.deepEqual(parseSavedStories(null), []);
  const original = [story];
  const saved = setStorySaved(original, {article_id: 1, title: "Another story", body: "not stored", votes: 99}, true);
  assert.equal(saved[0].article_id, 1);
  assert.deepEqual(Object.keys(saved[0]), ["article_id", "title", "saved_at"]);
  assert.ok(Number.isFinite(Date.parse(saved[0].saved_at)));
  assert.deepEqual(original, [story]);
  assert.deepEqual(setStorySaved(saved, {article_id: 1}, false), original);
  assert.deepEqual(parseSavedStories(JSON.stringify([{...story, body: "discarded"}])), original);
});

test("corrupted lists and invalid entries are rejected rather than silently overwritten", () => {
  for (const value of ["bad JSON", "null", "{}", JSON.stringify([story, story]),
    JSON.stringify([{...story, article_id: "34"}]), JSON.stringify([{...story, title: ""}]),
    JSON.stringify([{...story, saved_at: "bad date"}]), JSON.stringify([null])]) {
    assert.throws(() => parseSavedStories(value), ReadingListError);
  }
  assert.throws(() => setStorySaved([], {article_id: -1, title: "Invalid"}, true), ReadingListError);
  assert.throws(() => setStorySaved([], {article_id: 1, title: ""}, true), ReadingListError);
});

test("a full reading list remains removable and a new story cannot evict saved links", () => {
  const full = Array.from({length: 50}, (_, index) => ({...story, article_id: index + 1}));
  assert.equal(parseSavedStories(JSON.stringify(full)).length, 50);
  assert.throws(() => setStorySaved(full, {article_id: 51, title: "New"}, true), /Remove one first/);
  assert.equal(full.length, 50);
  assert.equal(setStorySaved(full, {article_id: 1}, false).length, 49);
  assert.deepEqual(setStorySaved(full, {article_id: 1}, true), full);
  assert.throws(() => parseSavedStories(JSON.stringify([...full, {...story, article_id: 51}])), ReadingListError);
});

test("repeated save or remove intent cannot invert the latest stored state", () => {
  assert.deepEqual(setStorySaved([story], story, true), [story]);
  assert.deepEqual(setStorySaved([], story, false), []);
});

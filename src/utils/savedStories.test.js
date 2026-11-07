import test from "node:test";
import assert from "node:assert/strict";
import { parseSavedStories, toggleSavedStory, ReadingListError } from "./savedStories.js";

const story = {article_id: 34, title: "Żółć — a saved story", saved_at: "2026-11-07T17:00:00Z"};

test("reading list stores only public link metadata and toggles without mutating earlier entries", () => {
  assert.deepEqual(parseSavedStories(null), []);
  const original = [story];
  const saved = toggleSavedStory(original, {article_id: 1, title: "Another story", body: "not stored", votes: 99});
  assert.equal(saved[0].article_id, 1);
  assert.deepEqual(Object.keys(saved[0]), ["article_id", "title", "saved_at"]);
  assert.ok(Number.isFinite(Date.parse(saved[0].saved_at)));
  assert.deepEqual(original, [story]);
  assert.deepEqual(toggleSavedStory(saved, {article_id: 1}), original);
  assert.deepEqual(parseSavedStories(JSON.stringify([{...story, body: "discarded"}])), original);
});

test("corrupted lists and invalid entries are rejected rather than silently overwritten", () => {
  for (const value of ["bad JSON", "null", "{}", JSON.stringify([story, story]),
    JSON.stringify([{...story, article_id: "34"}]), JSON.stringify([{...story, title: ""}]),
    JSON.stringify([{...story, saved_at: "bad date"}]), JSON.stringify([null])]) {
    assert.throws(() => parseSavedStories(value), ReadingListError);
  }
  assert.throws(() => toggleSavedStory([], {article_id: -1, title: "Invalid"}), ReadingListError);
  assert.throws(() => toggleSavedStory([], {article_id: 1, title: ""}), ReadingListError);
});

test("a full reading list remains removable and a new story cannot evict saved links", () => {
  const full = Array.from({length: 50}, (_, index) => ({...story, article_id: index + 1}));
  assert.equal(parseSavedStories(JSON.stringify(full)).length, 50);
  assert.throws(() => toggleSavedStory(full, {article_id: 51, title: "New"}), /Remove one first/);
  assert.equal(full.length, 50);
  assert.equal(toggleSavedStory(full, {article_id: 1}).length, 49);
  assert.throws(() => parseSavedStories(JSON.stringify([...full, {...story, article_id: 51}])), ReadingListError);
});

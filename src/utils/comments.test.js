import test from "node:test";
import assert from "node:assert/strict";
import { isCommentValid } from "./comments.js";

test("comments accept Unicode text and enforce the API's length bounds", () => {
  assert.equal(isCommentValid("Świetny artykuł"), true);
  assert.equal(isCommentValid("Good point!"), true);
  for (const text of ["", "   ", "  ab  ", "a".repeat(2001)]) {
    assert.equal(isCommentValid(text), false);
  }
  assert.equal(isCommentValid("a".repeat(2000)), true);
});

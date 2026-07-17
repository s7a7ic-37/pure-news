export function getVoteUpdate(currentChange, direction) {
  if (![0, -1, 1].includes(currentChange) || ![-1, 1].includes(direction)) {
    throw new Error("Vote changes must be -1, 0, or 1.");
  }
  const nextChange = currentChange === direction ? 0 : direction;
  return { nextChange, delta: nextChange - currentChange };
}

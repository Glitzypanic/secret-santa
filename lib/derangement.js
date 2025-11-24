// Simple derangement algorithm: shuffle until no element maps to itself
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function derangementIndices(n) {
  if (n <= 1) return null;
  let attempts = 0;
  while (attempts < 5000) {
    const indices = shuffle(Array.from({ length: n }, (_, i) => i));
    let ok = true;
    for (let i = 0; i < n; i++) {
      if (indices[i] === i) {
        ok = false;
        break;
      }
    }
    if (ok) return indices;
    attempts++;
  }
  return null;
}

export default derangementIndices;

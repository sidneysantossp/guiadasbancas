const LOWERCASE_CONNECTORS = new Set([
  "a",
  "as",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
]);

export function formatBancaName(value: string): string {
  const input = String(value || "").trim();
  if (!input) return "";

  return input
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && LOWERCASE_CONNECTORS.has(word)) {
        return word;
      }

      if (/^\d+$/.test(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

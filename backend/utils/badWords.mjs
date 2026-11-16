// words we don't allow in feedback, add more here if we need them
const BAD_WORDS = [
  "fuck", "fucking", "shit", "shite", "bitch", "bastard",
  "asshole", "dickhead", "prick", "wanker", "idiot", "moron",
];

// true if the text has any bad word in it (whole words only, any case)
export function hasBadWords(text) {
  const words = String(text ?? "").toLowerCase().match(/[a-z]+/g) || [];
  return words.some(word => BAD_WORDS.includes(word));
}
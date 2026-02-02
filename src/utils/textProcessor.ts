export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function splitIntoWords(text: string): string[] {
  return cleanText(text).split(' ').filter(word => word.length > 0);
}

export function getRandomTextSegment(text: string, wordCount: number = 100): string {
  const words = splitIntoWords(text);
  if (words.length <= wordCount) {
    return words.join(' ');
  }

  const maxStart = words.length - wordCount;
  const startIndex = Math.floor(Math.random() * maxStart);
  return words.slice(startIndex, startIndex + wordCount).join(' ');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

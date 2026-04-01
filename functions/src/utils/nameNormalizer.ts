const TERM_MAP: Record<string, string> = {
  'etb': 'elite trainer box',
  'bb': 'booster box',
  'pokémon': 'pokemon',
  'pokèmon': 'pokemon',
  'sv': 'scarlet violet',
  's&v': 'scarlet violet',
  'swsh': 'sword shield',
  's&m': 'sun moon',
  'sm': 'sun moon',
  'xy': 'xy',
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  booster_box: ['booster box', 'booster display', 'display box', '36 pack', '36 booster'],
  etb: ['elite trainer box', 'etb', 'elite-trainer-box'],
  tin: [' tin ', ' tin,', '-tin ', ' tins ', 'metallilaatikko', 'stacking tin'],
  collection: ['collection', 'premium collection', 'kokoelma', 'premium box', 'collector chest'],
  blister: ['blister', 'blister pack', '3-pack', '3 pack', 'sleeved booster', 'checklane'],
  bundle: ['bundle', 'booster bundle', '6 pack', '6-pack'],
  special: ['ultra premium', 'upc', 'special collection', 'trainer gallery', 'battle deck',
            'league battle', 'tech sticker', 'poster collection', 'surprise box', 'mystery box',
            'binder', 'playmat'],
};

export function normalizeName(name: string): string {
  let normalized = name.toLowerCase().trim();
  normalized = normalized.replace(/[®™©]/g, '');
  normalized = normalized.replace(/[^\w\s&-]/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ').trim();

  for (const [abbr, full] of Object.entries(TERM_MAP)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  }

  return normalized;
}

export function detectCategory(name: string): string {
  const lower = ` ${name.toLowerCase()} `;

  // Check specific categories in priority order
  if (CATEGORY_KEYWORDS.booster_box.some((kw) => lower.includes(kw))) return 'booster_box';
  if (CATEGORY_KEYWORDS.etb.some((kw) => lower.includes(kw))) return 'etb';
  if (CATEGORY_KEYWORDS.collection.some((kw) => lower.includes(kw))) return 'collection';
  if (CATEGORY_KEYWORDS.bundle.some((kw) => lower.includes(kw))) return 'bundle';
  if (CATEGORY_KEYWORDS.tin.some((kw) => lower.includes(kw))) return 'tin';
  if (CATEGORY_KEYWORDS.blister.some((kw) => lower.includes(kw))) return 'blister';
  if (CATEGORY_KEYWORDS.special.some((kw) => lower.includes(kw))) return 'special';

  // Fallback: single boosters that aren't booster boxes
  if (lower.includes('booster') && !lower.includes('booster box')) return 'blister';

  return 'special';
}

export function extractSetName(name: string): string {
  const setPatterns = [
    /scarlet\s*&?\s*violet\s*[-–—:]\s*([^-–—(]+)/i,
    /sword\s*&?\s*shield\s*[-–—:]\s*([^-–—(]+)/i,
    /sun\s*&?\s*moon\s*[-–—:]\s*([^-–—(]+)/i,
    /xy\s*[-–—:]\s*([^-–—(]+)/i,
  ];

  for (const pattern of setPatterns) {
    const match = name.match(pattern);
    if (match) return match[1].trim();
  }

  return '';
}

/**
 * Levenshtein distance for fuzzy matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function similarityScore(a: string, b: string): number {
  const normA = normalizeName(a);
  const normB = normalizeName(b);
  const maxLen = Math.max(normA.length, normB.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(normA, normB) / maxLen;
}

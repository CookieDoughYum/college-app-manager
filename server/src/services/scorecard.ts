import { getConfig } from './config.js';

const SCORECARD_BASE = 'https://api.data.gov/ed/collegescorecard/v1/fields-of-study.json';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const MAJOR_TO_CIP: Record<string, string> = {
  'Computer Science':        '11.07',
  'Information Technology':  '11.01',
  'Electrical Engineering':  '14.10',
  'Mechanical Engineering':  '14.19',
  'Civil Engineering':       '14.08',
  'Biomedical Engineering':  '14.05',
  'Business Administration': '52.02',
  'Finance':                 '52.08',
  'Accounting':              '52.03',
  'Marketing':               '52.14',
  'Economics':               '45.06',
  'Nursing':                 '51.38',
  'Biology':                 '26.01',
  'Biochemistry':            '26.02',
  'Pre-Med / Medicine':      '51.12',
  'Psychology':              '42.01',
  'Political Science':       '45.10',
  'Sociology':               '45.11',
  'Communications':          '09.01',
  'Journalism':              '09.04',
  'Education':               '13.12',
  'Social Work':             '44.07',
  'Architecture':            '04.02',
  'Graphic Design':          '50.04',
  'Fine Arts':               '50.07',
  'Philosophy':              '38.01',
  'History':                 '54.01',
  'English':                 '23.01',
};

let cachedSalaries: Record<string, number> | null = null;
let cacheTimestamp = 0;

function computeMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function extractEarnings(result: Record<string, unknown>): number | null {
  // College Scorecard uses nested paths; try known variants
  const earnings = result?.earnings as Record<string, unknown> | undefined;
  if (!earnings) return null;

  const candidates: unknown[] = [
    earnings.median_earnings,
    (earnings.highest as Record<string, unknown> | undefined)?.['4_yr'],
    (earnings.highest as Record<string, unknown> | undefined)?.['2_yr'],
    (earnings['4yr_after_completion'] as Record<string, unknown> | undefined)?.median_earnings,
    (earnings['2yr_after_completion'] as Record<string, unknown> | undefined)?.median_earnings,
  ];

  for (const val of candidates) {
    if (typeof val === 'number' && val > 0) return val;
    // Some nested objects have overall_median_earnings
    if (val && typeof val === 'object') {
      const inner = (val as Record<string, unknown>).overall_median_earnings;
      if (typeof inner === 'number' && inner > 0) return inner;
    }
  }
  return null;
}

async function fetchSalaryForCip(cip: string, apiKey: string): Promise<number | null> {
  const params = new URLSearchParams({
    api_key: apiKey,
    cip_code: cip,
    'credential.level': '3', // bachelor's degree
    fields: [
      'cip_code',
      'title',
      'earnings.median_earnings',
      'earnings.highest.4_yr.overall_median_earnings',
      'earnings.highest.2_yr.overall_median_earnings',
      'earnings.4yr_after_completion.median_earnings',
      'earnings.2yr_after_completion.median_earnings',
    ].join(','),
    per_page: '100',
  });

  const res = await fetch(`${SCORECARD_BASE}?${params}`, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    console.warn(`[scorecard] HTTP ${res.status} for CIP ${cip}`);
    return null;
  }

  const data = await res.json() as { results?: Record<string, unknown>[] };
  const values = (data.results ?? [])
    .map(extractEarnings)
    .filter((v): v is number => v !== null);

  return values.length > 0 ? computeMedian(values) : null;
}

/**
 * Returns a map of major name → median annual earnings (dollars) sourced from
 * the College Scorecard API (U.S. Dept. of Education). Results are cached for
 * 24 hours. Returns an empty object if the API key is missing or calls fail.
 */
export async function getMajorSalaries(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedSalaries && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSalaries;
  }

  const apiKey = getConfig('COLLEGE_SCORECARD_API_KEY');
  if (!apiKey) {
    console.warn('[scorecard] COLLEGE_SCORECARD_API_KEY not set — salary lookup skipped');
    return {};
  }

  const result: Record<string, number> = {};

  await Promise.all(
    Object.entries(MAJOR_TO_CIP).map(async ([major, cip]) => {
      try {
        const salary = await fetchSalaryForCip(cip, apiKey);
        if (salary !== null) result[major] = salary;
      } catch (err) {
        console.warn(`[scorecard] Failed to fetch ${major} (${cip}):`, err);
      }
    })
  );

  if (Object.keys(result).length > 0) {
    cachedSalaries = result;
    cacheTimestamp = now;
  }

  return result;
}

export async function fetchPageText(url: string, timeoutMs = 10000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return '';
    const html = await res.text();

    // Try to extract focused content regions first (essay pages have content in <main> or <article>)
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    const contentMatch = html.match(/<div[^>]+(?:class|id)="[^"]*(?:content|entry|post|page-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const targetHtml = mainMatch?.[1] ?? articleMatch?.[1] ?? contentMatch?.[1] ?? html;

    const stripHtml = (src: string) => src
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{3,}/g, '\n')
      .trim();

    const text = stripHtml(targetHtml);
    return text.slice(0, 7000);
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

// Known domain overrides for universities with non-obvious .edu domains
const KNOWN_DOMAINS: Record<string, string> = {
  'mit': 'mit.edu',
  'massachusetts institute of technology': 'mit.edu',
  'uc berkeley': 'berkeley.edu',
  'university of california berkeley': 'berkeley.edu',
  'cal berkeley': 'berkeley.edu',
  'ucla': 'ucla.edu',
  'university of california los angeles': 'ucla.edu',
  'uc san diego': 'ucsd.edu',
  'university of california san diego': 'ucsd.edu',
  'uc davis': 'ucdavis.edu',
  'uc santa barbara': 'ucsb.edu',
  'uc irvine': 'uci.edu',
  'uc santa cruz': 'ucsc.edu',
  'penn': 'upenn.edu',
  'university of pennsylvania': 'upenn.edu',
  'usc': 'usc.edu',
  'university of southern california': 'usc.edu',
  'carnegie mellon': 'cmu.edu',
  'carnegie mellon university': 'cmu.edu',
  'georgia tech': 'gatech.edu',
  'georgia institute of technology': 'gatech.edu',
  'university of michigan': 'umich.edu',
  'michigan': 'umich.edu',
  'nyu': 'nyu.edu',
  'new york university': 'nyu.edu',
  'boston university': 'bu.edu',
  'boston college': 'bc.edu',
  'virginia tech': 'vt.edu',
  'ohio state': 'osu.edu',
  'ohio state university': 'osu.edu',
  'ut austin': 'utexas.edu',
  'university of texas': 'utexas.edu',
  'university of texas austin': 'utexas.edu',
  'university of washington': 'uw.edu',
  'university of wisconsin': 'wisc.edu',
  'university of wisconsin madison': 'wisc.edu',
  'uw madison': 'wisc.edu',
  'unc': 'unc.edu',
  'university of north carolina': 'unc.edu',
  'william and mary': 'wm.edu',
  'college of william and mary': 'wm.edu',
  'notre dame': 'nd.edu',
  'university of notre dame': 'nd.edu',
  'wake forest': 'wfu.edu',
  'wake forest university': 'wfu.edu',
  'university of virginia': 'virginia.edu',
  'uva': 'virginia.edu',
  'byu': 'byu.edu',
  'brigham young university': 'byu.edu',
  'university of florida': 'ufl.edu',
  'university of illinois': 'illinois.edu',
  'purdue': 'purdue.edu',
  'purdue university': 'purdue.edu',
  'rutgers': 'rutgers.edu',
  'rutgers university': 'rutgers.edu',
  'penn state': 'psu.edu',
  'pennsylvania state university': 'psu.edu',
  'university of maryland': 'umd.edu',
  'texas a&m': 'tamu.edu',
  'texas a and m': 'tamu.edu',
  'university of minnesota': 'umn.edu',
  'colorado': 'colorado.edu',
  'university of colorado': 'colorado.edu',
  'cu boulder': 'colorado.edu',
};

// Known PrepScholar essay guide slugs for common schools
const PREPSCHOLAR_SLUGS: Record<string, string> = {
  'stanford': 'stanford-supplemental-essays',
  'stanford university': 'stanford-supplemental-essays',
  'mit': 'mit-supplemental-essays',
  'massachusetts institute of technology': 'mit-supplemental-essays',
  'harvard': 'harvard-supplemental-essays',
  'harvard university': 'harvard-supplemental-essays',
  'yale': 'yale-supplemental-essays',
  'yale university': 'yale-supplemental-essays',
  'princeton': 'princeton-supplemental-essays',
  'princeton university': 'princeton-supplemental-essays',
  'columbia': 'columbia-supplemental-essays',
  'columbia university': 'columbia-supplemental-essays',
  'upenn': 'upenn-supplemental-essays',
  'penn': 'upenn-supplemental-essays',
  'university of pennsylvania': 'upenn-supplemental-essays',
  'cornell': 'cornell-supplemental-essays',
  'cornell university': 'cornell-supplemental-essays',
  'dartmouth': 'dartmouth-supplemental-essays',
  'dartmouth college': 'dartmouth-supplemental-essays',
  'brown': 'brown-supplemental-essays',
  'brown university': 'brown-supplemental-essays',
  'duke': 'duke-supplemental-essays',
  'duke university': 'duke-supplemental-essays',
  'vanderbilt': 'vanderbilt-supplemental-essays',
  'vanderbilt university': 'vanderbilt-supplemental-essays',
  'georgetown': 'georgetown-supplemental-essays',
  'georgetown university': 'georgetown-supplemental-essays',
  'northwestern': 'northwestern-supplemental-essays',
  'northwestern university': 'northwestern-supplemental-essays',
  'notre dame': 'notre-dame-supplemental-essays',
  'university of notre dame': 'notre-dame-supplemental-essays',
  'carnegie mellon': 'carnegie-mellon-supplemental-essays',
  'carnegie mellon university': 'carnegie-mellon-supplemental-essays',
  'emory': 'emory-supplemental-essays',
  'emory university': 'emory-supplemental-essays',
  'boston college': 'boston-college-supplemental-essays',
  'wake forest': 'wake-forest-supplemental-essays',
  'nyu': 'nyu-supplemental-essays',
  'new york university': 'nyu-supplemental-essays',
  'usc': 'usc-supplemental-essays',
  'university of southern california': 'usc-supplemental-essays',
  'tufts': 'tufts-supplemental-essays',
  'tufts university': 'tufts-supplemental-essays',
  'rice': 'rice-supplemental-essays',
  'rice university': 'rice-supplemental-essays',
  'university of michigan': 'university-of-michigan-supplemental-essays',
  'michigan': 'university-of-michigan-supplemental-essays',
  'umich': 'university-of-michigan-supplemental-essays',
  'uc berkeley': 'uc-berkeley-supplemental-essays',
  'ucla': 'ucla-supplemental-essays',
  'university of virginia': 'university-of-virginia-supplemental-essays',
  'uva': 'university-of-virginia-supplemental-essays',
  'georgia tech': 'georgia-tech-supplemental-essays',
  'university of wisconsin': 'uw-madison-supplemental-essays',
  'university of wisconsin madison': 'uw-madison-supplemental-essays',
  'uw madison': 'uw-madison-supplemental-essays',
  'university of washington': 'university-of-washington-supplemental-essays',
  'university of illinois': 'university-of-illinois-supplemental-essays',
  'university of florida': 'university-of-florida-supplemental-essays',
  'penn state': 'penn-state-supplemental-essays',
  'ohio state': 'ohio-state-supplemental-essays',
  'purdue': 'purdue-supplemental-essays',
  'university of texas': 'ut-austin-supplemental-essays',
  'ut austin': 'ut-austin-supplemental-essays',
};

function normKey(name: string): string {
  return name.toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9\s&]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveDomain(schoolName: string): string | null {
  const key = normKey(schoolName);
  if (KNOWN_DOMAINS[key]) return KNOWN_DOMAINS[key];

  const slug = schoolName.toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/\buniversity\s+of\s+(\w+).*$/, '$1')
    .replace(/\s+university$/i, '')
    .replace(/\s+college$/i, '')
    .replace(/\s+institute\s+of\s+technology$/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

  return slug ? `${slug}.edu` : null;
}

// Build third-party essay guide URLs for a school
function buildEssayGuideUrls(schoolName: string): string[] {
  const key = normKey(schoolName);
  const urls: string[] = [];

  // PrepScholar essay guides (server-rendered, reliable content)
  const psSlug = PREPSCHOLAR_SLUGS[key];
  if (psSlug) {
    urls.push(`https://blog.prepscholar.com/${psSlug}`);
  } else {
    // Try to derive a PrepScholar slug from the name
    const derived = schoolName.toLowerCase()
      .replace(/[-_]/g, ' ')
      .replace(/^the\s+/i, '')
      .replace(/\buniversity\s+of\s+/i, '')
      .replace(/\s+university$/i, '')
      .replace(/\s+college$/i, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s+/g, '-');
    if (derived) {
      urls.push(`https://blog.prepscholar.com/${derived}-supplemental-essays`);
      urls.push(`https://blog.prepscholar.com/${derived}-essays`);
    }
  }

  // CollegeVine essay FAQ pages
  const cvSlug = schoolName.toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
  if (cvSlug) {
    urls.push(`https://www.collegevine.com/faq/essays/${cvSlug}`);
  }

  return urls;
}

const ESSAY_KEYWORDS = ['essay', 'prompt', 'supplement', 'writing', 'word limit', 'words', 'short answer', 'required', 'optional'];

function isEssayContent(text: string): boolean {
  const lower = text.toLowerCase();
  const hits = ESSAY_KEYWORDS.filter(kw => lower.includes(kw)).length;
  return text.length >= 300 && hits >= 2;
}

// Fetch supplemental essay prompts for a university.
// Tries third-party essay guide sites first (PrepScholar, CollegeVine),
// then the university's own admissions pages.
export async function fetchUniversityPage(schoolName: string): Promise<string> {
  const guideUrls = buildEssayGuideUrls(schoolName);
  const domain = deriveDomain(schoolName);

  const admissionsUrls = domain ? [
    `https://admissions.${domain}/apply/essays`,
    `https://admission.${domain}/apply/essays`,
    `https://www.${domain}/admissions/apply/essays`,
    `https://admissions.${domain}/apply`,
    `https://admission.${domain}/apply`,
    `https://www.${domain}/admissions/apply`,
    `https://admissions.${domain}/`,
    `https://admission.${domain}/`,
  ] : [];

  const allCandidates = [...guideUrls, ...admissionsUrls];

  for (const url of allCandidates) {
    try {
      const text = await fetchPageText(url, 8000);
      if (isEssayContent(text)) {
        return text.slice(0, 6000);
      }
    } catch {
      // try next
    }
  }
  return '';
}

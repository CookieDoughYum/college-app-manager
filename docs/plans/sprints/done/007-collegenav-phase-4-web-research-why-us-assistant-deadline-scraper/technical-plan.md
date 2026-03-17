---
status: draft
from-architecture-version: collegenav-006
to-architecture-version: collegenav-007
---

# Sprint 007 Technical Plan

## Architecture Version

- **From version**: `collegenav-006` — Claude API recommendations on 5 screens
- **To version**: `collegenav-007` — Web fetch + Claude on Essays and Deadlines screens

## Architecture Overview

```
server/
  src/
    services/
      webFetch.ts         ← Fetches a URL, strips HTML to plain text
    routes/
      ai.ts               ← Add POST /api/ai/essays/whyus and
                             POST /api/ai/deadlines/scrape

client/
  src/
    pages/screens/
      Essays.tsx          ← Add "Why Us?" input form + result display
      Deadlines.tsx       ← Add "Fetch Deadlines" button + calendar updates

server/
  prisma/
    schema.prisma         ← Add whyUsResults Json to StudentEssays
    migrations/           ← New migration
```

## Component Design

### Component: Prisma Schema — Essays whyUsResults field

**Use Cases**: SUC-001

Add `whyUsResults Json @default("{}")` to `StudentEssays`.

The field stores a map of school name → talking points string so multiple
schools' results can be cached:

```json
{
  "Stanford University": "1. The d.school...\n2. The CS + HCI program...",
  "MIT": "1. UROP research opportunities...\n2. Cross-disciplinary..."
}
```

---

### Component: Web Fetch Service (`server/src/services/webFetch.ts`)

**Use Cases**: SUC-001, SUC-002

```typescript
export async function fetchPageText(url: string, timeoutMs = 10000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'CollegeNav/1.0 (educational research tool)' },
    });
    const html = await res.text();
    // Strip HTML tags, collapse whitespace, truncate to 8000 chars
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);
  } finally {
    clearTimeout(timer);
  }
}
```

Key design decisions:
- Strips `<script>` and `<style>` blocks first (largest noise sources)
- Truncates to 8000 chars to fit within Claude's context window economically
- 10-second timeout prevents blocking the request indefinitely
- Returns empty string on error — callers decide how to handle it

---

### Component: AI Endpoints — Essays and Deadlines (`server/src/routes/ai.ts`)

**Use Cases**: SUC-001, SUC-002

Two new routes added to the existing `ai.ts` router:

#### `POST /api/ai/essays/whyus`

Request body: `{ schoolName: string, url?: string }`

1. If `url` not provided, constructs a default search URL:
   `https://www.google.com/search?q=${encodeURIComponent(schoolName + ' admissions why attend')}`
   (or uses a known pattern like `https://<school>.edu/about`)
2. Calls `fetchPageText(url)`
3. Builds prompt:
   ```
   You are a college admissions counselor.
   A student is writing a "Why Us?" essay for ${schoolName}.
   Here is text from the school's website:

   ${pageText}

   Based on this, list 3–5 specific programs, values, or opportunities
   the student should mention in their essay. Be specific — use actual
   program names and details from the text above.
   Format as a numbered list.
   ```
4. Calls `askClaude(prompt)`
5. Saves result to `StudentEssays.whyUsResults[schoolName]`
6. Returns `{ result: string }`

#### `POST /api/ai/deadlines/scrape`

Request body: `{}` (reads college list from database)

1. Reads `StudentColleges.collegeList` — array of `{ name, url?, type }` objects
2. For each college (sequential, not parallel):
   a. Fetches the admissions page (uses `college.url` if set, otherwise
      `https://www.google.com/search?q=${encodeURIComponent(name + ' application deadlines')}`)
   b. Builds prompt:
      ```
      Extract application deadlines for ${name} from this page text.
      List: Regular Decision deadline, Early Action deadline (if any),
      Early Decision deadline (if any).
      Return as JSON array: [{"type":"RD","date":"November 1"},...]
      If no deadline found, return [].
      Page text: ${pageText}
      ```
   c. Calls `askClaude(prompt)`
   d. Parses JSON response; skips college if parse fails
3. Merges all extracted deadlines into `StudentDeadlines.manualDeadlines`
4. Returns `{ result: string, deadlines: array }`

---

### Component: React Screen Updates

**Use Cases**: SUC-001, SUC-002

#### Essays screen updates

Add below the Google Drive section:

```tsx
const [whyUsSchool, setWhyUsSchool] = useState('');
const [whyUsUrl, setWhyUsUrl] = useState('');
const [whyUsResult, setWhyUsResult] = useState('');
const [whyUsLoading, setWhyUsLoading] = useState(false);

async function researchSchool() {
  setWhyUsLoading(true);
  try {
    const res = await fetch('/api/ai/essays/whyus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ schoolName: whyUsSchool, url: whyUsUrl || undefined }),
    });
    const { result } = await res.json();
    setWhyUsResult(result);
    // Also update cached data
    setData(prev => ({
      ...prev,
      whyUsResults: { ...prev.whyUsResults, [whyUsSchool]: result },
    }));
  } finally {
    setWhyUsLoading(false);
  }
}
```

#### Deadlines screen updates

Add a "Fetch Deadlines" button. On success, merge returned deadlines into
the existing `manualDeadlines` state array and re-save to the server.

---

### Component: Server Tests

**Use Cases**: SUC-001, SUC-002

Add to `tests/server/aiRecommendations.test.ts` (or a new file
`tests/server/webResearch.test.ts`):

- Mock `global.fetch` to return sample HTML
- Verify 401 for unauthenticated requests
- Verify `whyus` endpoint passes school name and page text to Claude
- Verify `scrape` endpoint iterates college list and merges deadlines
- Verify graceful handling when fetch returns an error

## Decisions

1. **No browser automation** — Standard `fetch` covers the vast majority of
   public university admissions pages. JavaScript-rendered SPAs are rare in
   this space. Saves significant complexity.
2. **Sequential fetching in deadline scraper** — Avoids rate-limiting by
   school sites. Acceptable latency for a background operation.
3. **Truncate to 8000 chars** — Keeps costs low; admissions pages' critical
   deadline info is almost always in the first portion of the page.
4. **Store whyUsResults as a map** — Allows multiple schools to be researched
   without overwriting previous results.

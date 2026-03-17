---
status: draft
from-architecture-version: collegenav-005
to-architecture-version: collegenav-006
---

# Sprint 006 Technical Plan

## Architecture Version

- **From version**: `collegenav-005` — All screens with persistence, no AI
- **To version**: `collegenav-006` — Claude API recommendations on 5 screens

## Architecture Overview

```
server/
  src/
    services/
      claude.ts           ← Anthropic SDK wrapper; builds prompts, calls API
    routes/
      ai.ts               ← POST /api/ai/* endpoints, all requireAuth

client/
  src/
    pages/screens/
      Activities.tsx      ← "Get Recommendations" button + display
      Exams.tsx           ← "Get Recommendation" button + display
      Colleges.tsx        ← "Get Major Recommendations" button + display
      Decide.tsx          ← "Generate Comparison" button + display
      FinancialAid.tsx    ← "Find Scholarships" button + display

server/
  prisma/
    schema.prisma         ← Add aiRecommendations Json field to each relevant model
    migrations/           ← New migration
```

## Component Design

### Component: Prisma Schema — AI Cache Fields

**Use Cases**: SUC-001 through SUC-006

Add a `aiRecommendations Json @default("{}")` field to:
- `StudentActivities` — stores extracurricular recs and course warnings
- `StudentExams` — stores SAT/ACT recommendation and rationale
- `StudentColleges` — stores major recommendations
- `StudentDecide` — stores pros/cons comparison
- `StudentFinancialAid` — stores scholarship matches

---

### Component: Claude Service (`server/src/services/claude.ts`)

**Use Cases**: SUC-001 through SUC-006

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function askClaude(prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = msg.content[0];
  return block.type === 'text' ? block.text : '';
}
```

Responses are plain text — the frontend renders them in a `<pre>` or styled
`<div>`. No streaming for now (simplifies error handling and caching).

---

### Component: AI Endpoints (`server/src/routes/ai.ts`)

**Use Cases**: SUC-001 through SUC-006

Router mounted at `/api/ai`, all routes protected by `requireAuth`.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ai/activities/recommend` | Extracurricular recs + course load warning |
| `POST` | `/api/ai/exams/recommend` | SAT vs ACT recommendation |
| `POST` | `/api/ai/colleges/recommend` | Major + college recommendations |
| `POST` | `/api/ai/decide/compare` | Pros/cons comparison |
| `POST` | `/api/ai/financialaid/scholarships` | Scholarship matching |

Each endpoint:
1. Reads the student's stored data via Prisma
2. Builds a context-aware prompt
3. Calls `askClaude(prompt)`
4. Saves the result to `aiRecommendations` in the relevant model
5. Returns `{ result: string }`

**Example prompt — extracurricular recommendations:**
```
You are a college counselor helping a high school student.
Grade: 11
Interests: Science, Tech
GPA: (from profile)
Recommend 3–5 extracurricular activities and 2–3 summer programs
that would strengthen a college application in this student's interest areas.
Be specific. Format as a bulleted list.
```

---

### Component: React Screen Updates

**Use Cases**: SUC-001 through SUC-006

Each of the 5 screens gains:
1. Load `aiRecommendations` from the GET endpoint response (already returned by
   the existing screen data GET endpoints after schema update)
2. A button ("Get Recommendations", "Generate Comparison", etc.)
3. A loading spinner while the POST is in flight
4. The returned text rendered in the recommendation section

The cached recommendation is shown immediately on load if present.

---

### Component: Server Tests

**Use Cases**: SUC-001 through SUC-006

Mock the `@anthropic-ai/sdk` module. Verify:
- 401 for unauthenticated requests
- Prompt includes expected student context fields
- Result is saved to `aiRecommendations`
- Cached result is returned without re-calling Claude if already present

## Decisions

1. **No streaming** — responses returned as JSON strings. Simplifies caching
   and error handling. Streaming can be added in a later sprint.
2. **Cache per model** — AI results cached in the same Prisma model as the
   screen data, in a `aiRecommendations` JSONB field. Avoids a separate table.
3. **Re-generate on demand** — students can click the button again to get a
   fresh response, which overwrites the cache.
4. **`claude-sonnet-4-6`** — specified in the project overview as the AI model.

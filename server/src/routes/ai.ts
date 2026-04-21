import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { askClaude } from '../services/claude';
import { fetchPageText } from '../services/webFetch';
import { getMajorSalaries } from '../services/scorecard';

export const aiRouter = Router();

aiRouter.use(requireAuth);

const sid = (req: Request) => (req.user as any).id as number;

// --- Activities: extracurricular recommendations + course load warning ---

aiRouter.post('/activities/recommend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const student = req.user as any;
    const acts = await prisma.studentActivities.findUnique({ where: { studentId } });

    const interests = Array.isArray(acts?.interests) ? (acts.interests as string[]).join(', ') : 'not specified';
    const grade = student.grade ?? 11;

    const prompt = `You are a college counselor helping a high school student (Grade ${grade}).
Their interests are: ${interests}.

1. Recommend 3–5 extracurricular activities and 2–3 summer programs that would strengthen a college application for someone with these interests. Be specific and practical.
2. Review their course plan (AP courses per grade): ${JSON.stringify(acts?.coursePlan ?? {})}.
   If any grade has more than 3 AP courses, warn them clearly and suggest removing one.

Format your response with two sections:
## Recommendations
(bulleted list of activities and summer programs)

## Course Load
(either "Your course load looks balanced." or a specific warning)`;

    const result = await askClaude(prompt);

    await prisma.studentActivities.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { activities: result } },
      update: { aiRecommendations: { activities: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Exams: SAT vs ACT recommendation ---

aiRouter.post('/exams/recommend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const student = req.user as any;
    const exams = await prisma.studentExams.findUnique({ where: { studentId } });

    const apCourses = Array.isArray(exams?.apCourses) ? (exams.apCourses as string[]) : [];
    const grade = student.grade ?? 11;

    const prompt = `You are a college counselor. A Grade ${grade} student is deciding between the SAT and ACT.
They are taking these AP courses: ${apCourses.join(', ') || 'none listed'}.

Based on typical student profiles:
- SAT: better for strong readers, math-focused students, students applying to highly selective schools
- ACT: better for students who prefer science/reasoning sections, faster test-takers, broader college applicants

Give a clear recommendation (SAT or ACT) with 2–3 sentences of rationale. Also suggest 2 prep resources.
Format:
## Recommendation
(SAT or ACT, with rationale)

## Prep Resources
(2 specific resources)`;

    const result = await askClaude(prompt);

    await prisma.studentExams.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { exam: result } },
      update: { aiRecommendations: { exam: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Colleges: major and college recommendations ---

aiRouter.post('/colleges/recommend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const colleges = await prisma.studentColleges.findUnique({ where: { studentId } });
    const majorAnswers = (colleges?.majorAnswers as any) ?? {};

    const salaryData = await getMajorSalaries();
    const salaryLines = Object.entries(salaryData)
      .map(([major, salary]) => `- ${major}: $${salary.toLocaleString()}/yr`)
      .join('\n');
    const salaryBlock = salaryLines
      ? `\nVerified median earnings 4 years after graduation (U.S. Dept. of Education, College Scorecard):\n${salaryLines}\nUse these figures when citing salary for the majors listed above. For majors not listed, estimate based on similar fields.\n`
      : '';

    const prompt = `You are a college counselor helping a student choose a college major.
Salary goal: ${majorAnswers.salaryGoal || 'not specified'}
Interest area: ${majorAnswers.interestArea || 'not specified'}
${salaryBlock}
Recommend 4–5 college majors that align with these goals. For each, include:
- Major name
- Median salary (use verified figure above if available, otherwise estimate)
- Why it fits this student's goals
- 2–3 specific colleges known for this major

Format as a numbered list.`;

    const result = await askClaude(prompt);

    await prisma.studentColleges.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { majors: result } },
      update: { aiRecommendations: { majors: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Colleges: Why Us? content for a specific school ---

aiRouter.post('/colleges/whyus', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const { college } = req.body as { college: string };
    if (!college) return res.status(400).json({ error: 'college is required' });

    const colleges = await prisma.studentColleges.findUnique({ where: { studentId } });
    const majorAnswers = (colleges?.majorAnswers as any) ?? {};
    const aiRecs = (colleges?.aiRecommendations as any) ?? {};

    const interestArea = majorAnswers.interestArea || 'not specified';
    const salaryGoal = majorAnswers.salaryGoal || 'not specified';
    const majorRecs = aiRecs.majors ? `\nPreviously recommended majors for this student:\n${aiRecs.majors}` : '';

    const prompt = `You are a college admissions counselor with deep knowledge of US universities.

A student is researching ${college} for their college list.
Their professional interest areas: ${interestArea}
Their salary goal: ${salaryGoal}${majorRecs}

Using your knowledge of ${college}, provide:

## Programs & Departments
List 3–4 specific, real programs, majors, or departments at ${college} that align with this student's interests. Use actual program names.

## Research & Opportunities
List 2–3 specific research centers, labs, institutes, or signature opportunities at ${college} relevant to this student.

## What Makes It Distinctive
2–3 specific things about ${college}'s culture, pedagogy, or resources that set it apart for someone with these interests — things worth mentioning in a "Why Us?" essay.

Be specific and accurate. Only include things you are confident are real features of ${college}.`;

    const result = await askClaude(prompt);
    res.json({ result });
  } catch (err) { next(err); }
});

// --- Decide: pros/cons comparison ---

aiRouter.post('/decide/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const decide = await prisma.studentDecide.findUnique({ where: { studentId } });
    const colleges = await prisma.studentColleges.findUnique({ where: { studentId } });
    const majorAnswers = (colleges?.majorAnswers as any) ?? {};

    const decisions = Array.isArray(decide?.decisions) ? (decide.decisions as any[]) : [];
    const accepted = decisions.filter(d => d.result === 'Accepted').map(d => d.school);

    if (accepted.length < 2) {
      return res.json({ result: 'Add at least 2 accepted schools to generate a comparison.' });
    }

    const schoolList = accepted.map((s: string, i: number) => `School ${i + 1}: ${s}`).join('\n');
    const schoolSections = accepted.map((s: string) => `## ${s} Pros\n(3–4 bullet points)`).join('\n\n');

    const prompt = `You are a college counselor helping a student choose between colleges.
${schoolList}
Student's interest area: ${majorAnswers.interestArea || 'not specified'}
Student's salary goal: ${majorAnswers.salaryGoal || 'not specified'}

Compare these schools for this student. For each school provide a pros section, then end with a recommendation.

${schoolSections}

## Recommendation
(1–2 sentences on which school best fits this student's goals, with specific reasons)`;

    const result = await askClaude(prompt);

    await prisma.studentDecide.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { comparison: result } },
      update: { aiRecommendations: { comparison: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Decide: honors program info ---

aiRouter.post('/decide/honors', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { school } = req.body as { school?: string };
    if (!school?.trim()) return res.status(400).json({ error: 'school is required' });

    const prompt = `You are a college counselor. Provide a brief, accurate summary of the honors program at ${school}.

Include:
- **Program name** (official name of the honors college or program, if it exists)
- **Key benefits** (2–3 bullet points: small classes, research, housing, scholarships, etc.)
- **How to apply** (1 sentence: application timing and any requirements like GPA or essay)
- **Worth it?** (1 sentence honest assessment for a motivated student)

If ${school} does not have a distinct honors program, say so briefly and mention any honors-track options or similar programs.
Be specific and accurate. Keep it concise — 6–8 lines total.`;

    const result = await askClaude(prompt);
    res.json({ result });
  } catch (err) { next(err); }
});

// --- Financial Aid: scholarship matching ---

aiRouter.post('/financialaid/scholarships', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const aid = await prisma.studentFinancialAid.findUnique({ where: { studentId } });
    const answers = (aid?.scholarshipAnswers as Record<string, any>) ?? {};

    const lines: string[] = [];
    if (answers.firstGen === 'yes') lines.push('First-generation college student');
    if (answers.financialNeed === 'yes') lines.push('Has demonstrated financial need');
    if (answers.gpa) lines.push(`GPA range: ${answers.gpa}`);
    if (answers.field) lines.push(`Intended field: ${answers.field}`);
    if (answers.major) lines.push(`Specific major/goal: ${answers.major}`);
    if (answers.state) lines.push(`State: ${answers.state}`);
    if (Array.isArray(answers.activities) && answers.activities.length > 0)
      lines.push(`Activities: ${answers.activities.join(', ')}`);
    if (answers.background) lines.push(`Background: ${answers.background}`);
    const profile = lines.length > 0 ? lines.join('\n') : 'no specific profile information provided';

    const prompt = `You are a college counselor helping a student find scholarships.
Student profile:
${profile}

Recommend 4–5 real scholarships that match this student's profile. For each, include:
- Scholarship name
- Award amount
- Eligibility criteria
- Application deadline (typical)
- Application URL or where to find it

Format as a numbered list.`;

    const result = await askClaude(prompt);

    await prisma.studentFinancialAid.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { scholarships: result } },
      update: { aiRecommendations: { scholarships: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Essays: "Why Us?" assistant ---

aiRouter.post('/essays/whyus', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const { schoolName, url } = req.body as { schoolName: string; url?: string };

    const fetchUrl = url || `https://www.google.com/search?q=${encodeURIComponent(schoolName + ' admissions why attend')}`;
    let pageText = '';
    try {
      pageText = await fetchPageText(fetchUrl);
    } catch {
      pageText = '';
    }

    const prompt = `You are a college admissions counselor.
A student is writing a "Why Us?" essay for ${schoolName}.
${pageText ? `Here is text from the school's website:\n\n${pageText}\n\n` : ''}
List 3–5 specific programs, values, or opportunities the student should mention in their "Why Us?" essay for ${schoolName}.
Be specific — use actual program names and details${pageText ? ' from the text above' : ''}.
Format as a numbered list.`;

    const result = await askClaude(prompt);

    const existing = await prisma.studentEssays.findUnique({ where: { studentId } });
    const currentResults = (existing?.whyUsResults as Record<string, string>) ?? {};
    const updatedResults = { ...currentResults, [schoolName]: result };

    await prisma.studentEssays.upsert({
      where: { studentId },
      create: { studentId, whyUsResults: updatedResults },
      update: { whyUsResults: updatedResults },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Essays: brainstorm topics ---

aiRouter.post('/essays/brainstorm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const student = req.user as any;
    const { essayType, theme } = req.body as { essayType?: string; theme?: string };

    const grade = student.grade ?? 11;
    const acts = await prisma.studentActivities.findUnique({ where: { studentId } });
    const interests = Array.isArray(acts?.interests) ? (acts.interests as string[]).join(', ') : 'not specified';

    const essayTypeLabel = essayType || 'Personal Statement';
    const themeNote = theme?.trim() ? `\nThe student is considering this theme or topic: ${theme}` : '';

    const prompt = `You are a college essay coach helping a Grade ${grade} student brainstorm ideas for their ${essayTypeLabel}.
Student's interests: ${interests}${themeNote}

Generate 5–6 specific, compelling essay topic ideas. For each:
- Give it a short title
- Describe the core story or angle in 1–2 sentences
- Note what quality or growth it could reveal about the student

Format each as:
**[Title]**
Story: [description]
Reveals: [what it shows about the student]`;

    const result = await askClaude(prompt);
    res.json({ result });
  } catch (err) { next(err); }
});

// --- Essays: feedback on draft ---

aiRouter.post('/essays/feedback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { essayText, essayType, prompt: essayPrompt } = req.body as { essayText: string; essayType?: string; prompt?: string };

    if (!essayText?.trim()) return res.status(400).json({ error: 'essayText is required' });

    const wordCount = essayText.trim().split(/\s+/).length;
    const essayTypeLabel = essayType || 'college essay';
    const promptNote = essayPrompt?.trim() ? `\nEssay prompt: "${essayPrompt}"` : '';

    const prompt = `You are a college essay coach reviewing a student's ${essayTypeLabel} draft (${wordCount} words).${promptNote}

Essay:
"""
${essayText}
"""

Provide structured feedback:

## Overall Impression
1–2 sentences on the essay's current state and the single most important priority.

## Strengths
2–3 specific things that are working well, with examples from the text.

## Areas to Improve
3–4 specific, actionable suggestions. Be direct and encouraging.

## Line-Level Notes
2–3 specific sentences or phrases to revise, each with a suggested revision or direction.`;

    const result = await askClaude(prompt);
    res.json({ result });
  } catch (err) { next(err); }
});

// --- Deadlines: look up deadlines from college list using Claude's knowledge ---

aiRouter.post('/deadlines/scrape', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const colleges = await prisma.studentColleges.findUnique({ where: { studentId } });
    const collegeList = Array.isArray(colleges?.collegeList) ? (colleges.collegeList as any[]) : [];

    if (collegeList.length === 0) {
      return res.json({ result: 'No colleges on your list yet.', deadlines: [] });
    }

    const names = collegeList.map((c: any) => c.name || c).filter(Boolean).join(', ');

    const prompt = `You are a college admissions expert with knowledge of US university application deadlines.

For each of these schools, list their application deadlines: ${names}

Return ONLY a valid JSON array. Each item must have exactly these fields:
- "school": the school name (string)
- "type": one of "Early Decision", "Early Action", "Regular Decision", or "Rolling Admissions"
- "date": the deadline date as "Month Day" (e.g. "November 1", "January 15")

Include all applicable deadline types for each school. Omit types that don't apply.
Return ONLY the JSON array with no explanation or markdown fences.`;

    const raw = await askClaude(prompt);
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return res.json({ result: 'Could not parse deadlines.', deadlines: [] });

    let deadlines: any[] = [];
    try {
      deadlines = JSON.parse(match[0]);
    } catch {
      return res.json({ result: 'Could not parse deadlines.', deadlines: [] });
    }

    // Attach variant from the student's college list
    const variantMap = new Map<string, string>();
    for (const c of collegeList as any[]) {
      if (c.name) variantMap.set(c.name.toLowerCase(), c.variant ?? 'target');
    }
    const enriched = deadlines.map((d: any) => ({
      school: d.school,
      label: d.type,
      date: d.date,
      variant: variantMap.get((d.school ?? '').toLowerCase()) ?? 'target',
    }));

    await prisma.studentDeadlines.upsert({
      where: { studentId },
      create: { studentId, manualDeadlines: enriched },
      update: { manualDeadlines: enriched },
    });

    res.json({ result: `Loaded ${enriched.length} deadlines for ${collegeList.length} schools.`, deadlines: enriched });
  } catch (err) { next(err); }
});

// --- Exams: AP study schedule ---

aiRouter.post('/exams/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const exams = await prisma.studentExams.findUnique({ where: { studentId } });
    const apCourses = Array.isArray(exams?.apCourses) ? (exams.apCourses as string[]) : [];

    const now = new Date();
    const nextMay = new Date(now.getFullYear(), 4, 1); // May 1
    if (nextMay < now) nextMay.setFullYear(now.getFullYear() + 1);
    const weeksUntil = Math.ceil((nextMay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const planWeeks = Math.min(weeksUntil, 12);

    const prompt = `You are a study coach for a high school student taking AP exams in May.
AP courses: ${apCourses.join(', ') || 'not specified'}
Weeks until exams: ${weeksUntil}

Create a week-by-week study plan for the next ${planWeeks} weeks.
For each week, specify: which course(s) to focus on and 1–2 specific study tasks.
Format as a numbered list (Week 1: ..., Week 2: ...).`;

    const result = await askClaude(prompt);

    const existing = await prisma.studentExams.findUnique({ where: { studentId } });
    const currentRecs = (existing?.aiRecommendations as Record<string, any>) ?? {};
    await prisma.studentExams.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { ...currentRecs, schedule: result } },
      update: { aiRecommendations: { ...currentRecs, schedule: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { askClaude } from '../services/claude';

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

    const prompt = `You are a college counselor helping a student choose a college major.
Salary goal: ${majorAnswers.salaryGoal || 'not specified'}
Interest area: ${majorAnswers.interestArea || 'not specified'}

Recommend 4–5 college majors that align with these goals. For each, include:
- Major name
- Average starting salary
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

    const school1 = accepted[0];
    const school2 = accepted[1];

    const prompt = `You are a college counselor helping a student choose between two colleges.
School 1: ${school1}
School 2: ${school2}
Student's interest area: ${majorAnswers.interestArea || 'not specified'}
Student's salary goal: ${majorAnswers.salaryGoal || 'not specified'}

Compare these two schools for this student. Provide:
## ${school1} Pros
(3–4 bullet points)

## ${school2} Pros
(3–4 bullet points)

## Recommendation
(1–2 sentences on which school better fits this student's goals, with specific reasons)`;

    const result = await askClaude(prompt);

    await prisma.studentDecide.upsert({
      where: { studentId },
      create: { studentId, aiRecommendations: { comparison: result } },
      update: { aiRecommendations: { comparison: result } },
    });

    res.json({ result });
  } catch (err) { next(err); }
});

// --- Financial Aid: scholarship matching ---

aiRouter.post('/financialaid/scholarships', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = sid(req);
    const aid = await prisma.studentFinancialAid.findUnique({ where: { studentId } });
    const answers = (aid?.scholarshipAnswers as Record<string, boolean>) ?? {};

    const tags = Object.entries(answers).filter(([, v]) => v).map(([k]) => k.replace(/_/g, ' ')).join(', ');

    const prompt = `You are a college counselor helping a student find scholarships.
Student profile tags: ${tags || 'no specific profile tags selected'}

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

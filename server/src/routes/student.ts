import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma';
import { requireAuth } from '../middleware/requireAuth';

export const studentRouter = Router();

studentRouter.use(requireAuth);

const studentId = (req: Request) => (req.user as any).id as number;

// --- Profile ---

studentRouter.get('/student/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId(req) },
      select: { name: true, email: true, highSchool: true, grade: true },
    });
    res.json(student);
  } catch (err) { next(err); }
});

studentRouter.put('/student/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, highSchool, grade } = req.body;
    const updated = await prisma.student.update({
      where: { id: studentId(req) },
      data: { name, highSchool, grade: Number(grade) },
      select: { name: true, email: true, highSchool: true, grade: true },
    });
    res.json(updated);
  } catch (err) { next(err); }
});

// --- Activities ---

studentRouter.get('/student/activities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentActivities.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ interests: data.interests, coursePlan: data.coursePlan });
  } catch (err) { next(err); }
});

studentRouter.put('/student/activities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { interests, coursePlan } = req.body;
    await prisma.studentActivities.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), interests, coursePlan },
      update: { interests, coursePlan },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Exams ---

studentRouter.get('/student/exams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentExams.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ testPreference: data.testPreference, apCourses: data.apCourses });
  } catch (err) { next(err); }
});

studentRouter.put('/student/exams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testPreference, apCourses } = req.body;
    await prisma.studentExams.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), testPreference, apCourses },
      update: { testPreference, apCourses },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Colleges ---

studentRouter.get('/student/colleges', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentColleges.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ majorAnswers: data.majorAnswers, collegeList: data.collegeList });
  } catch (err) { next(err); }
});

studentRouter.put('/student/colleges', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { majorAnswers, collegeList } = req.body;
    await prisma.studentColleges.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), majorAnswers, collegeList },
      update: { majorAnswers, collegeList },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Essays ---

studentRouter.get('/student/essays', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentEssays.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ driveLink: data.driveLink, notes: data.notes });
  } catch (err) { next(err); }
});

studentRouter.put('/student/essays', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driveLink, notes } = req.body;
    await prisma.studentEssays.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), driveLink, notes },
      update: { driveLink, notes },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Rec Letters ---

studentRouter.get('/student/recletters', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentRecLetters.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ checklist: data.checklist, teachers: data.teachers });
  } catch (err) { next(err); }
});

studentRouter.put('/student/recletters', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { checklist, teachers } = req.body;
    await prisma.studentRecLetters.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), checklist, teachers },
      update: { checklist, teachers },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Portals ---

studentRouter.get('/student/portals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentPortals.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ portals: data.portals });
  } catch (err) { next(err); }
});

studentRouter.put('/student/portals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { portals } = req.body;
    await prisma.studentPortals.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), portals },
      update: { portals },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Decide ---

studentRouter.get('/student/decide', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentDecide.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ decisions: data.decisions });
  } catch (err) { next(err); }
});

studentRouter.put('/student/decide', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decisions } = req.body;
    await prisma.studentDecide.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), decisions },
      update: { decisions },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Financial Aid ---

studentRouter.get('/student/financialaid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentFinancialAid.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ fafsaChecklist: data.fafsaChecklist, scholarshipAnswers: data.scholarshipAnswers });
  } catch (err) { next(err); }
});

studentRouter.put('/student/financialaid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fafsaChecklist, scholarshipAnswers } = req.body;
    await prisma.studentFinancialAid.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), fafsaChecklist, scholarshipAnswers },
      update: { fafsaChecklist, scholarshipAnswers },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Deadlines ---

studentRouter.get('/student/deadlines', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.studentDeadlines.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req) },
      update: {},
    });
    res.json({ manualDeadlines: data.manualDeadlines });
  } catch (err) { next(err); }
});

studentRouter.put('/student/deadlines', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { manualDeadlines } = req.body;
    await prisma.studentDeadlines.upsert({
      where: { studentId: studentId(req) },
      create: { studentId: studentId(req), manualDeadlines },
      update: { manualDeadlines },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// --- Progress ---

studentRouter.get('/student/progress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sid = studentId(req);
    const [acts, exams, colleges, essays, recs, portals, decide, aid, deadlines] = await Promise.all([
      prisma.studentActivities.findUnique({ where: { studentId: sid } }),
      prisma.studentExams.findUnique({ where: { studentId: sid } }),
      prisma.studentColleges.findUnique({ where: { studentId: sid } }),
      prisma.studentEssays.findUnique({ where: { studentId: sid } }),
      prisma.studentRecLetters.findUnique({ where: { studentId: sid } }),
      prisma.studentPortals.findUnique({ where: { studentId: sid } }),
      prisma.studentDecide.findUnique({ where: { studentId: sid } }),
      prisma.studentFinancialAid.findUnique({ where: { studentId: sid } }),
      prisma.studentDeadlines.findUnique({ where: { studentId: sid } }),
    ]);

    const pct = (n: number, max: number) => Math.min(100, Math.round((n / max) * 100));

    const interestCount = Array.isArray(acts?.interests) ? (acts.interests as any[]).length : 0;
    const coursePlan = (acts?.coursePlan as any) ?? {};
    const coursePlanFilled = Object.values(coursePlan).reduce((s: number, v) =>
      s + (Array.isArray(v) && v.length > 0 ? 1 : 0), 0) as number;
    const activitiesPct = pct(interestCount + coursePlanFilled, 10);

    const examsPct = pct(
      (exams?.testPreference ? 1 : 0) +
      (Array.isArray(exams?.apCourses) && (exams.apCourses as any[]).length > 0 ? 1 : 0),
      2
    );

    const collegeListLen = Array.isArray(colleges?.collegeList) ? (colleges.collegeList as any[]).length : 0;
    const collegesPct = pct(collegeListLen, 20);

    const essaysPct = pct(
      (essays?.driveLink ? 1 : 0) + (essays?.notes ? 1 : 0),
      2
    );

    const checklist = (recs?.checklist as Record<string, boolean>) ?? {};
    const checklistKeys = Object.keys(checklist);
    const checklistChecked = checklistKeys.filter(k => checklist[k]).length;
    const recsPct = checklistKeys.length > 0 ? pct(checklistChecked, checklistKeys.length) : 0;

    const portalCount = Array.isArray(portals?.portals) ? (portals.portals as any[]).length : 0;
    const portalsPct = pct(portalCount, 3);

    const decisions = Array.isArray(decide?.decisions) ? (decide.decisions as any[]) : [];
    const decidedCount = decisions.filter(d => d.result).length;
    const decidePct = decisions.length > 0 ? pct(decidedCount, decisions.length) : 0;

    const fafsaChecklist = (aid?.fafsaChecklist as Record<string, boolean>) ?? {};
    const fafsaKeys = Object.keys(fafsaChecklist);
    const fafsaChecked = fafsaKeys.filter(k => fafsaChecklist[k]).length;
    const scholarshipAnswers = (aid?.scholarshipAnswers as Record<string, any>) ?? {};
    const scholarshipFilled = Object.values(scholarshipAnswers).filter(Boolean).length;
    const aidPct = pct(fafsaChecked + scholarshipFilled, Math.max(fafsaKeys.length + 4, 1));

    const deadlineCount = Array.isArray(deadlines?.manualDeadlines) ? (deadlines.manualDeadlines as any[]).length : 0;
    const deadlinesPct = pct(deadlineCount, 5);

    res.json({
      activities: activitiesPct,
      exams: examsPct,
      colleges: collegesPct,
      essays: essaysPct,
      recletters: recsPct,
      portals: portalsPct,
      decide: decidePct,
      financialaid: aidPct,
      deadlines: deadlinesPct,
    });
  } catch (err) { next(err); }
});

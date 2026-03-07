import request from 'supertest';
import bcrypt from 'bcryptjs';

// Set test environment before any imports that might touch the DB
process.env.NODE_ENV = 'test';

// In-memory student store for mocking Prisma
interface MockStudent {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  highSchool: string;
  grade: number;
  createdAt: Date;
  updatedAt: Date;
}

const studentStore: Map<string, MockStudent> = new Map();
let nextId = 1;

jest.mock('../../server/src/services/prisma', () => ({
  initPrisma: async () => {},
  prisma: {
    student: {
      findUnique: async ({ where }: { where: { email: string } }) => {
        return studentStore.get(where.email) ?? null;
      },
      create: async ({ data }: { data: Omit<MockStudent, 'id' | 'createdAt' | 'updatedAt'> }) => {
        const student: MockStudent = {
          id: nextId++,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        studentStore.set(student.email, student);
        return student;
      },
    },
  },
}));

import app from '../../server/src/app';

const PASSWORD = 'password123';
let signupEmail: string;

beforeEach(() => {
  // Unique email per test run
  signupEmail = `student-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
});

afterAll(() => {
  studentStore.clear();
});

describe('POST /api/auth/signup', () => {
  it('creates student and returns 201 with student fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Jane Doe',
      email: signupEmail,
      password: PASSWORD,
      highSchool: 'Test High',
      grade: 11,
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'Jane Doe',
      email: signupEmail,
      highSchool: 'Test High',
      grade: 11,
      type: 'student',
    });
    expect(res.body.id).toBeDefined();
  });

  it('does NOT include passwordHash in response', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Jane Doe',
      email: signupEmail,
      password: PASSWORD,
      highSchool: 'Test High',
      grade: 11,
    });
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('returns 409 on duplicate email', async () => {
    const email = `dup-${Date.now()}@example.com`;
    await request(app).post('/api/auth/signup').send({
      name: 'First', email, password: PASSWORD, highSchool: 'HS', grade: 9,
    });
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Second', email, password: PASSWORD, highSchool: 'HS', grade: 9,
    });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: signupEmail,
      password: PASSWORD,
      highSchool: 'Test High',
      grade: 10,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when grade is out of range (< 8)', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Jane', email: signupEmail, password: PASSWORD, highSchool: 'HS', grade: 7,
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when grade is out of range (> 12)', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Jane', email: signupEmail, password: PASSWORD, highSchool: 'HS', grade: 13,
    });
    expect(res.status).toBe(400);
  });

  it('sets session cookie on success', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Jane', email: signupEmail, password: PASSWORD, highSchool: 'HS', grade: 11,
    });
    expect(res.status).toBe(201);
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  let loginEmail: string;

  beforeEach(async () => {
    // Pre-create a student for login tests
    loginEmail = `login-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    await request(app).post('/api/auth/signup').send({
      name: 'Login User',
      email: loginEmail,
      password: PASSWORD,
      highSchool: 'Login High',
      grade: 10,
    });
  });

  it('returns 200 and student fields on valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: loginEmail, password: PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: loginEmail, type: 'student' });
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: loginEmail, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 401 on unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: PASSWORD });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('sets session cookie on success', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: loginEmail, password: PASSWORD });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

describe('GET /api/auth/me', () => {
  let meEmail: string;

  beforeEach(async () => {
    meEmail = `me-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    await request(app).post('/api/auth/signup').send({
      name: 'Me User', email: meEmail, password: PASSWORD, highSchool: 'My High', grade: 12,
    });
  });

  it('returns 401 when not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns student fields when logged in as student', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: meEmail, password: PASSWORD });
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: meEmail, type: 'student' });
    expect(res.body).not.toHaveProperty('passwordHash');
  });
});

describe('POST /api/auth/logout', () => {
  let logoutEmail: string;

  beforeEach(async () => {
    logoutEmail = `logout-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    await request(app).post('/api/auth/signup').send({
      name: 'Logout User', email: logoutEmail, password: PASSWORD, highSchool: 'Logout High', grade: 9,
    });
  });

  it('destroys session and returns { success: true }', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: logoutEmail, password: PASSWORD });
    const res = await agent.post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('/me returns 401 after logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: logoutEmail, password: PASSWORD });
    await agent.post('/api/auth/logout');
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

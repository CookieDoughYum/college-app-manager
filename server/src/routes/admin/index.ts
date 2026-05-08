import { Router } from 'express';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { adminAuthRouter } from './auth.js';
import { adminEnvRouter } from './env.js';
import { adminDbRouter } from './db.js';
import { adminConfigRouter } from './config.js';
import { adminLogsRouter } from './logs.js';
import { adminSessionsRouter } from './sessions.js';

export const adminRouter = Router();

// Auth routes (login/check don't require admin, logout does but is harmless)
adminRouter.use(adminAuthRouter);

// All other admin routes require authentication
adminRouter.use('/admin', requireAdmin);

// Protected admin routes
adminRouter.use('/admin', adminEnvRouter);
adminRouter.use('/admin', adminDbRouter);
adminRouter.use('/admin', adminConfigRouter);
adminRouter.use('/admin', adminLogsRouter);
adminRouter.use('/admin', adminSessionsRouter);

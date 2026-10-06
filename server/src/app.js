import enquiryRoutes from './routes/enquiryRoutes.js';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import { businessReviewRouter, reviewRouter } from './routes/reviewRoutes.js';

const app = express();

app.use(cors({ origin: env.clientUrl }));

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/businesses', businessReviewRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api', enquiryRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

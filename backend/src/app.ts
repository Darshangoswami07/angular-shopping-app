import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import express from 'express';
import { env } from '#/config/env.js';
import { errorHandler, notFoundHandler } from '#/middleware/error.middleware.js';
import authRoutes from '#/routes/auth.routes.js';
import productRoutes from '#/routes/product.routes.js';
import categoryRoutes from '#/routes/category.routes.js';
import cartRoutes from '#/routes/cart.routes.js';
import wishlistRoutes from '#/routes/wishlist.routes.js';
import orderRoutes from '#/routes/order.routes.js';

export const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// Body parsing
app.use(express.json() as any);
app.use(express.urlencoded({ extended: true }) as any);
app.use(cookieParser() as any);

// Compression
app.use(compression() as any);

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter as any);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

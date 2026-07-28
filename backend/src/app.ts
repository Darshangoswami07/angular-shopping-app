import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import express, { type Request, type Response, type RequestHandler } from 'express';
import { env } from '#/config/env.js';
import { errorHandler, notFoundHandler } from '#/middleware/error.middleware.js';
import authRoutes from '#/routes/auth.routes.js';
import productRoutes from '#/routes/product.routes.js';
import categoryRoutes from '#/routes/category.routes.js';
import cartRoutes from '#/routes/cart.routes.js';
import wishlistRoutes from '#/routes/wishlist.routes.js';
import orderRoutes from '#/routes/order.routes.js';
import brandRoutes from '#/routes/brand.routes.js';
import faqRoutes from '#/routes/faq.routes.js';
import statsRoutes from '#/routes/stats.routes.js';
import reviewRoutes from '#/routes/review.routes.js';
import addressRoutes from '#/routes/address.routes.js';
import contactRoutes from '#/routes/contact.routes.js';

export const app = express();

// Security middleware
app.use(helmet());

// Dynamic CORS Configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development mode, dynamically permit localhost and 127.0.0.1 on any port (VS Code Live Preview, Vite, Next.js, etc.)
    if (env.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin '${origin}' not allowed by server security policies.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser() as unknown as RequestHandler);

// Compression
app.use(compression() as unknown as RequestHandler);

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting. A single storefront page load fans out into a dozen-plus API
// calls (products, categories, brands, faqs, stats, reviews, several category
// rails), so the cap has to be generous enough for normal browsing per IP.
// In development every engineer/tab shares one machine's IP through the dev
// server, so a realistic cap there would still trip on ordinary hot-reload
// testing — only production needs the protective ceiling.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.nodeEnv === 'production' ? 2000 : 100000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter as unknown as RequestHandler);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

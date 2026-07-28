import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ContactController } from '#/controllers/contact.controller.js';
import { validate } from '#/middleware/validation.middleware.js';
import { createContactMessageSchema } from '#/validators/contact.validator.js';

const router = Router();
const contactController = new ContactController();

// Contact submission is unauthenticated by design, so it gets its own tighter
// limiter on top of the global one to make spamming the form costly.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many messages sent. Please try again later.',
});

router.post('/', contactLimiter, validate(createContactMessageSchema), contactController.createMessage);

export default router;

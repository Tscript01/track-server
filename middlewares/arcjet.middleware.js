// middlewares/arcjet.middleware.js
import aj from '../config/arcjet.js';
import { isSpoofedBot } from '@arcjet/inspect';

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          message: 'Bot detected and blocked.',
        });
      }
      return res.status(403).json({
        success: false,
        message: 'Access denied by security rules.',
      });
    }
    if (decision.ip.isHosting() || decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        success: false,
        message: 'Requests from hosting IPs or spoofed bots are not allowed.',
      });
    }
    req.arcjetDecision = decision;
    next();
  } catch (err) {
    next(err);
  }
};

export default arcjetMiddleware;

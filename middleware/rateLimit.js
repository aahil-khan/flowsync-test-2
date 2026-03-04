const rateLimiter = require('../utils/rateLimiter');

const createRateLimitMiddleware = (limit, windowMs) => {
  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    
    if (!rateLimiter.isAllowed(identifier, limit, windowMs)) {
      const remaining = rateLimiter.getRemainingRequests(identifier, limit, windowMs);
      const resetTime = rateLimiter.getResetTime(identifier, windowMs);
      
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000),
        resetTime,
        remaining
      });
    }
    
    const remaining = rateLimiter.getRemainingRequests(identifier, limit, windowMs);
    res.set('X-RateLimit-Limit', limit.toString());
    res.set('X-RateLimit-Remaining', remaining.toString());
    res.set('X-RateLimit-Reset', rateLimiter.getResetTime(identifier, windowMs));
    
    next();
  };
};

// Predefined limits for common endpoints
const LIMITS = {
  auth: { limit: 5, windowMs: 15 * 60 * 1000 },          // 5 requests per 15 minutes
  taskCreate: { limit: 20, windowMs: 60 * 60 * 1000 },   // 20 requests per hour
  taskRead: { limit: 100, windowMs: 60 * 60 * 1000 },    // 100 requests per hour
  general: { limit: 30, windowMs: 60 * 1000 }            // 30 requests per minute
};

module.exports = {
  createRateLimitMiddleware,
  LIMITS
};

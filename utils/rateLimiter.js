// Simple in-memory rate limiter with sliding window
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  isAllowed(identifier, limit, windowMs) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key);
    
    // Remove old requests outside the window
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    this.requests.set(key, validTimestamps);
    
    if (validTimestamps.length < limit) {
      validTimestamps.push(now);
      return true;
    }
    
    return false;
  }

  getRemainingRequests(identifier, limit, windowMs) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.requests.has(key)) {
      return limit;
    }
    
    const timestamps = this.requests.get(key);
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    
    return Math.max(0, limit - validTimestamps.length);
  }

  getResetTime(identifier, windowMs) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.requests.has(key) || this.requests.get(key).length === 0) {
      return new Date(now + windowMs).toISOString();
    }
    
    const timestamps = this.requests.get(key);
    const oldestRequest = Math.min(...timestamps);
    const resetTime = new Date(oldestRequest + windowMs);
    
    return resetTime.toISOString();
  }
}

module.exports = new RateLimiter();

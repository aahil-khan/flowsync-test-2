const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
      userId: req.userId || 'anonymous',
      ip: req.ip,
      userAgent: req.get('user-agent')
    }));
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = requestLogger;

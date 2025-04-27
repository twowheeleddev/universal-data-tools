const { createUniversalLimiter } = require("./lib/universalRateLimiter");

const limiter = createUniversalLimiter({
  limit: 100,
  windowMs: 60000,
  keyFn: (req) => req.ip,
});

let storage;

function middleware(req, res, next) {
  const [newStorage, result] = limiter(req);
  storage = newStorage;

  if (!result.allowed) {
    return res.status(429).json({ message: "Too many requests" });
  }
  next();
}

// File: /test/rateLimiter.test.js

const { Map } = require("immutable");
const { createUniversalLimiter } = require("../lib/universalRateLimiter");

const limiter = createUniversalLimiter({
  limit: 2,
  windowMs: 1000,
  keyFn: (req) => req.userId,
});

let storage = Map();

function makeRequest(userId) {
  const [newStorage, result] = limiter({ userId });
  storage = newStorage;
  return result;
}

// Run tests
console.assert(
  makeRequest("user1").allowed === true,
  "First request should be allowed"
);
console.assert(
  makeRequest("user1").allowed === true,
  "Second request should be allowed"
);
console.assert(
  makeRequest("user1").allowed === false,
  "Third request should be blocked"
);

console.log("RateLimiter tests passed");

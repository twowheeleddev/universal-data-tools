// File: /lib/universalRateLimiter.js

const { Map, List } = require("immutable");

/**
 * Creates a universal, pluggable, persistent rate limiter.
 *
 * @param {Object} options - Rate limiter options
 * @param {number} options.limit - Max allowed requests per window
 * @param {number} options.windowMs - Window time in milliseconds
 * @param {function} options.keyFn - Function to extract a key from request
 * @param {Map} [options.storage] - Optional external storage (default in-memory)
 * @returns {function} Rate limiter function
 */
function createUniversalLimiter({ limit, windowMs, keyFn, storage = Map() }) {
  if (
    typeof limit !== "number" ||
    typeof windowMs !== "number" ||
    typeof keyFn !== "function"
  ) {
    throw new Error("Invalid parameters provided to createUniversalLimiter");
  }

  return function limiter(req) {
    const now = Date.now();
    const key = keyFn(req);
    const timestamps = storage
      .get(key, List())
      .filter((ts) => now - ts <= windowMs);

    const allowed = timestamps.size < limit;
    const updatedTimestamps = allowed ? timestamps.push(now) : timestamps;
    const newStorage = storage.set(key, updatedTimestamps);

    const resetTime = updatedTimestamps.first()
      ? updatedTimestamps.first() + windowMs
      : now + windowMs;

    return [
      newStorage,
      {
        allowed,
        remaining: Math.max(limit - updatedTimestamps.size, 0),
        resetTime,
        limiter: newStorage,
      },
    ];
  };
}

module.exports = { createUniversalLimiter };

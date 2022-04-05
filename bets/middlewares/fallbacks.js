"use strict";

/**
 * 404 error page
 *
 * @type {import("express").RequestHandler}
 */
exports.error404 = (req, res) => {
  res.status(404);
  res.send({ error: `404 - not found` });
};

/**
 * Custom error page
 *
 * @type {import("express").ErrorRequestHandler}
 */
exports.error = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);
  const code = err.code || 500;
  const msg = err.msg || `server error`;

  res.status(code);
  res.send({ error: `${code} - ${msg}` });
};

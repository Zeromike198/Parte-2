"use strict";

const { User } = require(`../db/user`);

/**
 * Check if the user is logged.
 *
 * @type {import("express").RequestHandler}
 */
exports.auth = async (req, res, next) => {
  // Check if the user is logged in
  const userId = req.session.userId;
  const user = await User.findByPk(userId);

  if (user === null) {
    next({ code: 401, msg: `unauthenticated` });
  }

  // Continue
  req.user = user;
  return next();
};

/**
 * Check if the user is admin
 *
 * @type {import("express").RequestHandler}
 */
exports.admin = async (req, res, next) => {
  // Check if the user is admin
  const user = req.user;

  if (!user.admin) {
    next({ code: 403, msg: `unauthorized` });
  }

  // Continue
  return next();
};

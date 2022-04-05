"use strict";

const { User } = require(`../db/user`);

/**
 * Check if the user is logged.
 *
 * @type {import("express").RequestHandler}
 */
exports.authPage = async (req, res, next) => {
  // Check if the user is logged in
  const userId = req.session.userId;
  const user = await User.findByPk(userId);

  if (user === null) {
    return res.redirect(`/login`);
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
exports.adminPage = async (req, res, next) => {
  // Check if the user is admin
  const user = req.user;

  console.log(user.admin);

  if (!user.admin) {
    return res.redirect(`/error?code=403&message=Unauthorized`);
  }

  // Continue
  return next();
};

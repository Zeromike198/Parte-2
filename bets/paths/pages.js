"use strict";

const { User } = require(`../db/user`);

/**
 * Index page.
 *
 * @type {import("express").RequestHandler}
 */
exports.indexPage = async (req, res, next) => {
  res.render(`index`);
};

/**
 * Render the login page for not logged in users.
 *
 * Redirect to index for logged in users.
 *
 * @type {import("express").RequestHandler}
 */
exports.loginPage = async (req, res, next) => {
  // Check if the user is logged in
  const userId = req.session.userId;
  const user = await User.findByPk(userId);

  if (user) {
    return res.redirect(`/`);
  }

  // Render login page
  res.render(`login`);
};

/**
 * User page.
 *
 * @type {import("express").RequestHandler}
 */
exports.userPage = async (req, res, next) => {
  res.render(`user`);
};

/**
 * Create user page.
 *
 * @type {import("express").RequestHandler}
 */
exports.userCreatePage = async (req, res, next) => {
  res.render(`user-create`);
};

/**
 * Users page.
 *
 * @type {import("express").RequestHandler}
 */
exports.usersPage = async (req, res, next) => {
  res.render(`users`);
};

/**
 * Bet page.
 *
 * @type {import("express").RequestHandler}
 */
exports.betPage = async (req, res, next) => {
  res.render(`bet`);
};

/**
 * Create bet page.
 *
 * @type {import("express").RequestHandler}
 */
exports.betCreatePage = async (req, res, next) => {
  res.render(`bet-create`);
};


/**
 * Bets page.
 *
 * @type {import("express").RequestHandler}
 */
exports.betsPage = async (req, res, next) => {
  res.render(`bets`);
};

/**
 * Error page.
 *
 * @type {import("express").RequestHandler}
 */
exports.errorPage = async (req, res, next) => {
  res.render(`error`, { code: req.query.code, message: req.query.message });
};

"use strict";

const { compare } = require(`bcrypt`);
const { User } = require(`../db/user`);
const { checkEmpty } = require("../helpers/validator");

/**
 * Authenticate user.
 *
 * @type {import("express").RequestHandler}
 */
exports.login = async (req, res, next) => {
  try {
    // Get and validate user
    const user = await User.findOne({ where: { username: checkEmpty(req.body.username) }});
    if (user === null) {
      return next({ code: 404, msg: `not found`});
    }

    // Authenticate user
    const valid = await compare(checkEmpty(req.body.password), user.password);
    if (!valid) {
      return next({ code: 401, msg: `not valid username or password` });
    }

    // Update session
    req.session.userId = user.id;

    // Send user information
    user.password = undefined;
    res.send(user);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Close session.
 *
 * @type {import(`express`).RequestHandler}
 */
exports.logout = (req, res) => {
  try {
    req.session.destroy();
    res.send({ msg: `session closed` });
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

"use strict";

const { hash } = require("bcrypt");
const { User } = require("../db/user");
const { checkEmpty, checkBoolean, checkNegative } = require("../helpers/validator");

/**
 * List users.
 *
 * @type {import("express").RequestHandler}
 */
exports.listUsers = async (req, res) => {
  try {
    // Get list of users and returns it
    const users = await User.findAll();
    users.forEach(user => { user.password = undefined; });
    res.send(users);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Get user.
 *
 * @type {import("express").RequestHandler}
 */
  exports.getUser = async (req, res, next) => {
  try {
    // Get and validate user
    const user = await User.findByPk(req.params.id);

    if (user === null) {
      return next({ code: 404, msg: `user not found` });
    }

    // Return user
    user.password = undefined;
    res.send(user);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Create a new user.
 *
 * @type {import("express").RequestHandler}
 */
exports.createUser = async (req, res, next) => {
  try {
    // Insert new user
    const user = await User.create({
      username: checkEmpty(req.body.username),
      fullName: checkEmpty(req.body.fullName),
      password: await hash(checkEmpty(req.body.password), 10),
      admin: checkBoolean(req.body.admin),
      money: checkNegative(req.body.money),
    });

    if (user === null) throw new Error(`cannot insert the user`);

    // Return inserted user
    user.password = undefined;
    res.send(user);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Update user.
 *
 * @type {import("express").RequestHandler}
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Validate user
    const user = await User.findByPk(req.params.id);

    if (user === null) {
      return next({ code: 404, msg: `user not found` });
    }

    if (user.id === req.user.id && user.admin !== req.user.admin) {
      return next({ code: 403, msg: `a user cannot remove the administrator flag itself` });
    }

    // Update user
    user.set(`username`, checkEmpty(req.body.username));
    user.set(`fullName`, checkEmpty(req.body.fullName));
    user.set(`admin`, checkEmpty(req.body.admin));

    if (req.body.password) {
      user.set(`password`, await hash(checkEmpty(req.body.password), 10));
    }

    await user.save();

    // Return user
    user.password = undefined;
    res.send(user);
  }
    catch(err) {
      next({ code: 500, msg: err.message });
  }
};

/**
 * Delete user.
 *
 * @type {import("express").RequestHandler}
 */
exports.deleteUser = async (req, res, next) => {
  try {
    // Validate user
    const user = await User.findByPk(req.params.id);

    if (user === null) {
      return next({ code: 404, msg: `user not found` });
    }

    if (user === req.user.id) {
      return next({ code: 403, msg: `a user cannot delete itself`})
    }

    // Delete user
    await user.destroy();

    // Return deleted user
    user.password = undefined;
    res.send(user);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Load money.
 *
 * @type {import("express").RequestHandler}
 */
exports.loadMoney = async (req, res, next) => {
  try {
    // Validate user
    const user = await User.findByPk(req.params.id);

    if (user === null) {
      return next({ code: 404, msg: `user not found` });
    }

    if (user.id === req.user.id) {
      return next({ code: 403, msg: `cannot load money to yourself` });
    }

    // Update user
    user.set(`money`, user.money + checkNegative(req.body.ammount));

    await user.save();

    // Return user
    user.password = undefined;
    res.send(user);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

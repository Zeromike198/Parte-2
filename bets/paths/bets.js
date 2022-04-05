"use strict";

const { sequelize } = require("../db");
const { Bet } = require(`../db/bet`);
const { BetEntry } = require("../db/bet-entry");
const { User } = require("../db/user");
const { checkEmpty, checkNatural, checkNegative } = require("../helpers/validator");

/**
 * List bets.
 *
 * @type {import("express").RequestHandler}
 */
exports.listBets = async (req, res) => {
  try {
    // Get list of bets and returns it
    const bets = await Bet.findAll();
    res.send(bets);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Get bet.
 *
 * @type {import("express").RequestHandler}
 */
exports.getBet = async (req, res, next) => {
  try {
    // Get and validate bet
    const bet = await Bet.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: BetEntry, include: User },
      ],
    });

    if (bet === null) {
      return next({ code: 404, msg: `bet not found` });
    }

    // Return bet
    bet.BetEntries.forEach(({ User }) => { User.password = undefined; });
    res.send(bet);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Create a new bet.
 *
 * @type {import("express").RequestHandler}
 */
exports.createBet = async (req, res, next) => {
  try {
    const min = checkNatural(req.body.min);
    const max = checkNatural(req.body.max);

    if (min > max) {
      return next({ code: 400, msg: `min could not be greater than max` });
    }

    // Insert new bet
    const bet = await Bet.create({
      name: checkEmpty(req.body.name),
      open: true,
      min,
      max,
    });

    // Return inserted bet
    res.send(bet);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Update bet.
 *
 * @type {import("express").RequestHandler}
 */
exports.updateBet = async (req, res, next) => {
  try {
    // Get and validate bet
    const bet = await Bet.findByPk(req.params.id);

    if (bet === null) {
      return next({ code: 404, msg: `bet not found` });
    }

    // Update bet
    bet.set(`name`, checkEmpty(req.body.name));
    await bet.save();

    // Return bet
    res.send(bet);
  }
  catch(err) {
    next({ code: 500, msg: err.message });
  }
};

/**
 * Delete bet.
 *
 * @type {import("express").RequestHandler}
 */
exports.deleteBet = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate bet
    const bet = await Bet.findByPk(req.params.id, {
      transaction,
      include: BetEntry
    });

    if (bet === null) {
      return next({ code: 404, msg: `bet not found` });
    }

    for (const e of bet.BetEntries) {
      await e.destroy({ transaction });
    }

    // Delete and return bet
    await bet.destroy({ transaction });
    await transaction.commit();

    res.send(bet);
  }
  catch(err) {
    await transaction.rollback();
    next({ code: 500, msg: err.message });
  }
};

/**
 * Do bet
 *
 * @type {import("express").RequestHandler}
 */
exports.doBet = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const bet = await Bet.findByPk(req.params.id, {
      transaction,
      include: [{ model: BetEntry, include: User }],
    });

    if (bet === null) {
      return next({ code: 404, msg: `bet not found` });
    }

    const ammount = checkNegative(req.body.ammount);
    const value = checkNatural(req.body.value);

    if (req.user.money < ammount) {
      await transaction.rollback();
      return next({ code: 403, msg: `you don't have enough money` });
    }
    if (bet.BetEntries.find(e => e.value === value)) {
      await transaction.rollback();
      return next({ code: 403, msg: `this value has been taken` });
    }
    if (bet.BetEntries.find(e => e.UserId === req.user.id)) {
      await transaction.rollback();
      return next({ code: 403, msg: `this user has already participated in this bet` });
    }
    if (bet.min > value || bet.max < value) {
      await transaction.rollback();
      return next({ code: 400, msg: `valut out of range` });
    }

    const entry = await BetEntry.create({
      ammount,
      value,
      UserId: req.user.id,
      BetId: bet.id,
    }, { transaction });

    req.user.set(`money`, req.user.money - ammount);
    await req.user.save({ transaction });

    await transaction.commit();

    // Return bet
    await bet.reload();
    res.send(bet);
  }
  catch(err) {
    await transaction.rollback();
    next({ code: 500, msg: err.message });
  }
};

/**
 * Close bet
 *
 * @type {import("express").RequestHandler}
 */
exports.closeBet = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const bet = await Bet.findByPk(req.params.id, {
      transaction,
      include: [
        { model: User },
        { model: BetEntry, include: User }
      ],
    });

    if (bet === null) {
      await transaction.rollback();
      return next({ code: 404, msg: `bet not found` });
    }
    if (!bet.open) {
      await transaction.rollback();
      return next({ code: 403, msg: `bet is already closed` });
    }

    const rang = bet.max - bet.min;
    const value = Math.round(bet.min + Math.random() * rang);
    let entry = null;
    let ammount = 0;

    for (const e of bet.BetEntries) {
      ammount += e.ammount;
      if (e.value === value) {
        entry = e;
      }
    }

    bet.set(`open`, false);
    bet.set(`value`, value);

    if (entry) {
      bet.set(`UserId`, entry.User.id);
      entry.User.set(`money`, ammount + entry.User.money);

      await entry.User.save({ transaction });
    }
    else {
      for (const e of bet.BetEntries) {
        e.User.set(`money`, e.User.money + e.ammount);
        await e.User.save({ transaction });
      }
    }

    await bet.save({ transaction });
    await transaction.commit();

    // Return bet
    await bet.reload();
    bet.BetEntries.forEach(({ User }) => { User.password = undefined; });
    res.send(bet);
  }
  catch(err) {
    await transaction.rollback();
    next({ code: 500, msg: err.message });
  }
};

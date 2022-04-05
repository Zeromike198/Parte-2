"use strict";

/** Default error message */
const DEF_MSG = `the given value is not valid`;

/**
 * Check if the given value is boolean.
 *
 * @param {boolean} b Boolean to check
 * @param {string} [msg] Error message
 * @returns `true` if the given value is boolean
 */
exports.checkBoolean = (b, msg) => {
  if (typeof b === `boolean`) {
    return b;
  };

  throw new TypeError(msg || DEF_MSG);
};

/**
 * Check if the given number is natural.
 *
 * Zero is also considered a natural number.
 *
 * @param {number} n Number to check
 * @param {string} [msg] Error message
 * @returns `true` if the given number is natural
 */
exports.checkNatural = (n, msg) => {
  if (Number.isInteger(n) && n >= 0) {
    return n;
  }

  throw new TypeError(msg || DEF_MSG);
};

/**
 * Check if the given number is not negative.
 *
 * @param {number} n Number to check
 * @param {string} [msg] Error message
 * @returns `true` if the given number is not negative
 */
exports.checkNegative = (n, msg) => {
  if (Number.isFinite(n) && n >= 0) {
    return n;
  }

  throw new TypeError(msg || DEF_MSG);
};

/**
 * Check if the given string is not empty.
 *
 * @param {string} str String to check
 * @param {string} [msg] Error message
 * @returns `true` if the string is not empty
 */
exports.checkEmpty = (str, msg) => {
  if (typeof str === `string`) {
    const trimmed = str.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }

  throw new TypeError(msg || DEF_MSG);
};

/**
 * Check if the given value is a date instance.
 *
 * @param {Date} date Date to check
 * @param {string} [msg] Error message
 * @returns True if the given value is a date instance
 */
exports.checkDate = (date, msg) => {
  if (date instanceof Date) {
    return date;
  };

  throw new TypeError(msg || DEF_MSG);
};

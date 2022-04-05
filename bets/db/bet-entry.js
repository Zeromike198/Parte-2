"use strict";

const { DataTypes } = require(`sequelize`);
const { sequelize } = require(`.`);
const { Bet } = require(`./bet`);
const { User } = require("./user");

const BetEntry = sequelize.define(`BetEntry`, {
  ammount: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 1 } },
  value: { type: DataTypes.INTEGER.UNSIGNED, unique: true, allowNull: false, validate: { min: 1 } },
});

User.hasMany(BetEntry);
BetEntry.belongsTo(User, { foreignKey: { allowNull: false } });

Bet.hasMany(BetEntry);
BetEntry.belongsTo(Bet, { foreignKey: { allowNull: false } });

exports.BetEntry = BetEntry;

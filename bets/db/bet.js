"use strict";

const { DataTypes } = require(`sequelize`);
const { sequelize } = require(`.`);
const { User } = require(`./user`);

const Bet = sequelize.define(`Bet`, {
  name: { type: DataTypes.STRING, allowNull: false },
  open: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  value: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 1 } },
  min: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1 } },
  max: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 2 } },
});

User.hasMany(Bet);
Bet.belongsTo(User);

exports.Bet = Bet;

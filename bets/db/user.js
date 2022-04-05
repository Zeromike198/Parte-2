"use strict";

const { DataTypes } = require(`sequelize`);
const { sequelize } = require(`.`);

const User = sequelize.define(`User`, {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  admin: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
  money: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false, validate: { min: 0 } },
});

exports.User = User;

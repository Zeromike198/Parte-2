const { sequelize } = require("../db");
const { Bet } = require(`../db/bet`);
const { User } = require(`../db/user`);

/**
 * Truncate tables and close connection.
 */
const clean = async () => {
  await User.truncate();
  await Bet.truncate();
  await sequelize.close();
};

clean();

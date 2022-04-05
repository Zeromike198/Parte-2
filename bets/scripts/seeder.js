const { hash } = require(`bcrypt`);
const { sequelize } = require("../db");
require(`../db/bet-entry`);
const { Bet } = require(`../db/bet`);
const { User } = require(`../db/user`);

/**
 * Insert the dafault data to the database.
 */
const seed = async () => {
  // Setup data
  sequelize.sync();
  const password = `secretpass`;

  // Create the admin user
  await User.create({
    username: `admin`,
    fullName: `Administrator`,
    password: await hash(`wm${password}`, 10),
    admin: true,
  });

  // Create six default users
  for (let i = 1; i <= 6; ++i) {
    await User.create({
      username: `user${i}`,
      fullName: `User ${i}`,
      password: await hash(password, 10),
      money: 100,
    });
  }

  // Create one bet
  await Bet.create({ name: `Bet`, min: `1`, max: `6` });

  // Close connection
  await sequelize.close();
};

seed();

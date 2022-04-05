require(`dotenv`).config();
const session = require(`express-session`);
const { sequelize } = require("../db");

const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

exports.session = session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false
});
